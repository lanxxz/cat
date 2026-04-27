/**
 * Hajimi Defense (萌新防御) - Main Game Component
 * 🐱 金金枪鱼罐头防御 - Cute cat tower defense game
 * 
 * 模块化架构 + 原始样式
 */

import { useState, useCallback, useRef, useEffect } from 'react';

// 配置
import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, TOWER_TYPES, INITIAL_GOLD, INITIAL_LIVES, WAVE_SPEED_BONUS, LEAK_SPEED_BONUS, TOWER_SPEED_BONUS, MOSQUITO_SPEED_BONUS, RAT_SPEED_BONUS, BOX_GOLD_REWARD, BOX_SCORE_REWARD, TOTAL_WAVES, ENEMY_SPAWN_INTERVAL, WAVE_TRANSITION_DELAY, TUTORIAL_TRANSITION_DELAY, LEVEL_ANNOUNCEMENT_DURATION, LEVEL1_WAVE } from './game/constants';

// 系统
import { buildInitialMap, spawnBoxes, initGameState } from './game/mapSystem';
import { startWave as createWave } from './game/waveSystem';
import { spawnEnemy, moveEnemies, towerAttacks, updateProjectiles, calcKillReward } from './game/combatSystem';
import { spawnBreakBoxParticles, spawnPlaceTowerParticles, spawnKillEnemyParticles, updateParticles, createShakeState, applyShake, triggerShake, ShakeState } from './game/gameEngine';
import { useKeyboardHandler } from './game/keyboard';

// 渲染
import { renderGame } from './game/renderer';

// 类型
import type { GameState, Language, Enemy, GameStateRef, Level, TutorialStep } from './game/types';

// 国际化
import { TEXT } from './game/i18n';

// UI
import HUD from './game/components/HUD';
import GameOverlays from './game/components/GameOverlays';
import { TutorialGuide } from './game/components';

// 样式
import { containerStyle, titleStyle, canvasWrapperStyle, canvasStyle, towerPanelStyle, towerButtonStyle, towerPanelPhoneStyle, towerButtonPhoneStyle, levelAnnouncementOverlay, levelAnnouncementSubtitle } from './game/styles';

// 响应式 & 触控
import { useResponsiveScale } from './game/responsive';

// 路径解锁配置
const PATH_UNLOCK_WAVES: Record<number, { id: number; name: string; color: string }> = {
  4: { id: 1, name: 'Normal', color: '#80D8FF' },   // 第4波解锁 Normal
  6: { id: 0, name: 'Hard', color: '#FF8A80' }      // 第6波解锁 Hard
};

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
  const [pathUnlockNotification, setPathUnlockNotification] = useState<{ name: string; color: string } | null>(null);
  const [level, setLevel] = useState<Level>(1);
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>(0);
  const [levelAnnouncement, setLevelAnnouncement] = useState<{ text: string; subtitle?: string } | null>(null);
  
  const t = TEXT(lang);
  const gameRef = useRef<GameStateRef>(initGameState([], [], [], [], []));
  const shakeRef = useRef<ShakeState>(createShakeState());
  const selectedTowerRef = useRef(selectedTowerType);
  const goldRef = useRef(gold);
  const levelRef = useRef(level);
  const tutorialStepRef = useRef(tutorialStep);
  const langRef = useRef(lang);
  const tRef = useRef(t);
  
  selectedTowerRef.current = selectedTowerType;
  goldRef.current = gold;
  tutorialStepRef.current = tutorialStep;
  
  // 响应式适配 / Responsive adaptation
  const { isPhone, isTablet } = useResponsiveScale();
  
  // 检查路径解锁提示
  useEffect(() => {
    const notifications = gameRef.current?.pathUnlockNotifications;
    if (notifications && notifications.length > 0) {
      const notif = notifications.shift();
      if (notif) {
        const config = Object.values(PATH_UNLOCK_WAVES).find(p => p.id === notif.pathId);
        if (config) {
          setPathUnlockNotification({ name: config.name, color: config.color });
          setTimeout(() => setPathUnlockNotification(null), 3000);
        }
      }
    }
  }, [wave]);

  // 关卡公告自动消失 / Auto-dismiss level announcement
  useEffect(() => {
    if (levelAnnouncement) {
      const timer = setTimeout(() => setLevelAnnouncement(null), LEVEL_ANNOUNCEMENT_DURATION);
      return () => clearTimeout(timer);
    }
  }, [levelAnnouncement]);

  // Tutorial step 4: start Level 1 wave after "Ready!" delay
  useEffect(() => {
    if (tutorialStep === 4 && level === 1) {
      const timer = setTimeout(() => {
        const level1EnemyTypes: number[] = [];
        for (const group of LEVEL1_WAVE) {
          for (let i = 0; i < group.count; i++) {
            level1EnemyTypes.push(group.type);
          }
        }
        // Shuffle
        for (let i = level1EnemyTypes.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [level1EnemyTypes[i], level1EnemyTypes[j]] = [level1EnemyTypes[j], level1EnemyTypes[i]];
        }
        gameRef.current.enemiesToSpawn = level1EnemyTypes;
        gameRef.current.enemySpawnTimer = 0;
        gameRef.current.waveInProgress = true;
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [tutorialStep, level]);

  // 回调
  const startWave = useCallback((waveNum: number) => {
    gameRef.current.enemiesToSpawn = createWave(waveNum);
    gameRef.current.enemySpawnTimer = 0;
    gameRef.current.waveInProgress = true;
    // 清除待处理的路径解锁通知，避免重新开始时误触发
    gameRef.current.pathUnlockNotifications = [];
  }, []);
  
  const startGame = useCallback(() => {
    const { map, path, paths, pathIds } = buildInitialMap();
    const boxes = spawnBoxes(map);
    gameRef.current = initGameState(map, path, paths, pathIds, boxes);
    shakeRef.current = createShakeState();
    setGold(INITIAL_GOLD); setLives(INITIAL_LIVES); setScore(0); setWave(1);
    setSelectedTowerType(-1); setIsPaused(false); 
    setPathUnlockNotification(null);
    setLevel(1); setTutorialStep(1);
    setLevelAnnouncement({ text: t.level1Announcement });
    setGameState('playing');
    // Do NOT start wave yet — wait for tutorial completion (step 4 timeout)
  }, [t]);
  
  const handleCanvasClick = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    // Fix: account for CSS scaling when converting client coordinates to tile indices
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const tileX = Math.floor((e.clientX - rect.left) * scaleX / TILE_SIZE);
    const tileY = Math.floor((e.clientY - rect.top) * scaleY / TILE_SIZE);
    const state = gameRef.current;
    
    const boxIdx = state.boxes.findIndex(b => b.x === tileX && b.y === tileY);
    if (boxIdx !== -1) {
      state.boxes.splice(boxIdx, 1); state.map[tileY][tileX] = 0;
      setGold(g => g + BOX_GOLD_REWARD); if (level === 2) setScore(s => s + BOX_SCORE_REWARD);
      spawnBreakBoxParticles(state, tileX, tileY);
      if (tutorialStep === 1) setTutorialStep(2);
      return;
    }
    
    if (selectedTowerType >= 0 && tileX >= 0 && tileX < GRID_WIDTH && tileY >= 0 && tileY < GRID_HEIGHT && state.map[tileY][tileX] === 0) {
      const towerType = TOWER_TYPES[selectedTowerType];
      if (gold >= towerType.cost) {
        setGold(g => g - towerType.cost);
        state.towers.push({ x: tileX * TILE_SIZE + TILE_SIZE/2, y: tileY * TILE_SIZE + TILE_SIZE/2, type: selectedTowerType, lastAttack: 0, angle: 0 });
        state.map[tileY][tileX] = 4; spawnPlaceTowerParticles(state, tileX, tileY);
        if (tutorialStep === 3) setTutorialStep(4);
      }
    }
  }, [gameState, selectedTowerType, gold, tutorialStep, level]);
  
  const handleCanvasHover = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    // Fix: account for CSS scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    gameRef.current.hoverTile = {
      x: Math.floor((e.clientX - rect.left) * scaleX / TILE_SIZE),
      y: Math.floor((e.clientY - rect.top) * scaleY / TILE_SIZE)
    };
  }, []);
  
  const handleSelectTower = useCallback((type: number) => {
    setSelectedTowerType(p => p === type ? -1 : type);
    if (tutorialStep === 2 && selectedTowerType !== type) setTutorialStep(3);
  }, [tutorialStep, selectedTowerType]);
  const toggleLang = useCallback(() => setLang(p => p === 'zh' ? 'en' : 'zh'), []);
  const togglePause = useCallback(() => gameState === 'playing' && setIsPaused(p => !p), [gameState]);
  
  // 游戏循环 - 内联简化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    levelRef.current = level;
    langRef.current = lang;
    tRef.current = t;
    tutorialStepRef.current = tutorialStep;
    
    const onDamageEnemy = (enemy: Enemy) => {
      const { gold: g, score: s } = calcKillReward(enemy);
      setGold(o => o + g); if (levelRef.current === 2) setScore(o => o + s);
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
        
        // Level 1 completion detection - fires when all enemies cleared in tutorial
        if (levelRef.current === 1 && tutorialStepRef.current === 4) {
          setTutorialStep(0);
          setLevelAnnouncement({ text: tRef.current.level1Complete });
          
          setTimeout(() => {
            // Full reset for Level 2
            const { map, path, paths, pathIds } = buildInitialMap();
            const boxes = spawnBoxes(map);
            gameRef.current = initGameState(map, path, paths, pathIds, boxes);
            shakeRef.current = createShakeState();
            setGold(INITIAL_GOLD); setLives(INITIAL_LIVES); setScore(0); setWave(1);
            setSelectedTowerType(-1); setIsPaused(false); setGameState('playing');
            setPathUnlockNotification(null);
            setLevel(2);
            setTutorialStep(0);
            setLevelAnnouncement({ text: tRef.current.level2Announcement, subtitle: tRef.current.level2Subtitle });
            
            // Start Level 2 wave 1 normally
            gameRef.current.enemiesToSpawn = createWave(1);
            gameRef.current.enemySpawnTimer = 0;
            gameRef.current.waveInProgress = true;
          }, TUTORIAL_TRANSITION_DELAY);
          
          return; // Skip the rest of the wave completion handling
        }
        
        if (levelRef.current !== 1) {
          // 检查路径解锁
          const nextWave = wave + 1;
          if (PATH_UNLOCK_WAVES[nextWave]) {
            const unlockConfig = PATH_UNLOCK_WAVES[nextWave];
            if (!state.unlockedPaths.includes(unlockConfig.id)) {
              state.unlockedPaths.push(unlockConfig.id);
              state.pathUnlockNotifications.push({ pathId: unlockConfig.id, wave: nextWave });
            }
          }
          
          setTimeout(() => { 
            if (gameState === 'playing') {
              setWave(n => { 
                const w = n + 1; 
                if (w > TOTAL_WAVES) setGameState('victory'); 
                else startWave(w); 
                return w; 
              }); 
            }
          }, WAVE_TRANSITION_DELAY);
        }
      }
    };
    
    const render = () => {
      const shake = applyShake(shakeRef.current);
      ctx.setTransform(1, 0, 0, 1, shake.offsetX, shake.offsetY);
      renderGame(ctx, gameRef.current, gameRef.current.hoverTile, selectedTowerRef.current, goldRef.current, tutorialStepRef.current);
    };
    
    let animationId = requestAnimationFrame(function loop(t) { update(t); render(); animationId = requestAnimationFrame(loop); });
    return () => cancelAnimationFrame(animationId);
  }, [gameState, wave, startWave, isPaused]);
  
  // 键盘
  useKeyboardHandler(gameState, togglePause);
  
  const enemySpeedMultiplier = 1 + (wave - 1) * WAVE_SPEED_BONUS + gameRef.current.enemiesLeaked * LEAK_SPEED_BONUS + gameRef.current.towers.length * TOWER_SPEED_BONUS + (wave >= 5 ? MOSQUITO_SPEED_BONUS : 0) + (wave >= 10 ? RAT_SPEED_BONUS : 0);
  
  return (
    <div style={containerStyle}>
      <h1 style={{ ...titleStyle, fontSize: isPhone ? '24px' : isTablet ? '36px' : '48px' }}>{t.title}</h1>
      <HUD wave={wave} level={level} gold={gold} lives={lives} score={score} towerCount={gameRef.current.towers.length} enemySpeedMultiplier={enemySpeedMultiplier} lang={lang} onToggleLang={toggleLang} onTogglePause={togglePause} isPaused={isPaused} isPhone={isPhone} />
      <div style={canvasWrapperStyle}>
        <canvas ref={canvasRef} width={GRID_WIDTH * TILE_SIZE} height={GRID_HEIGHT * TILE_SIZE} onPointerDown={handleCanvasClick} onPointerMove={handleCanvasHover} style={canvasStyle} />
        {/* 教程向导 / Tutorial guide */}
        <TutorialGuide step={tutorialStep} lang={lang} level={level} />
        {/* 关卡公告 / Level announcement */}
        {levelAnnouncement && (
          <div style={levelAnnouncementOverlay}>
            <div>{levelAnnouncement.text}</div>
            {levelAnnouncement.subtitle && (
              <div style={levelAnnouncementSubtitle}>{levelAnnouncement.subtitle}</div>
            )}
          </div>
        )}
        {/* 路径解锁提示 */}
        {pathUnlockNotification && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: pathUnlockNotification.color,
            color: 'white',
            padding: '15px 30px',
            borderRadius: '12px',
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: 'Fredoka One, cursive',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            animation: 'bounce 0.5s ease-out',
            zIndex: 100
          }}>
            🚀 {pathUnlockNotification.name} 路线解锁！
          </div>
        )}
        {(gameState === 'start' || gameState === 'gameover' || gameState === 'victory') && <GameOverlays state={gameState} lang={lang} score={score} onStart={startGame} onResume={togglePause} isPhone={isPhone} />}
        {gameState === 'playing' && isPaused && <GameOverlays state="paused" lang={lang} score={0} onStart={startGame} onResume={togglePause} isPhone={isPhone} />}
      </div>
      <div style={isPhone ? towerPanelPhoneStyle : towerPanelStyle}>
        {TOWER_TYPES.map((tower, idx) => (
          <button key={idx} onClick={() => handleSelectTower(idx)} disabled={gold < tower.cost} style={(isPhone ? towerButtonPhoneStyle : towerButtonStyle)({ selected: selectedTowerType === idx, disabled: gold < tower.cost })}>
            <span style={{ fontSize: isPhone ? '28px' : '36px', marginBottom: isPhone ? '2px' : '5px' }}>🐱</span>
            {!isPhone && <span style={{ fontFamily: 'Fredoka One, cursive', fontSize: '14px', color: selectedTowerType === idx ? 'white' : '#5D4037' }}>{t.towerNames?.[idx] || tower.name}</span>}
            <span style={{ fontSize: isPhone ? '14px' : '16px', color: selectedTowerType === idx ? 'white' : '#FFA000', fontWeight: 800 }}>{tower.cost}</span>
          </button>
        ))}
      </div>
    </div>
  );
}