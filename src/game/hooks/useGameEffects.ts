/**
 * useGameEffects - Game Side Effects / 游戏副作用 Hook
 * 
 * All useEffect blocks extracted from App.tsx.
 * 从 App.tsx 提取的所有 useEffect 副作用。
 * 
 * Effects:
 * - Path unlock notification monitor
 * - Auto-dismiss level announcement
 * - Tutorial step 4: start Level 1 wave
 * - Upgrade mode auto-pause
 * - Keyboard shortcuts (U key + pause handler)
 */

import { useEffect, MutableRefObject } from 'react';
import type { GameState, Level, TutorialStep, GameStateRef } from '../types';
import { LEVEL_ANNOUNCEMENT_DURATION, LEVEL1_WAVE } from '../constants';
import { useKeyboardHandler } from '../keyboard';

/** Path unlock configuration / 路径解锁配置 */
const PATH_UNLOCK_WAVES: Record<number, { id: number; name: string; color: string }> = {
  4: { id: 1, name: 'Normal', color: '#80D8FF' },
  6: { id: 0, name: 'Hard', color: '#FF8A80' },
};

interface EffectsDeps {
  // State / 状态
  gameState: GameState;
  wave: number;
  level: Level;
  tutorialStep: TutorialStep;
  levelAnnouncement: { text: string; subtitle?: string } | null;
  upgradeMode: boolean;
  isPaused: boolean;

  // Setters / 设置器
  setPathUnlockNotification: (val: { name: string; color: string } | null) => void;
  setLevelAnnouncement: (val: { text: string; subtitle?: string } | null) => void;
  setTutorialStep: (val: TutorialStep) => void;
  setIsPaused: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Refs / 引用
  gameRef: MutableRefObject<GameStateRef>;
  wasPausedBeforeUpgradeRef: MutableRefObject<boolean>;

  // Callbacks / 回调
  handleSelectUpgradeMode: () => void;
  togglePause: () => void;
}

export function useGameEffects(deps: EffectsDeps) {
  const {
    gameState, wave, level, tutorialStep, levelAnnouncement,
    upgradeMode, isPaused,
    setPathUnlockNotification, setLevelAnnouncement, setTutorialStep, setIsPaused,
    gameRef, wasPausedBeforeUpgradeRef,
    handleSelectUpgradeMode, togglePause,
  } = deps;

  // ---- Path Unlock Notification / 路径解锁通知 ----
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
  }, [wave, gameRef, setPathUnlockNotification]);

  // ---- Auto-dismiss Level Announcement / 关卡公告自动消失 ----
  useEffect(() => {
    if (levelAnnouncement) {
      const timer = setTimeout(() => setLevelAnnouncement(null), LEVEL_ANNOUNCEMENT_DURATION);
      return () => clearTimeout(timer);
    }
  }, [levelAnnouncement, setLevelAnnouncement]);

  // ---- Tutorial Step 4: Start Level 1 Wave / 教程步骤 4：开始 Level 1 ----
  useEffect(() => {
    if (tutorialStep === 4 && level === 1) {
      const timer = setTimeout(() => {
        const level1EnemyTypes: number[] = [];
        for (const group of LEVEL1_WAVE) {
          for (let i = 0; i < group.count; i++) {
            level1EnemyTypes.push(group.type);
          }
        }
        for (let i = level1EnemyTypes.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [level1EnemyTypes[i], level1EnemyTypes[j]] = [level1EnemyTypes[j], level1EnemyTypes[i]];
        }
        gameRef.current.enemiesToSpawn = level1EnemyTypes;
        gameRef.current.enemySpawnTimer = 0;
        gameRef.current.waveInProgress = true;
        setTutorialStep(0);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [tutorialStep, level, gameRef, setTutorialStep]);

  // ---- Upgrade Mode Auto-Pause / 升级模式自动暂停 ----
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

  // ---- Keyboard Shortcuts / 键盘快捷键 ----
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'u' && gameState === 'playing') {
        handleSelectUpgradeMode();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [gameState, handleSelectUpgradeMode]);

  // ---- Pause Keyboard Handler (Space) / 暂停键盘处理 ----
  useKeyboardHandler(gameState, togglePause);
}
