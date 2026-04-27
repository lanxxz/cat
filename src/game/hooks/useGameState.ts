/**
 * useGameState - Game State Management Hook / 游戏状态管理 Hook
 * 
 * Centralizes all useState and useRef declarations for the game.
 * 集中管理游戏的所有 useState 和 useRef 声明。
 * 
 * Returns:
 * - State values and setters
 * - Mutable refs for game loop access
 * - Localized text function
 * - Responsive device info
 */

import { useState, useRef } from 'react';
import type { GameState, Language, Level, TutorialStep, GameStateRef } from '../types';
import type { ShakeState, UpgradeGlowState } from '../gameEngine';
import { INITIAL_GOLD, INITIAL_LIVES } from '../constants';
import { initGameState } from '../mapSystem';
import { createShakeState, createUpgradeGlowState } from '../gameEngine';
import { TEXT } from '../i18n';
import { useResponsiveScale } from '../responsive';

export function useGameState() {
  // ---- Canvas Ref / 画布引用 ----
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ---- State / 状态 ----
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

  // ---- Derived / 派生 ----
  const t = TEXT(lang);

  // ---- Mutable Refs / 可变引用 ----
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

  // ---- Ref Sync / 引用同步 ----
  selectedTowerRef.current = selectedTowerType;
  upgradeModeRef.current = upgradeMode;
  selectedTowerIndexRef.current = selectedTowerIndex;
  goldRef.current = gold;
  tutorialStepRef.current = tutorialStep;

  // ---- Responsive / 响应式 ----
  const { isPhone, isTablet } = useResponsiveScale();

  return {
    // Canvas / 画布
    canvasRef,
    // State values / 状态值
    gameState, lang, gold, lives, score, wave,
    selectedTowerType, isPaused, pathUnlockNotification,
    level, tutorialStep, levelAnnouncement,
    upgradeMode, selectedTowerIndex,
    // Setters / 设置器
    setGameState, setLang, setGold, setLives, setScore, setWave,
    setSelectedTowerType, setIsPaused, setPathUnlockNotification,
    setLevel, setTutorialStep, setLevelAnnouncement,
    setUpgradeMode, setSelectedTowerIndex,
    // Refs / 引用
    gameRef, shakeRef, upgradeGlowRef,
    selectedTowerRef, upgradeModeRef, selectedTowerIndexRef,
    goldRef, levelRef, waveRef, tutorialStepRef, langRef, tRef,
    handleSellRef, handleUpgradeRef, wasPausedBeforeUpgradeRef,
    // Derived / 派生
    t,
    // Responsive / 响应式
    isPhone, isTablet,
  };
}
