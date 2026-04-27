/**
 * useGameCallbacks - Game Event Handlers / 游戏事件处理回调
 * 
 * All callback functions extracted from App.tsx.
 * 从 App.tsx 提取的所有回调函数。
 * 
 * Handles: game lifecycle, canvas interaction, tower actions, UI toggles.
 * 处理：游戏生命周期、画布交互、防御塔操作、界面切换。
 */

import { useCallback, MutableRefObject } from 'react';
import type { GameState, Language, Level, TutorialStep, GameStateRef } from '../types';
import type { ShakeState, UpgradeGlowState } from '../gameEngine';
import {
  TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, TOWER_TYPES,
  INITIAL_GOLD, INITIAL_LIVES,
  BOX_GOLD_REWARD, BOX_SCORE_REWARD,
  UPGRADE_UNLOCK_WAVE, getUpgradeCost, getUnlockCost,
  UPGRADE_GLOW_DURATION, getSellValue,
} from '../constants';
import { buildInitialMap, spawnBoxes, initGameState } from '../mapSystem';
import { startWave as createWave } from '../waveSystem';
import {
  spawnBreakBoxParticles, spawnPlaceTowerParticles,
  spawnUpgradeParticles, createShakeState, createUpgradeGlowState,
} from '../gameEngine';

// ---- Types for setters / 状态设置器类型 ----
type Setter<T> = (val: T | ((prev: T) => T)) => void;

interface CallbackDeps {
  // State values / 状态值
  gameState: GameState;
  selectedTowerType: number;
  gold: number;
  tutorialStep: TutorialStep;
  level: Level;
  wave: number;
  t: ReturnType<typeof import('../i18n').TEXT>;

  // Setters / 设置器
  setGold: Setter<number>;
  setLives: Setter<number>;
  setScore: Setter<number>;
  setWave: Setter<number>;
  setSelectedTowerType: Setter<number>;
  setIsPaused: Setter<boolean>;
  setUpgradeMode: Setter<boolean>;
  setSelectedTowerIndex: Setter<number | null>;
  setGameState: Setter<GameState>;
  setLang: Setter<Language>;
  setLevel: Setter<Level>;
  setTutorialStep: Setter<TutorialStep>;
  setLevelAnnouncement: Setter<{ text: string; subtitle?: string } | null>;
  setPathUnlockNotification: Setter<{ name: string; color: string } | null>;

  // Refs / 引用
  gameRef: MutableRefObject<GameStateRef>;
  shakeRef: MutableRefObject<ShakeState>;
  upgradeGlowRef: MutableRefObject<UpgradeGlowState>;
  upgradeModeRef: MutableRefObject<boolean>;
  goldRef: MutableRefObject<number>;
}

export function useGameCallbacks(deps: CallbackDeps) {
  const {
    gameState, selectedTowerType, gold, tutorialStep, level, wave, t,
    setGold, setLives, setScore, setWave,
    setSelectedTowerType, setIsPaused, setUpgradeMode, setSelectedTowerIndex,
    setGameState, setLang, setLevel, setTutorialStep,
    setLevelAnnouncement, setPathUnlockNotification,
    gameRef, shakeRef, upgradeGlowRef, upgradeModeRef, goldRef,
  } = deps;

  // ---- Game Lifecycle / 游戏生命周期 ----

  const startWave = useCallback((waveNum: number) => {
    gameRef.current.enemiesToSpawn = createWave(waveNum);
    gameRef.current.enemySpawnTimer = 0;
    gameRef.current.waveInProgress = true;
    gameRef.current.pathUnlockNotifications = [];
  }, [gameRef]);

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
  }, [t, gameRef, shakeRef, upgradeGlowRef,
      setGold, setLives, setScore, setWave, setSelectedTowerType,
      setIsPaused, setUpgradeMode, setSelectedTowerIndex,
      setPathUnlockNotification, setLevel, setTutorialStep,
      setLevelAnnouncement, setGameState]);

  // ---- Canvas Interaction / 画布交互 ----

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
        setUpgradeMode(false); setSelectedTowerIndex(null);
        return;
      }
      if (state.map[tileY]?.[tileX] === 4) {
        const towerIdx = state.towers.findIndex(
          tw => Math.floor((tw.x - TILE_SIZE / 2) / TILE_SIZE) === tileX &&
                Math.floor((tw.y - TILE_SIZE / 2) / TILE_SIZE) === tileY,
        );
        if (towerIdx !== -1) { setSelectedTowerIndex(towerIdx); return; }
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
  }, [gameState, selectedTowerType, gold, tutorialStep, level, wave, gameRef,
      upgradeModeRef, setGold, setScore, setSelectedTowerIndex, setUpgradeMode, setTutorialStep]);

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
  }, [gameRef, upgradeModeRef]);

  const handleCanvasLeave = useCallback((canvasEl: HTMLCanvasElement | null) => {
    if (canvasEl) canvasEl.style.cursor = upgradeModeRef.current ? 'default' : 'crosshair';
  }, [upgradeModeRef]);

  // ---- Tower Actions / 防御塔操作 ----

  const handleSelectTower = useCallback((type: number) => {
    setSelectedTowerType(p => p === type ? -1 : type);
    setUpgradeMode(false);
    setSelectedTowerIndex(null);
    if (tutorialStep === 2 && selectedTowerType !== type) setTutorialStep(3);
  }, [tutorialStep, selectedTowerType, setSelectedTowerType, setUpgradeMode, setSelectedTowerIndex, setTutorialStep]);

  const handleSelectUpgradeMode = useCallback(() => {
    setUpgradeMode(p => !p);
    setSelectedTowerType(-1);
    setSelectedTowerIndex(null);
  }, [setUpgradeMode, setSelectedTowerType, setSelectedTowerIndex]);

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
    for (let p = 0; p < 8; p++) {
      state.particles.push({
        x: tower.x, y: tower.y,
        vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4 - 2,
        color: '#8D6E63', life: 20 + Math.random() * 10,
        alpha: 1, size: 3 + Math.random() * 3,
      });
    }
  }, [gameRef, setGold, setSelectedTowerIndex, setUpgradeMode]);

  const handleUpgrade = useCallback((towerIndex: number) => {
    const state = gameRef.current;
    const tower = state.towers[towerIndex];
    if (!tower) return;
    if (!state.upgradeUnlocked[tower.type]) {
      const unlockCost = getUnlockCost(state.towers.length);
      if (goldRef.current >= unlockCost) {
        setGold(g => g - unlockCost);
        state.upgradeUnlocked[tower.type] = true;
      }
      return;
    }
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
  }, [gameRef, goldRef, upgradeGlowRef, setGold, setSelectedTowerIndex]);

  // ---- UI / 界面 ----

  const toggleLang = useCallback(() => setLang(p => p === 'zh' ? 'en' : 'zh'), [setLang]);

  const togglePause = useCallback(() => {
    if (gameState !== 'playing' || upgradeModeRef.current) return;
    setIsPaused(p => !p);
  }, [gameState, upgradeModeRef, setIsPaused]);

  return {
    startWave, startGame,
    handleCanvasClick, handleCanvasHover, handleCanvasLeave,
    handleSelectTower, handleSelectUpgradeMode,
    handleSell, handleUpgrade,
    toggleLang, togglePause,
  };
}
