/**
 * Hajimi Defense (萌新防御) - Main Game Component
 * 🐱 金金枪鱼罐头防御 - Cute cat tower defense game
 * 
 * 模块化架构 + 原始样式
 */

import { useState, useCallback, useRef, useEffect } from 'react';

// 配置
import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, TOWER_TYPES, INITIAL_GOLD, INITIAL_LIVES, WAVE_SPEED_BONUS, LEAK_SPEED_BONUS, TOWER_SPEED_BONUS, MOSQUITO_SPEED_BONUS, RAT_SPEED_BONUS, BOX_GOLD_REWARD, BOX_SCORE_REWARD, TOTAL_WAVES, ENEMY_SPAWN_INTERVAL, WAVE_TRANSITION_DELAY, TUTORIAL_TRANSITION_DELAY, LEVEL_ANNOUNCEMENT_DURATION, LEVEL1_WAVE, UPGRADE_UNLOCK_WAVE, getUpgradeCost, getUnlockCost, UPGRADE_GLOW_DURATION, LEVEL_COLORS, getSellValue, getTowerStats } from './game/constants';

// 系统
import { buildInitialMap, spawnBoxes, initGameState } from './game/mapSystem';
import { startWave as createWave } from './game/waveSystem';
import { spawnEnemy, moveEnemies, towerAttacks, updateProjectiles, calcKillReward } from './game/combatSystem';
import { spawnBreakBoxParticles, spawnPlaceTowerParticles, spawnKillEnemyParticles, spawnUpgradeParticles, updateParticles, createShakeState, applyShake, triggerShake, ShakeState, createUpgradeGlowState, updateUpgradeGlow, UpgradeGlowState } from './game/gameEngine';
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
import { containerStyle, titleStyle, canvasWrapperStyle, canvasStyle, towerPanelStyle, towerButtonStyle, towerPanelPhoneStyle, towerButtonPhoneStyle, upgradeModeButtonStyle, upgradeModeButtonPhoneStyle, levelAnnouncementOverlay, levelAnnouncementSubtitle, upgradePopupContainerStyle, upgradePopupButtonStyle, upgradePopupCloseStyle } from './game/styles';

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
  const [upgradeMode, setUpgradeMode] = useState(false);  // 升级模式 / Upgrade mode toggle
  const [selectedTowerIndex, setSelectedTowerIndex] = useState<number | null>(null);  // 选中防御塔索引 / Selected tower index
  
  const t = TEXT(lang);
  const gameRef = useRef<GameStateRef>(initGameState([], [], [], [], []));
  const shakeRef = useRef<ShakeState>(createShakeState());
  const upgradeGlowRef = useRef<UpgradeGlowState>(createUpgradeGlowState());  // 升级光环状态 / Upgrade glow state
  const selectedTowerRef = useRef(selectedTowerType);
  const upgradeModeRef = useRef(upgradeMode);  // 升级模式 ref / Upgrade mode ref (for game loop access)
  const selectedTowerIndexRef = useRef(selectedTowerIndex);  // 选中防御塔索引 ref / Selected tower index ref (for game loop)
  const goldRef = useRef(gold);
  const levelRef = useRef(level);
  const waveRef = useRef(wave);
  const tutorialStepRef = useRef(tutorialStep);
  const langRef = useRef(lang);
  const tRef = useRef(t);
  const handleSellRef = useRef<(index: number) => void>(() => {});  // 出售处理器 ref / Sell handler ref (for popup access)
  const handleUpgradeRef = useRef<(index: number) => void>(() => {});  // 升级处理器 ref / Upgrade handler ref (for popup access)
  
  selectedTowerRef.current = selectedTowerType;
  upgradeModeRef.current = upgradeMode;
  selectedTowerIndexRef.current = selectedTowerIndex;
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
        setTutorialStep(0); // 隐藏教程提示 / Hide tutorial text once enemies start
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
    upgradeGlowRef.current = createUpgradeGlowState();  // 重置升级光环 / Reset upgrade glow
    setGold(INITIAL_GOLD); setLives(INITIAL_LIVES); setScore(0); setWave(1);
    setSelectedTowerType(-1); setIsPaused(false); setUpgradeMode(false); setSelectedTowerIndex(null);
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
    
    // 升级模式逻辑 / Upgrade mode logic
    // 在升级模式下，点击防御塔选中它；点击空地取消选中 / In upgrade mode, click tower to select it; click empty to deselect
    if (upgradeModeRef.current) {
      // 波次限制：仅在 Level 2 且 wave >= UPGRADE_UNLOCK_WAVE(3) 时可用 / Wave gate: only available in Level 2 with wave >= 3
      if (level !== 2 || wave < UPGRADE_UNLOCK_WAVE) {
        setUpgradeMode(false);
        setSelectedTowerIndex(null);
        return;
      }
      // 检查点击的是否是已有防御塔 / Check if clicking on existing tower
      if (state.map[tileY]?.[tileX] === 4) {
        const towerIdx = state.towers.findIndex(
          t => Math.floor((t.x - TILE_SIZE/2) / TILE_SIZE) === tileX && 
               Math.floor((t.y - TILE_SIZE/2) / TILE_SIZE) === tileY
        );
        if (towerIdx !== -1) {
          setSelectedTowerIndex(towerIdx);  // 选中该防御塔 / Select this tower
          return;  // 升级模式下不再处理后续逻辑 / Don't process further in upgrade mode
        }
      }
      // 点击空地取消选中 / Clicking empty tile deselects
      setSelectedTowerIndex(null);
      return;
    }
    
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
        state.towers.push({ x: tileX * TILE_SIZE + TILE_SIZE/2, y: tileY * TILE_SIZE + TILE_SIZE/2, type: selectedTowerType, lastAttack: 0, angle: 0, level: 1, totalInvested: towerType.cost });
        state.map[tileY][tileX] = 4; spawnPlaceTowerParticles(state, tileX, tileY);
        if (tutorialStep === 3) setTutorialStep(4);
      }
    }
  }, [gameState, selectedTowerType, gold, tutorialStep, level, wave]);
  
  const handleCanvasHover = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    // Fix: account for CSS scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const tileX = Math.floor((e.clientX - rect.left) * scaleX / TILE_SIZE);
    const tileY = Math.floor((e.clientY - rect.top) * scaleY / TILE_SIZE);
    gameRef.current.hoverTile = { x: tileX, y: tileY };
    
    // 升级模式光标 / Upgrade mode cursor
    // 悬停在防御塔上显示 pointer，否则 default / Pointer on towers, default on empty tiles
    if (upgradeModeRef.current) {
      canvas.style.cursor = (gameRef.current.map[tileY]?.[tileX] === 4) ? 'pointer' : 'default';
    } else {
      canvas.style.cursor = 'crosshair';  // 普通建造模式 / Normal build mode
    }
  }, []);
  // 鼠标离开画布时重置光标 / Reset cursor when leaving canvas
  const handleCanvasLeave = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) canvas.style.cursor = upgradeModeRef.current ? 'default' : 'crosshair';
  }, []);
  
  const handleSelectTower = useCallback((type: number) => {
    setSelectedTowerType(p => p === type ? -1 : type);
    setUpgradeMode(false);  // 选择防御塔类型时退出升级模式 / Exit upgrade mode when selecting tower type
    setSelectedTowerIndex(null);  // 清除选中的防御塔 / Clear selected tower
    if (tutorialStep === 2 && selectedTowerType !== type) setTutorialStep(3);
  }, [tutorialStep, selectedTowerType]);
  // 升级模式切换 / Upgrade mode toggle
  const handleSelectUpgradeMode = useCallback(() => {
    setUpgradeMode(p => !p);            // 切换升级模式 / Toggle upgrade mode
    setSelectedTowerType(-1);          // 进入升级模式时取消防御塔选择 / Deselect tower type when entering upgrade mode
    setSelectedTowerIndex(null);       // 清除选中的防御塔 / Clear selected tower index
  }, []);
  
  /**
   * 出售防御塔处理器 / Sell tower handler
   * 退还总投入的 50% / Refunds 50% of total invested gold
   * @param towerIndex - 防御塔在数组中的索引 / Index of tower in towers array
   */
  const handleSell = useCallback((towerIndex: number) => {
    const state = gameRef.current;
    const tower = state.towers[towerIndex];
    if (!tower) return;
    
    // 计算出售价格 / Calculate sell value
    const sellValue = getSellValue(tower);
    
    // 获取塔所在的格子坐标 / Get tile coordinates of tower
    const tileX = Math.floor((tower.x - TILE_SIZE/2) / TILE_SIZE);
    const tileY = Math.floor((tower.y - TILE_SIZE/2) / TILE_SIZE);
    
    // 从数组中移除防御塔 / Remove tower from array
    state.towers.splice(towerIndex, 1);
    
    // 恢复格子为空地 / Reset tile to empty
    if (tileY >= 0 && tileY < state.map.length && tileX >= 0 && tileX < state.map[0].length) {
      state.map[tileY][tileX] = 0; // TILE.EMPTY
    }
    
    // 退还金币 / Refund gold
    setGold(g => g + sellValue);
    
    // 清除选中状态 / Clear selection
    setSelectedTowerIndex(null);
    setUpgradeMode(false);
    
    // 生成出售粒子效果（棕色烟雾）/ Spawn sell particles (brown smoke)
    for (let p = 0; p < 8; p++) {
      state.particles.push({
        x: tower.x, y: tower.y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 2,
        color: '#8D6E63',
        life: 20 + Math.random() * 10,
        alpha: 1,
        size: 3 + Math.random() * 3
      });
    }
  }, []);
  
  /**
   * 升级执行处理器 / Upgrade execution handler
   * 处理防御塔升级逻辑：解锁检查 → 解锁付费 → 升级付费 → 升级属性 → 粒子特效 → 光环动画
   * Handles tower upgrade: unlock check → unlock pay → upgrade pay → stat boost → particles → glow
   * @param towerIndex - 防御塔在数组中的索引 / Tower index in towers array
   */
  const handleUpgrade = useCallback((towerIndex: number) => {
    const state = gameRef.current;
    const tower = state.towers[towerIndex];
    if (!tower) return;
    
    // 检查该类型是否已解锁升级功能 / Check if this tower type is unlocked for upgrade
    if (!state.upgradeUnlocked[tower.type]) {
      // 计算解锁费用（基于当前场上猫咪总数）/ Calculate unlock cost based on current tower count
      const unlockCost = getUnlockCost(state.towers.length);
      if (goldRef.current >= unlockCost) {
        // 扣除解锁费用 / Deduct unlock fee
        setGold(g => g - unlockCost);
        // 标记该类型已解锁 / Mark this type as unlocked
        state.upgradeUnlocked[tower.type] = true;
        // 解锁完成，返回等待玩家再次点击升级 / Unlock paid, return - popup will show on next interaction
        return;
      }
      // 金币不足无法解锁 / Not enough gold, do nothing
      return;
    }
    
    // 计算升级费用 / Calculate upgrade cost
    const upgradeCost = getUpgradeCost(tower.type, tower.level);
    if (upgradeCost === null) return; // 已满级 / Already max level
    
    if (goldRef.current >= upgradeCost) {
      // 扣除升级费用 / Deduct upgrade fee
      setGold(g => g - upgradeCost);
      // 提升等级并累加投入 / Increment level and accumulate investment
      tower.level += 1;
      tower.totalInvested += upgradeCost;
      
      // 生成升级粒子特效（在防御塔所在格子）/ Spawn upgrade particles at tower position
      const tileX = Math.floor((tower.x - TILE_SIZE/2) / TILE_SIZE);
      const tileY = Math.floor((tower.y - TILE_SIZE/2) / TILE_SIZE);
      spawnUpgradeParticles(state, tileX, tileY);
      
      // 激活升级光环动画 / Activate upgrade glow effect
      upgradeGlowRef.current = { active: true, towerX: tower.x, towerY: tower.y, frame: UPGRADE_GLOW_DURATION };
      
      // 升级完成后取消选中 / Deselect tower after upgrade
      setSelectedTowerIndex(null);
    }
  }, []);
  
  // 同步 ref / Sync refs
  handleSellRef.current = handleSell;
  handleUpgradeRef.current = handleUpgrade;
  
  const toggleLang = useCallback(() => setLang(p => p === 'zh' ? 'en' : 'zh'), []);
  const togglePause = useCallback(() => gameState === 'playing' && setIsPaused(p => !p), [gameState]);
  
  // 游戏循环 - 内联简化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    levelRef.current = level;
    waveRef.current = wave;
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
        if (levelRef.current === 1) {
          setTutorialStep(0);
          setLevelAnnouncement({ text: tRef.current.level1Complete });
          
          setTimeout(() => {
            // Full reset for Level 2
            const { map, path, paths, pathIds } = buildInitialMap();
            const boxes = spawnBoxes(map);
            gameRef.current = initGameState(map, path, paths, pathIds, boxes);
            shakeRef.current = createShakeState();
            upgradeGlowRef.current = createUpgradeGlowState();  // 重置升级光环 / Reset upgrade glow
            setGold(INITIAL_GOLD); setLives(INITIAL_LIVES); setScore(0); setWave(1);
            setSelectedTowerType(-1); setIsPaused(false); setUpgradeMode(false); setSelectedTowerIndex(null); setGameState('playing');
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
        // Level 2+ wave completion: check path unlocks and start next wave
        // 检查路径解锁
        const nextWave = waveRef.current + 1;
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
    };
    
    const render = () => {
      const shake = applyShake(shakeRef.current);
      ctx.setTransform(1, 0, 0, 1, shake.offsetX, shake.offsetY);
      
      // 更新升级光环状态 / Update upgrade glow state
      updateUpgradeGlow(upgradeGlowRef.current);
      
      // 渲染游戏主画面 / Render main game
      renderGame(ctx, gameRef.current, gameRef.current.hoverTile, selectedTowerRef.current, goldRef.current, tutorialStepRef.current, selectedTowerIndexRef.current);
      
      // 绘制升级光环动画 / Draw upgrade glow animation
      if (upgradeGlowRef.current.active) {
        const g = upgradeGlowRef.current;
        const progress = g.frame / UPGRADE_GLOW_DURATION;          // 动画进度 1→0 / Animation progress 1→0
        const radius = 20 + (1 - progress) * 20;                    // 从 20px 扩展到 40px / Expands from 20px to 40px
        const alpha = progress;                                     // 从完全不透明衰减到透明 / Fades from opaque to transparent
        
        // 查找升级的防御塔以获取等级对应颜色 / Find upgraded tower for level-based color
        const upgradedTower = gameRef.current.towers.find(
          t => Math.abs(t.x - g.towerX) < 1 && Math.abs(t.y - g.towerY) < 1
        );
        const glowColor = LEVEL_COLORS[upgradedTower?.level ?? 1] ?? '#FFD700';
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(g.towerX, g.towerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    };
    
    let animationId = requestAnimationFrame(function loop(t) { update(t); render(); animationId = requestAnimationFrame(loop); });
    return () => cancelAnimationFrame(animationId);
  }, [gameState, wave, startWave, isPaused, level]);
  
  // 键盘
  useKeyboardHandler(gameState, togglePause);
  
  // 升级模式快捷键 'U' / Upgrade mode keyboard shortcut 'U'
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'u' && gameState === 'playing') {
        handleSelectUpgradeMode();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [gameState, handleSelectUpgradeMode]);
  
  const enemySpeedMultiplier = 1 + (wave - 1) * WAVE_SPEED_BONUS + gameRef.current.enemiesLeaked * LEAK_SPEED_BONUS + gameRef.current.towers.length * TOWER_SPEED_BONUS + (wave >= 5 ? MOSQUITO_SPEED_BONUS : 0) + (wave >= 10 ? RAT_SPEED_BONUS : 0);
  
  return (
    <div style={containerStyle}>
      <h1 style={{ ...titleStyle, fontSize: isPhone ? '24px' : isTablet ? '36px' : '48px' }}>{t.title}</h1>
      <HUD wave={wave} level={level} gold={gold} lives={lives} score={score} towerCount={gameRef.current.towers.length} enemySpeedMultiplier={enemySpeedMultiplier} lang={lang} onToggleLang={toggleLang} onTogglePause={togglePause} isPaused={isPaused} isPhone={isPhone} />
      <div style={canvasWrapperStyle}>
        <canvas ref={canvasRef} width={GRID_WIDTH * TILE_SIZE} height={GRID_HEIGHT * TILE_SIZE} onPointerDown={handleCanvasClick} onPointerMove={handleCanvasHover} onPointerLeave={handleCanvasLeave} style={canvasStyle} />
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
        {/* 升级弹出框 / Upgrade popup - 在升级模式下选中防御塔时显示 / Shows when tower selected in upgrade mode */}
        {selectedTowerIndex !== null && upgradeMode && (() => {
          const tower = gameRef.current.towers[selectedTowerIndex];
          if (!tower) return null;
          
          // 计算画布缩放比例（CSS 像素 → 画布像素）/ Calculate canvas scale (CSS px → canvas px)
          // 用于将画布坐标转换为 CSS 坐标以正确定位弹出框 / Convert canvas coords to CSS coords for popup positioning
          const canvasEl = canvasRef.current;
          const scaleX = canvasEl ? canvasEl.width / canvasEl.clientWidth : 1;
          const scaleY = canvasEl ? canvasEl.height / canvasEl.clientHeight : 1;
          
          const towerType = TOWER_TYPES[tower.type];
          const isUnlocked = gameRef.current.upgradeUnlocked[tower.type];    // 该类型是否已解锁升级 / Whether this type is unlocked
          const upgradeCost = getUpgradeCost(tower.type, tower.level);        // 升级费用 / Upgrade cost (null if max level)
          const unlockCost = getUnlockCost(gameRef.current.towers.length);    // 解锁费用 / Unlock cost
          const sellValue = getSellValue(tower);                              // 出售价格 / Sell value
          const stats = getTowerStats(tower.type, tower.level);               // 当前属性 / Current stats
          const nextStats = tower.level < 5 ? getTowerStats(tower.type, tower.level + 1) : null;  // 下一级属性 / Next level stats
          
          // 弹出框位置（相对于 canvasWrapper）/ Popup position relative to canvas wrapper
          // 在防御塔上方居中，钳制在画布范围内 / Centered above tower, clamped to canvas bounds
          const popupX = Math.min(Math.max(tower.x / scaleX - 80, 0), (GRID_WIDTH * TILE_SIZE) / scaleX - 180);
          const popupY = Math.min(Math.max(tower.y / scaleY - 130, 0), (GRID_HEIGHT * TILE_SIZE) / scaleY - 160);
          
          return (
            <div style={{ ...upgradePopupContainerStyle, left: popupX, top: popupY }}>
              {/* 关闭按钮 X / Close button */}
              <button style={upgradePopupCloseStyle} onClick={() => setSelectedTowerIndex(null)}>✕</button>
              
              {/* 防御塔名称和等级 / Tower name and level */}
              <div style={{ fontWeight: 700, fontSize: '14px' }}>
                {t.towerNames?.[tower.type] || towerType.name} Lv.{tower.level}
              </div>
              
              {!isUnlocked ? (
                /* 锁定状态：显示解锁费用和按钮 / Locked: show unlock cost and button */
                <>
                  <div style={{ marginTop: '4px', fontSize: '12px' }}>
                    🔒 {t.unlock}: {unlockCost}🪙
                  </div>
                  <button
                    style={{ ...upgradePopupButtonStyle, opacity: gold < unlockCost ? 0.5 : 1 }}
                    onClick={() => handleUpgradeRef.current(selectedTowerIndex)}
                    disabled={gold < unlockCost}
                  >
                    {t.unlock} ({unlockCost}🪙)
                  </button>
                </>
              ) : upgradeCost !== null ? (
                /* 已解锁且可升级：显示属性对比和升级按钮 / Unlocked & upgradable: show stats and upgrade button */
                <>
                  <div style={{ marginTop: '4px', fontSize: '12px' }}>
                    {t.damage}: {stats.damage} → {nextStats!.damage}
                  </div>
                  <div style={{ fontSize: '12px' }}>
                    {t.range}: {stats.range} → {nextStats!.range}
                  </div>
                  <button
                    style={{ ...upgradePopupButtonStyle, opacity: gold < upgradeCost ? 0.5 : 1 }}
                    onClick={() => handleUpgradeRef.current(selectedTowerIndex)}
                    disabled={gold < upgradeCost}
                  >
                    {t.upgrade} ({upgradeCost}🪙)
                  </button>
                </>
              ) : (
                /* 已满级：显示 MAX 标签 / Max level: show MAX label */
                <div style={{ marginTop: '6px', fontWeight: 700, color: '#FFD700' }}>⭐ {t.maxLevel}</div>
              )}
              
              {/* 出售按钮（始终显示）/ Sell button (always visible) */}
              <button
                style={{ ...upgradePopupButtonStyle, background: 'linear-gradient(180deg, #8D6E63 0%, #5D4037 100%)' }}
                onClick={() => handleSellRef.current(selectedTowerIndex)}
              >
                💰 {t.sell} ({sellValue}🪙)
              </button>
            </div>
          );
        })()}
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
        {/* 升级模式按钮 / Upgrade mode button - 第3波后解锁 / unlocked after wave 3 */}
        {level === 2 && wave >= UPGRADE_UNLOCK_WAVE && (
          <button
            onClick={handleSelectUpgradeMode}
            disabled={gameState !== 'playing' || isPaused}
            style={(isPhone ? upgradeModeButtonPhoneStyle : upgradeModeButtonStyle)(upgradeMode, gameState !== 'playing' || isPaused)}
          >
            <span style={{ fontSize: isPhone ? '22px' : '28px' }}>{upgradeMode ? '✅' : '⬆️'}</span>
            {!isPhone && (
              <span style={{ fontFamily: 'Fredoka One, cursive', fontSize: '13px', color: upgradeMode ? '#FFF' : '#5D4037' }}>
                {upgradeMode ? 'ON' : 'Upgrade'}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
