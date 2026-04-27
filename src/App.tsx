/**
 * Hajimi Defense (萌新防御) - Main Game Component
 * 🐱 金金枪鱼罐头防御 - Cute cat tower defense game
 * 
 * Orchestrates the game: state management, event handlers,
 * and rendering. Heavy logic extracted to hooks and components:
 *   - useGameLoop        → Animation-frame game loop
 *   - TowerUpgradePopup  → Upgrade popup UI
 *   - PathUnlockNotification → Path unlock announcement
 *   - LevelAnnouncement  → Level transition overlay
 */

import { useState, useCallback, useRef, useEffect } from 'react';

// ---- Configuration / 配置 ----
import {
  TILE_SIZE, GRID_WIDTH, GRID_HEIGHT,
  TOWER_TYPES, INITIAL_GOLD, INITIAL_LIVES,
  WAVE_SPEED_BONUS, LEAK_SPEED_BONUS, TOWER_SPEED_BONUS,
  MOSQUITO_SPEED_BONUS, RAT_SPEED_BONUS,
  BOX_GOLD_REWARD, BOX_SCORE_REWARD,
  LEVEL_ANNOUNCEMENT_DURATION, LEVEL1_WAVE,
  UPGRADE_UNLOCK_WAVE, getUpgradeCost, getUnlockCost,
  UPGRADE_GLOW_DURATION, getSellValue,
} from './game/constants';

// ---- Game Systems / 游戏系统 ----
import { buildInitialMap, spawnBoxes, initGameState } from './game/mapSystem';
import { startWave as createWave } from './game/waveSystem';
import {
  spawnBreakBoxParticles, spawnPlaceTowerParticles,
  spawnUpgradeParticles, createShakeState,
  createUpgradeGlowState,
} from './game/gameEngine';
import type { ShakeState, UpgradeGlowState } from './game/gameEngine';
import { useKeyboardHandler } from './game/keyboard';

// ---- Types & i18n / 类型与国际化 ----
import type { GameState, Language, GameStateRef, Level, TutorialStep } from './game/types';
import { TEXT } from './game/i18n';

// ---- Hooks / 自定义 Hook ----
import { useGameLoop } from './game/hooks/useGameLoop';

// ---- UI Components / 界面组件 ----
import HUD from './game/components/HUD';
import GameOverlays from './game/components/GameOverlays';
import { TutorialGuide, TowerUpgradePopup, PathUnlockNotification, LevelAnnouncement } from './game/components';

// ---- Styles / 样式 ----
import {
  containerStyle, titleStyle,
  canvasWrapperStyle, canvasStyle,
  towerPanelStyle, towerButtonStyle,
  towerPanelPhoneStyle, towerButtonPhoneStyle,
  upgradeModeButtonStyle, upgradeModeButtonPhoneStyle,
} from './game/styles';

// ---- Responsive / 响应式 ----
import { useResponsiveScale } from './game/responsive';

// Path unlock configuration / 路径解锁配置
const PATH_UNLOCK_WAVES: Record<number, { id: number; name: string; color: string }> = {
  4: { id: 1, name: 'Normal', color: '#80D8FF' },   // Wave 4 unlocks Normal
  6: { id: 0, name: 'Hard', color: '#FF8A80' },     // Wave 6 unlocks Hard
};

export default function App() {
  // ===== Canvas Ref / 画布引用 =====
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ===== Game State / 游戏状态 =====
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
  const [upgradeMode, setUpgradeMode] = useState(false);
  const [selectedTowerIndex, setSelectedTowerIndex] = useState<number | null>(null);

  const t = TEXT(lang);

  // ===== Mutable Refs / 可变引用 =====
  const gameRef = useRef<GameStateRef>(initGameState([], [], [], [], []));
  const shakeRef = useRef<ShakeState>(createShakeState());
  const upgradeGlowRef = useRef<UpgradeGlowState>(createUpgradeGlowState());
  const selectedTowerRef = useRef(selectedTowerType);
  const upgradeModeRef = useRef(upgradeMode);
  const selectedTowerIndexRef = useRef(selectedTowerIndex);
  const goldRef = useRef(gold);
  const levelRef = useRef(level);
  const waveRef = useRef(wave);
  const tutorialStepRef = useRef(tutorialStep);
  const langRef = useRef(lang);
  const tRef = useRef(t);
  const handleSellRef = useRef<(index: number) => void>(() => {});
  const handleUpgradeRef = useRef<(index: number) => void>(() => {});
  const wasPausedBeforeUpgradeRef = useRef(false);

  // Sync refs with state / 同步 ref 与状态
  selectedTowerRef.current = selectedTowerType;
  upgradeModeRef.current = upgradeMode;
  selectedTowerIndexRef.current = selectedTowerIndex;
  goldRef.current = gold;
  tutorialStepRef.current = tutorialStep;

  // ===== Responsive / 响应式适配 =====
  const { isPhone, isTablet } = useResponsiveScale();

  // ===== Side Effects / 副作用 =====

  // Path unlock notification monitor / 路径解锁通知监听
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

  // Auto-dismiss level announcement / 关卡公告自动消失
  useEffect(() => {
    if (levelAnnouncement) {
      const timer = setTimeout(() => setLevelAnnouncement(null), LEVEL_ANNOUNCEMENT_DURATION);
      return () => clearTimeout(timer);
    }
  }, [levelAnnouncement]);

  // Tutorial step 4: start Level 1 wave after "Ready!" delay
  // 教程步骤 4：延迟后开始 Level 1 波次
  useEffect(() => {
    if (tutorialStep === 4 && level === 1) {
      const timer = setTimeout(() => {
        const level1EnemyTypes: number[] = [];
        for (const group of LEVEL1_WAVE) {
          for (let i = 0; i < group.count; i++) {
            level1EnemyTypes.push(group.type);
          }
        }
        // Shuffle enemy spawn order / 打乱敌人出现顺序
        for (let i = level1EnemyTypes.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [level1EnemyTypes[i], level1EnemyTypes[j]] = [level1EnemyTypes[j], level1EnemyTypes[i]];
        }
        gameRef.current.enemiesToSpawn = level1EnemyTypes;
        gameRef.current.enemySpawnTimer = 0;
        gameRef.current.waveInProgress = true;
        setTutorialStep(0); // Hide tutorial text once enemies start
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [tutorialStep, level]);

  // Upgrade mode auto-pause / 升级模式自动暂停
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (upgradeMode) {
      wasPausedBeforeUpgradeRef.current = isPaused;
      setIsPaused(true);
    } else {
      if (!wasPausedBeforeUpgradeRef.current) {
        setIsPaused(false);
      }
    }
  }, [upgradeMode, gameState]);  // eslint-disable-line react-hooks/exhaustive-deps

  // Upgrade mode keyboard shortcut 'U' / 升级模式快捷键 'U'
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'u' && gameState === 'playing') {
        handleSelectUpgradeMode();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [gameState]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ===== Callbacks - Game Lifecycle / 回调 - 游戏生命周期 =====

  /** Start a wave / 开始一波攻击 */
  const startWave = useCallback((waveNum: number) => {
    gameRef.current.enemiesToSpawn = createWave(waveNum);
    gameRef.current.enemySpawnTimer = 0;
    gameRef.current.waveInProgress = true;
    gameRef.current.pathUnlockNotifications = [];
  }, []);

  /** Start / restart game / 开始 / 重新开始游戏 */
  const startGame = useCallback(() => {
    const { map, path, paths, pathIds } = buildInitialMap();
    const boxes = spawnBoxes(map);
    gameRef.current = initGameState(map, path, paths, pathIds, boxes);
    shakeRef.current = createShakeState();
    upgradeGlowRef.current = createUpgradeGlowState();
    setGold(INITIAL_GOLD); setLives(INITIAL_LIVES); setScore(0); setWave(1);
    setSelectedTowerType(-1); setIsPaused(false); setUpgradeMode(false); setSelectedTowerIndex(null);
    setPathUnlockNotification(null);
    setLevel(1); setTutorialStep(1);
    setLevelAnnouncement({ text: t.level1Announcement });
    setGameState('playing');
  }, [t]);

  // ===== Callbacks - Canvas Interaction / 回调 - 画布交互 =====

  /** Canvas click: tower placement, box breaking, upgrade mode selection / 画布点击 */
  const handleCanvasClick = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const tileX = Math.floor((e.clientX - rect.left) * scaleX / TILE_SIZE);
    const tileY = Math.floor((e.clientY - rect.top) * scaleY / TILE_SIZE);
    const state = gameRef.current;

    // Upgrade mode logic / 升级模式逻辑
    if (upgradeModeRef.current) {
      if (level !== 2 || wave < UPGRADE_UNLOCK_WAVE) {
        setUpgradeMode(false);
        setSelectedTowerIndex(null);
        return;
      }
      if (state.map[tileY]?.[tileX] === 4) {
        const towerIdx = state.towers.findIndex(
          t => Math.floor((t.x - TILE_SIZE / 2) / TILE_SIZE) === tileX &&
               Math.floor((t.y - TILE_SIZE / 2) / TILE_SIZE) === tileY,
        );
        if (towerIdx !== -1) {
          setSelectedTowerIndex(towerIdx);
          return;
        }
      }
      setSelectedTowerIndex(null);
      return;
    }

    // Box breaking / 打破纸箱
    const boxIdx = state.boxes.findIndex(b => b.x === tileX && b.y === tileY);
    if (boxIdx !== -1) {
      state.boxes.splice(boxIdx, 1); state.map[tileY][tileX] = 0;
      setGold(g => g + BOX_GOLD_REWARD); if (level === 2) setScore(s => s + BOX_SCORE_REWARD);
      spawnBreakBoxParticles(state, tileX, tileY);
      if (tutorialStep === 1) setTutorialStep(2);
      return;
    }

    // Tower placement / 放置防御塔
    if (selectedTowerType >= 0 && tileX >= 0 && tileX < GRID_WIDTH && tileY >= 0 && tileY < GRID_HEIGHT && state.map[tileY][tileX] === 0) {
      const towerType = TOWER_TYPES[selectedTowerType];
      if (gold >= towerType.cost) {
        setGold(g => g - towerType.cost);
        state.towers.push({
          x: tileX * TILE_SIZE + TILE_SIZE / 2, y: tileY * TILE_SIZE + TILE_SIZE / 2,
          type: selectedTowerType, lastAttack: 0, angle: 0, level: 1,
          totalInvested: towerType.cost,
        });
        state.map[tileY][tileX] = 4;
        spawnPlaceTowerParticles(state, tileX, tileY);
        if (tutorialStep === 3) setTutorialStep(4);
      }
    }
  }, [gameState, selectedTowerType, gold, tutorialStep, level, wave]);

  /** Canvas hover: update hover tile position + cursor style / 画布悬停 */
  const handleCanvasHover = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const tileX = Math.floor((e.clientX - rect.left) * scaleX / TILE_SIZE);
    const tileY = Math.floor((e.clientY - rect.top) * scaleY / TILE_SIZE);
    gameRef.current.hoverTile = { x: tileX, y: tileY };

    if (upgradeModeRef.current) {
      canvas.style.cursor = (gameRef.current.map[tileY]?.[tileX] === 4) ? 'pointer' : 'default';
    } else {
      canvas.style.cursor = 'crosshair';
    }
  }, []);

  /** Canvas leave: reset cursor / 画布离开：重置光标 */
  const handleCanvasLeave = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) canvas.style.cursor = upgradeModeRef.current ? 'default' : 'crosshair';
  }, []);

  // ===== Callbacks - Tower Actions / 回调 - 防御塔操作 =====

  /** Select tower type / 选择防御塔类型 */
  const handleSelectTower = useCallback((type: number) => {
    setSelectedTowerType(p => p === type ? -1 : type);
    setUpgradeMode(false);
    setSelectedTowerIndex(null);
    if (tutorialStep === 2 && selectedTowerType !== type) setTutorialStep(3);
  }, [tutorialStep, selectedTowerType]);

  /** Toggle upgrade mode / 切换升级模式 */
  const handleSelectUpgradeMode = useCallback(() => {
    setUpgradeMode(p => !p);
    setSelectedTowerType(-1);
    setSelectedTowerIndex(null);
  }, []);

  /** Sell tower: remove tower, refund 50% gold, spawn particles / 出售防御塔 */
  const handleSell = useCallback((towerIndex: number) => {
    const state = gameRef.current;
    const tower = state.towers[towerIndex];
    if (!tower) return;

    const sellValue = getSellValue(tower);
    const tileX = Math.floor((tower.x - TILE_SIZE / 2) / TILE_SIZE);
    const tileY = Math.floor((tower.y - TILE_SIZE / 2) / TILE_SIZE);

    state.towers.splice(towerIndex, 1);
    if (tileY >= 0 && tileY < state.map.length && tileX >= 0 && tileX < state.map[0].length) {
      state.map[tileY][tileX] = 0;
    }

    setGold(g => g + sellValue);
    setSelectedTowerIndex(null);
    setUpgradeMode(false);

    // Sell particles (brown smoke) / 出售粒子效果
    for (let p = 0; p < 8; p++) {
      state.particles.push({
        x: tower.x, y: tower.y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 2,
        color: '#8D6E63', life: 20 + Math.random() * 10,
        alpha: 1, size: 3 + Math.random() * 3,
      });
    }
  }, []);

  /** Upgrade tower: unlock → upgrade → particles → glow / 升级防御塔 */
  const handleUpgrade = useCallback((towerIndex: number) => {
    const state = gameRef.current;
    const tower = state.towers[towerIndex];
    if (!tower) return;

    // Check unlock / 检查解锁
    if (!state.upgradeUnlocked[tower.type]) {
      const unlockCost = getUnlockCost(state.towers.length);
      if (goldRef.current >= unlockCost) {
        setGold(g => g - unlockCost);
        state.upgradeUnlocked[tower.type] = true;
        return;
      }
      return;
    }

    // Check upgrade / 检查升级
    const upgradeCost = getUpgradeCost(tower.type, tower.level);
    if (upgradeCost === null) return;

    if (goldRef.current >= upgradeCost) {
      setGold(g => g - upgradeCost);
      tower.level += 1;
      tower.totalInvested += upgradeCost;

      const tileX = Math.floor((tower.x - TILE_SIZE / 2) / TILE_SIZE);
      const tileY = Math.floor((tower.y - TILE_SIZE / 2) / TILE_SIZE);
      spawnUpgradeParticles(state, tileX, tileY);

      upgradeGlowRef.current = {
        active: true, towerX: tower.x, towerY: tower.y,
        frame: UPGRADE_GLOW_DURATION,
      };

      setSelectedTowerIndex(null);
    }
  }, []);

  // Sync handler refs / 同步处理函数引用
  handleSellRef.current = handleSell;
  handleUpgradeRef.current = handleUpgrade;

  // ===== Callbacks - UI / 回调 - 界面控制 =====

  const toggleLang = useCallback(() => setLang(p => p === 'zh' ? 'en' : 'zh'), []);
  const togglePause = useCallback(() => {
    if (gameState !== 'playing' || upgradeModeRef.current) return;
    setIsPaused(p => !p);
  }, [gameState]);

  // ===== Keyboard Handler / 键盘处理 =====
  useKeyboardHandler(gameState, togglePause);

  // ===== Game Loop Hook / 游戏循环 Hook =====
  useGameLoop({
    gameRef, shakeRef, upgradeGlowRef,
    selectedTowerRef, selectedTowerIndexRef,
    goldRef, levelRef, waveRef, langRef, tRef, tutorialStepRef,
    gameState, isPaused, level, wave, lang, t, tutorialStep,
    setGold, setLives, setScore, setWave,
    setSelectedTowerType, setIsPaused, setUpgradeMode, setSelectedTowerIndex,
    setGameState, setLevel, setTutorialStep,
    setPathUnlockNotification, setLevelAnnouncement,
    startWave, canvasRef,
  });

  // ===== Computed Values / 计算值 =====
  const enemySpeedMultiplier =
    1 +
    (wave - 1) * WAVE_SPEED_BONUS +
    gameRef.current.enemiesLeaked * LEAK_SPEED_BONUS +
    gameRef.current.towers.length * TOWER_SPEED_BONUS +
    (wave >= 5 ? MOSQUITO_SPEED_BONUS : 0) +
    (wave >= 10 ? RAT_SPEED_BONUS : 0);

  // ===== Render / 渲染 =====
  return (
    <div style={containerStyle}>
      {/* Game Title / 游戏标题 */}
      <h1 style={{ ...titleStyle, fontSize: isPhone ? '24px' : isTablet ? '36px' : '48px' }}>
        {t.title}
      </h1>

      {/* HUD / 游戏状态栏 */}
      <HUD
        wave={wave} level={level}
        gold={gold} lives={lives} score={score}
        towerCount={gameRef.current.towers.length}
        enemySpeedMultiplier={enemySpeedMultiplier}
        lang={lang} onToggleLang={toggleLang}
        onTogglePause={togglePause} isPaused={isPaused}
        isPhone={isPhone}
      />

      {/* Canvas Area / 画布区域 */}
      <div style={canvasWrapperStyle}>
        <canvas
          ref={canvasRef}
          width={GRID_WIDTH * TILE_SIZE}
          height={GRID_HEIGHT * TILE_SIZE}
          onPointerDown={handleCanvasClick}
          onPointerMove={handleCanvasHover}
          onPointerLeave={handleCanvasLeave}
          style={canvasStyle}
        />

        {/* Tutorial Guide / 教程向导 */}
        <TutorialGuide step={tutorialStep} lang={lang} level={level} />

        {/* Level Announcement / 关卡公告 */}
        {levelAnnouncement && (
          <LevelAnnouncement
            text={levelAnnouncement.text}
            subtitle={levelAnnouncement.subtitle}
          />
        )}

        {/* Tower Upgrade Popup / 防御塔升级弹出框 */}
        {selectedTowerIndex !== null && upgradeMode && (
          <TowerUpgradePopup
            towerIndex={selectedTowerIndex}
            gameRef={gameRef}
            gold={gold}
            lang={lang}
            canvasRef={canvasRef}
            onClose={() => setSelectedTowerIndex(null)}
            handleUpgradeRef={handleUpgradeRef}
            handleSellRef={handleSellRef}
          />
        )}

        {/* Path Unlock Notification / 路径解锁通知 */}
        {pathUnlockNotification && (
          <PathUnlockNotification
            name={pathUnlockNotification.name}
            color={pathUnlockNotification.color}
          />
        )}

        {/* Game Overlays / 游戏覆盖层 */}
        {(gameState === 'start' || gameState === 'gameover' || gameState === 'victory') && (
          <GameOverlays
            state={gameState} lang={lang} score={score}
            onStart={startGame} onResume={togglePause}
            isPhone={isPhone}
          />
        )}
        {gameState === 'playing' && isPaused && !upgradeMode && (
          <GameOverlays
            state="paused" lang={lang} score={0}
            onStart={startGame} onResume={togglePause}
            isPhone={isPhone}
          />
        )}
      </div>

      {/* Tower Panel / 防御塔选择面板 */}
      <div style={isPhone ? towerPanelPhoneStyle : towerPanelStyle}>
        {TOWER_TYPES.map((tower, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectTower(idx)}
            disabled={gold < tower.cost}
            style={(isPhone ? towerButtonPhoneStyle : towerButtonStyle)({
              selected: selectedTowerType === idx,
              disabled: gold < tower.cost,
            })}
          >
            <span style={{ fontSize: isPhone ? '28px' : '36px', marginBottom: isPhone ? '2px' : '5px' }}>🐱</span>
            {!isPhone && (
              <span style={{
                fontFamily: 'Fredoka One, cursive', fontSize: '14px',
                color: selectedTowerType === idx ? 'white' : '#5D4037',
              }}>
                {t.towerNames?.[idx] || tower.name}
              </span>
            )}
            <span style={{
              fontSize: isPhone ? '14px' : '16px',
              color: selectedTowerType === idx ? 'white' : '#FFA000',
              fontWeight: 800,
            }}>
              {tower.cost}
            </span>
          </button>
        ))}

        {/* Upgrade Mode Button / 升级模式按钮 */}
        {level === 2 && wave >= UPGRADE_UNLOCK_WAVE && (
          <button
            onClick={handleSelectUpgradeMode}
            disabled={gameState !== 'playing' || (isPaused && !upgradeMode)}
            style={(isPhone ? upgradeModeButtonPhoneStyle : upgradeModeButtonStyle)(
              upgradeMode,
              gameState !== 'playing' || (isPaused && !upgradeMode),
            )}
          >
            <span style={{ fontSize: isPhone ? '22px' : '28px' }}>
              {upgradeMode ? '✅' : '⬆️'}
            </span>
            {!isPhone && (
              <span style={{
                fontFamily: 'Fredoka One, cursive', fontSize: '13px',
                color: upgradeMode ? '#FFF' : '#5D4037',
              }}>
                {t.upgradeMode}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
