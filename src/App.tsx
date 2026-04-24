/**
 * Hajimi Defense (萌新防御) - Main Game Component
 * 🐱 金金枪鱼罐头防御 - Cute cat tower defense game
 * 
 * 模块化架构 + 原始样式
 */

import { useState, useCallback, useRef, useEffect } from 'react';

// 配置
import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, TOWER_TYPES, INITIAL_GOLD, INITIAL_LIVES, WAVE_SPEED_BONUS, LEAK_SPEED_BONUS, TOWER_SPEED_BONUS, MOSQUITO_SPEED_BONUS, RAT_SPEED_BONUS, BOX_GOLD_REWARD, BOX_SCORE_REWARD, TOTAL_WAVES, ENEMY_SPAWN_INTERVAL, WAVE_TRANSITION_DELAY } from './game/constants';

// 系统
import { buildInitialMap, spawnBoxes, initGameState } from './game/mapSystem';
import { startWave as createWave } from './game/waveSystem';
import { spawnEnemy, moveEnemies, towerAttacks, updateProjectiles, calcKillReward } from './game/combatSystem';
import { spawnBreakBoxParticles, spawnPlaceTowerParticles, spawnKillEnemyParticles, updateParticles, createShakeState, applyShake, triggerShake, ShakeState } from './game/gameEngine';
import { useKeyboardHandler } from './game/keyboard';

// 渲染
import { renderGame } from './game/renderer';

// 类型
import type { GameState, Language, Enemy, GameStateRef } from './game/types';

// 国际化
import { TEXT } from './game/i18n';

// UI
import HUD from './game/components/HUD';
import GameOverlays from './game/components/GameOverlays';

// 样式
import { containerStyle, titleStyle, canvasWrapperStyle, canvasStyle, towerPanelStyle, towerButtonStyle } from './game/styles';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('start');
  const [lang, setLang] = useState<Language>('zh');
  const [gold, setGold] = useState(INITIAL_GOLD);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [selectedTowerType, setSelectedTowerType] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
  
  const t = TEXT(lang);
  const gameRef = useRef<GameStateRef>(initGameState([], [], [], [], []));
  const shakeRef = useRef<ShakeState>(createShakeState());
  const selectedTowerRef = useRef(selectedTowerType);
  const goldRef = useRef(gold);
  
  selectedTowerRef.current = selectedTowerType;
  goldRef.current = gold;
  
  // 回调
  const startWave = useCallback((waveNum: number) => {
    gameRef.current.enemiesToSpawn = createWave(waveNum);
    gameRef.current.enemySpawnTimer = 0;
    gameRef.current.waveInProgress = true;
  }, []);
  
  const startGame = useCallback(() => {
    const { map, path, paths, pathIds } = buildInitialMap();
    const boxes = spawnBoxes(map);
    gameRef.current = initGameState(map, path, paths, pathIds, boxes);
    shakeRef.current = createShakeState();
    setGold(INITIAL_GOLD); setLives(INITIAL_LIVES); setScore(0); setWave(1);
    setSelectedTowerType(-1); setIsPaused(false); setGameState('playing');
    startWave(1);
  }, [startWave]);
  
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const tileX = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const tileY = Math.floor((e.clientY - rect.top) / TILE_SIZE);
    const state = gameRef.current;
    
    const boxIdx = state.boxes.findIndex(b => b.x === tileX && b.y === tileY);
    if (boxIdx !== -1) {
      state.boxes.splice(boxIdx, 1); state.map[tileY][tileX] = 0;
      setGold(g => g + BOX_GOLD_REWARD); setScore(s => s + BOX_SCORE_REWARD);
      spawnBreakBoxParticles(state, tileX, tileY); return;
    }
    
    if (selectedTowerType >= 0 && tileX >= 0 && tileX < GRID_WIDTH && tileY >= 0 && tileY < GRID_HEIGHT && state.map[tileY][tileX] === 0) {
      const towerType = TOWER_TYPES[selectedTowerType];
      if (gold >= towerType.cost) {
        setGold(g => g - towerType.cost);
        state.towers.push({ x: tileX * TILE_SIZE + TILE_SIZE/2, y: tileY * TILE_SIZE + TILE_SIZE/2, type: selectedTowerType, lastAttack: 0, angle: 0 });
        state.map[tileY][tileX] = 4; spawnPlaceTowerParticles(state, tileX, tileY);
      }
    }
  }, [gameState, selectedTowerType, gold]);
  
  const handleCanvasHover = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    gameRef.current.hoverTile = { x: Math.floor((e.clientX - rect.left) / TILE_SIZE), y: Math.floor((e.clientY - rect.top) / TILE_SIZE) };
  }, []);
  
  const handleSelectTower = useCallback((type: number) => setSelectedTowerType(p => p === type ? -1 : type), []);
  const toggleLang = useCallback(() => setLang(p => p === 'zh' ? 'en' : 'zh'), []);
  const togglePause = useCallback(() => gameState === 'playing' && setIsPaused(p => !p), [gameState]);
  
  // 游戏循环 - 内联简化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const onDamageEnemy = (enemy: Enemy) => {
      const { gold: g, score: s } = calcKillReward(enemy);
      setGold(o => o + g); setScore(o => o + s);
      spawnKillEnemyParticles(gameRef.current, enemy);
      const idx = gameRef.current.enemies.indexOf(enemy);
      if (idx !== -1) gameRef.current.enemies.splice(idx, 1);
    };
    
    const update = (timestamp: number) => {
      if (gameState !== 'playing' || isPaused) return;
      const state = gameRef.current;
      
      if (state.enemiesToSpawn.length > 0) {
        state.enemySpawnTimer++;
        if (state.enemySpawnTimer >= ENEMY_SPAWN_INTERVAL) {
          state.enemySpawnTimer = 0;
          state.enemies.push(spawnEnemy(state, state.enemiesToSpawn.shift()!, wave));
        }
      }
      
      moveEnemies(state, () => { triggerShake(shakeRef.current, 10, 15); setLives(l => { const n = l - 1; if (n <= 0) setGameState('gameover'); return n; }); });
      towerAttacks(state, timestamp);
      updateProjectiles(state, onDamageEnemy);
      updateParticles(state);
      
      if (state.waveInProgress && state.enemiesToSpawn.length === 0 && state.enemies.length === 0) {
        state.waveInProgress = false;
        setTimeout(() => { if (gameState === 'playing') setWave(n => { const w = n + 1; if (w > TOTAL_WAVES) setGameState('victory'); else startWave(w); return w; }); }, WAVE_TRANSITION_DELAY);
      }
    };
    
    const render = () => {
      const shake = applyShake(shakeRef.current);
      ctx.setTransform(1, 0, 0, 1, shake.offsetX, shake.offsetY);
      renderGame(ctx, gameRef.current, gameRef.current.hoverTile, selectedTowerRef.current, goldRef.current);
    };
    
    let animationId = requestAnimationFrame(function loop(t) { update(t); render(); animationId = requestAnimationFrame(loop); });
    return () => cancelAnimationFrame(animationId);
  }, [gameState, wave, startWave, isPaused]);
  
  // 键盘
  useKeyboardHandler(gameState, togglePause);
  
  const enemySpeedMultiplier = 1 + (wave - 1) * WAVE_SPEED_BONUS + gameRef.current.enemiesLeaked * LEAK_SPEED_BONUS + gameRef.current.towers.length * TOWER_SPEED_BONUS + (wave >= 5 ? MOSQUITO_SPEED_BONUS : 0) + (wave >= 10 ? RAT_SPEED_BONUS : 0);
  
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>{t.title}</h1>
      <HUD wave={wave} gold={gold} lives={lives} score={score} towerCount={gameRef.current.towers.length} enemySpeedMultiplier={enemySpeedMultiplier} lang={lang} onToggleLang={toggleLang} onTogglePause={togglePause} isPaused={isPaused} />
      <div style={canvasWrapperStyle}>
        <canvas ref={canvasRef} width={GRID_WIDTH * TILE_SIZE} height={GRID_HEIGHT * TILE_SIZE} onClick={handleCanvasClick} onMouseMove={handleCanvasHover} style={canvasStyle} />
        {(gameState === 'start' || gameState === 'gameover' || gameState === 'victory') && <GameOverlays state={gameState} lang={lang} score={score} onStart={startGame} onResume={togglePause} />}
        {gameState === 'playing' && isPaused && <GameOverlays state="paused" lang={lang} score={0} onStart={startGame} onResume={togglePause} />}
      </div>
      <div style={towerPanelStyle}>
        {TOWER_TYPES.map((tower, idx) => (
          <button key={idx} onClick={() => handleSelectTower(idx)} disabled={gold < tower.cost} style={towerButtonStyle({ selected: selectedTowerType === idx, disabled: gold < tower.cost })}>
            <span style={{ fontSize: '36px', marginBottom: '5px' }}>🐱</span>
            <span style={{ fontFamily: 'Fredoka One, cursive', fontSize: '14px', color: selectedTowerType === idx ? 'white' : '#5D4037' }}>{t.towerNames?.[idx] || tower.name}</span>
            <span style={{ fontSize: '16px', color: selectedTowerType === idx ? 'white' : '#FFA000', fontWeight: 800 }}>{tower.cost}</span>
          </button>
        ))}
      </div>
    </div>
  );
}