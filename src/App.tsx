/**
 * Hajimi Defense (萌新防御) - Main Game Component
 * 🐱 金金枪鱼罐头防御 - Cute cat tower defense game
 * 
 * Orchestration layer. State, callbacks, effects, and rendering
 * delegate to specialized hooks and components.
 * 编排层。状态、回调、效果和渲染委托给专门的 Hook 和组件处理。
 * 
 * Hooks:  useGameState → useGameCallbacks → useGameEffects → useGameLoop
 * Components: HUD, TowerPanel, GameOverlays, TowerUpgradePopup, etc.
 */

import { useGameState } from './game/hooks/useGameState';
import { useGameCallbacks } from './game/hooks/useGameCallbacks';
import { useGameEffects } from './game/hooks/useGameEffects';
import { useGameLoop } from './game/hooks/useGameLoop';

import HUD from './game/components/HUD';
import GameOverlays from './game/components/GameOverlays';
import { TutorialGuide, TowerUpgradePopup, PathUnlockNotification, LevelAnnouncement, TowerPanel } from './game/components';

import { GRID_WIDTH, GRID_HEIGHT, TILE_SIZE, UPGRADE_UNLOCK_WAVE, WAVE_SPEED_BONUS, LEAK_SPEED_BONUS, TOWER_SPEED_BONUS, MOSQUITO_SPEED_BONUS, RAT_SPEED_BONUS } from './game/constants';
import { containerStyle, titleStyle, canvasWrapperStyle, canvasStyle } from './game/styles';

export default function App() {
  // ================================================================
  // 1. Game State — all useState + useRef centralized / 游戏状态集中管理
  // ================================================================
  const s = useGameState();

  // ================================================================
  // 2. Callbacks — all event handlers / 所有事件处理回调
  // ================================================================
  const cb = useGameCallbacks({
    gameState: s.gameState, selectedTowerType: s.selectedTowerType,
    gold: s.gold, tutorialStep: s.tutorialStep, level: s.level, wave: s.wave, t: s.t,
    setGold: s.setGold, setLives: s.setLives, setScore: s.setScore, setWave: s.setWave,
    setSelectedTowerType: s.setSelectedTowerType, setIsPaused: s.setIsPaused,
    setUpgradeMode: s.setUpgradeMode, setSelectedTowerIndex: s.setSelectedTowerIndex,
    setGameState: s.setGameState, setLang: s.setLang, setLevel: s.setLevel,
    setTutorialStep: s.setTutorialStep, setLevelAnnouncement: s.setLevelAnnouncement,
    setPathUnlockNotification: s.setPathUnlockNotification,
    gameRef: s.gameRef, shakeRef: s.shakeRef, upgradeGlowRef: s.upgradeGlowRef,
    upgradeModeRef: s.upgradeModeRef, goldRef: s.goldRef,
  });
  // Sync handler refs for imperative access in popup / 同步处理函数引用
  s.handleSellRef.current = cb.handleSell;
  s.handleUpgradeRef.current = cb.handleUpgrade;

  // ================================================================
  // 3. Side Effects — all useEffect blocks / 所有副作用 Hook
  // ================================================================
  useGameEffects({
    gameState: s.gameState, wave: s.wave, level: s.level,
    tutorialStep: s.tutorialStep, levelAnnouncement: s.levelAnnouncement,
    upgradeMode: s.upgradeMode, isPaused: s.isPaused,
    setPathUnlockNotification: s.setPathUnlockNotification,
    setLevelAnnouncement: s.setLevelAnnouncement,
    setTutorialStep: s.setTutorialStep, setIsPaused: s.setIsPaused,
    gameRef: s.gameRef, wasPausedBeforeUpgradeRef: s.wasPausedBeforeUpgradeRef,
    handleSelectUpgradeMode: cb.handleSelectUpgradeMode, togglePause: cb.togglePause,
  });

  // ================================================================
  // 4. Game Loop — animation-frame game engine / 游戏循环引擎
  // ================================================================
  useGameLoop({
    gameRef: s.gameRef, shakeRef: s.shakeRef, upgradeGlowRef: s.upgradeGlowRef,
    selectedTowerRef: s.selectedTowerRef, selectedTowerIndexRef: s.selectedTowerIndexRef,
    goldRef: s.goldRef, levelRef: s.levelRef, waveRef: s.waveRef,
    langRef: s.langRef, tRef: s.tRef, tutorialStepRef: s.tutorialStepRef,
    gameState: s.gameState, isPaused: s.isPaused, level: s.level, wave: s.wave,
    lang: s.lang, t: s.t, tutorialStep: s.tutorialStep,
    setGold: s.setGold, setLives: s.setLives, setScore: s.setScore, setWave: s.setWave,
    setSelectedTowerType: s.setSelectedTowerType, setIsPaused: s.setIsPaused,
    setUpgradeMode: s.setUpgradeMode, setSelectedTowerIndex: s.setSelectedTowerIndex,
    setGameState: s.setGameState, setLevel: s.setLevel,
    setTutorialStep: s.setTutorialStep,
    setPathUnlockNotification: s.setPathUnlockNotification,
    setLevelAnnouncement: s.setLevelAnnouncement,
    startWave: cb.startWave, canvasRef: s.canvasRef,
  });

  // ================================================================
  // 5. Computed Values / 计算值
  // ================================================================
  const enemySpeedMultiplier =
    1 + (s.wave - 1) * WAVE_SPEED_BONUS
      + s.gameRef.current.enemiesLeaked * LEAK_SPEED_BONUS
      + s.gameRef.current.towers.length * TOWER_SPEED_BONUS
      + (s.wave >= 5 ? MOSQUITO_SPEED_BONUS : 0)
      + (s.wave >= 10 ? RAT_SPEED_BONUS : 0);

  const showUpgradeBtn = s.level === 2 && s.wave >= UPGRADE_UNLOCK_WAVE;
  const panelDisabled = s.gameState !== 'playing' || (s.isPaused && !s.upgradeMode);

  // ================================================================
  // 6. Render / 渲染
  // ================================================================
  return (
    <div style={containerStyle}>
      <h1 style={{ ...titleStyle, fontSize: s.isPhone ? '24px' : s.isTablet ? '36px' : '48px' }}>
        {s.t.title}
      </h1>

      <HUD
        wave={s.wave} level={s.level} gold={s.gold} lives={s.lives} score={s.score}
        towerCount={s.gameRef.current.towers.length}
        enemySpeedMultiplier={enemySpeedMultiplier}
        lang={s.lang} onToggleLang={cb.toggleLang} onTogglePause={cb.togglePause}
        isPaused={s.isPaused} isPhone={s.isPhone}
      />

      <div style={canvasWrapperStyle}>
        <canvas
          ref={s.canvasRef} width={GRID_WIDTH * TILE_SIZE} height={GRID_HEIGHT * TILE_SIZE}
          onPointerDown={cb.handleCanvasClick}
          onPointerMove={cb.handleCanvasHover}
          onPointerLeave={() => cb.handleCanvasLeave(s.canvasRef.current)}
          style={canvasStyle}
        />
        <TutorialGuide step={s.tutorialStep} lang={s.lang} level={s.level} />
        {s.levelAnnouncement && (
          <LevelAnnouncement text={s.levelAnnouncement.text} subtitle={s.levelAnnouncement.subtitle} />
        )}
        {s.selectedTowerIndex !== null && s.upgradeMode && (
          <TowerUpgradePopup
            towerIndex={s.selectedTowerIndex} gameRef={s.gameRef} gold={s.gold}
            lang={s.lang} canvasRef={s.canvasRef}
            onClose={() => s.setSelectedTowerIndex(null)}
            handleUpgradeRef={s.handleUpgradeRef} handleSellRef={s.handleSellRef}
          />
        )}
        {s.pathUnlockNotification && (
          <PathUnlockNotification name={s.pathUnlockNotification.name} color={s.pathUnlockNotification.color} />
        )}
        {(s.gameState === 'start' || s.gameState === 'gameover' || s.gameState === 'victory') && (
          <GameOverlays state={s.gameState} lang={s.lang} score={s.score}
            onStart={cb.startGame} onResume={cb.togglePause} isPhone={s.isPhone} />
        )}
        {s.gameState === 'playing' && s.isPaused && !s.upgradeMode && (
          <GameOverlays state="paused" lang={s.lang} score={0}
            onStart={cb.startGame} onResume={cb.togglePause} isPhone={s.isPhone} />
        )}
      </div>

      <TowerPanel
        selectedTowerType={s.selectedTowerType} gold={s.gold}
        onSelectTower={cb.handleSelectTower} lang={s.lang}
        upgradeMode={s.upgradeMode} onToggleUpgradeMode={cb.handleSelectUpgradeMode}
        showUpgradeButton={showUpgradeBtn} isPhone={s.isPhone} disabled={panelDisabled}
      />
    </div>
  );
}
