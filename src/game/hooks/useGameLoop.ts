/**
 * useGameLoop - Game Loop Hook / 游戏循环 Hook
 * 
 * Extracts the core animation-frame-based game loop from App.tsx.
 * 从 App.tsx 提取基于 requestAnimationFrame 的核心游戏循环。
 * 
 * Responsibilities:
 * - Enemy spawning and movement
 * - Tower attacks and projectile updates
 * - Collision detection and leak handling
 * - Wave completion and transition logic
 * - Level completion and transition logic
 * - Particle system updates
 * - Screen shake and upgrade glow rendering
 */

import { useEffect, useCallback } from 'react';
import type { GameState, Level, Language, TutorialStep, GameStateRef, Enemy } from '../types';
import type { ShakeState, UpgradeGlowState } from '../gameEngine';
import { TOTAL_WAVES, ENEMY_SPAWN_INTERVAL, WAVE_TRANSITION_DELAY, TUTORIAL_TRANSITION_DELAY, INITIAL_GOLD, INITIAL_LIVES, UPGRADE_GLOW_DURATION, LEVEL_COLORS } from '../constants';
import { spawnEnemy, moveEnemies, towerAttacks, updateProjectiles, calcKillReward } from '../combatSystem';
import { spawnKillEnemyParticles, updateParticles, triggerShake, applyShake, updateUpgradeGlow } from '../gameEngine';
import { renderGame } from '../renderer';
import { buildInitialMap, spawnBoxes, initGameState } from '../mapSystem';
import { startWave as createWave } from '../waveSystem';
import { createShakeState, createUpgradeGlowState } from '../gameEngine';

/** Path unlock configuration / 路径解锁配置 */
const PATH_UNLOCK_WAVES: Record<number, { id: number; name: string; color: string }> = {
  4: { id: 1, name: 'Normal', color: '#80D8FF' },
  6: { id: 0, name: 'Hard', color: '#FF8A80' },
};

/** Callback to compute localized text / 获取本地化文本的回调 */
type TFunction = ReturnType<typeof import('../i18n').TEXT>;

interface UseGameLoopDeps {
  // Core refs / 核心引用
  gameRef:      React.MutableRefObject<GameStateRef>;
  shakeRef:     React.MutableRefObject<ShakeState>;
  upgradeGlowRef: React.MutableRefObject<UpgradeGlowState>;
  selectedTowerRef: React.MutableRefObject<number>;
  selectedTowerIndexRef: React.MutableRefObject<number | null>;
  goldRef:      React.MutableRefObject<number>;
  levelRef:     React.MutableRefObject<Level>;
  waveRef:      React.MutableRefObject<number>;
  langRef:      React.MutableRefObject<Language>;
  tRef:         React.MutableRefObject<TFunction>;
  tutorialStepRef: React.MutableRefObject<TutorialStep>;

  // State values / 状态值
  gameState:    GameState;
  isPaused:     boolean;
  level:        Level;
  wave:         number;
  lang:         Language;
  t:            TFunction;
  tutorialStep: TutorialStep;

  // State setters / 状态设置器
  setGold:      (val: number | ((prev: number) => number)) => void;
  setLives:     (val: number | ((prev: number) => number)) => void;
  setScore:     (val: number | ((prev: number) => number)) => void;
  setWave:      (val: number | ((prev: number) => number)) => void;
  setSelectedTowerType: (val: number) => void;
  setIsPaused:  (val: boolean | ((prev: boolean) => boolean)) => void;
  setUpgradeMode:       (val: boolean | ((prev: boolean) => boolean)) => void;
  setSelectedTowerIndex:(val: number | null) => void;
  setGameState: (val: GameState) => void;
  setLevel:     (val: Level) => void;
  setTutorialStep:     (val: TutorialStep) => void;
  setPathUnlockNotification: (val: { name: string; color: string } | null) => void;
  setLevelAnnouncement: (val: { text: string; subtitle?: string } | null) => void;

  // Callback to start a wave / 开始波次的回调
  startWave:    (waveNum: number) => void;

  // Canvas ref / 画布引用
  canvasRef:    React.RefObject<HTMLCanvasElement | null>;
}

/**
 * useGameLoop hook - manages the game animation loop / 管理游戏动画循环的 Hook
 * 
 * Uses requestAnimationFrame for smooth 60fps rendering.
 * 使用 requestAnimationFrame 实现流畅的 60fps 渲染。
 * 
 * Returns nothing - all state updates happen through the provided setters.
 * 无返回值 - 所有状态更新通过提供的 setter 进行。
 */
export function useGameLoop(deps: UseGameLoopDeps) {
  const {
    gameRef, shakeRef, upgradeGlowRef,
    selectedTowerRef, selectedTowerIndexRef,
    goldRef, levelRef, waveRef, langRef, tRef, tutorialStepRef,
    gameState, isPaused, level, wave, lang, t, tutorialStep,
    setGold, setLives, setScore, setWave,
    setSelectedTowerType, setIsPaused, setUpgradeMode, setSelectedTowerIndex,
    setGameState, setLevel, setTutorialStep, setPathUnlockNotification, setLevelAnnouncement,
    startWave, canvasRef,
  } = deps;

  // On-damage-enemy callback: handles kill rewards and cleanup
  // 敌人受伤回调：处理击杀奖励和清理
  const onDamageEnemy = useCallback((enemy: Enemy) => {
    const { gold: g, score: s } = calcKillReward(enemy);
    setGold(o => o + g);
    if (levelRef.current === 2) setScore(o => o + s);
    spawnKillEnemyParticles(gameRef.current, enemy);
    const idx = gameRef.current.enemies.indexOf(enemy);
    if (idx !== -1) gameRef.current.enemies.splice(idx, 1);
  }, [gameRef, levelRef, setGold, setScore]);

  // Main game loop effect / 主游戏循环副作用
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sync refs for game loop access / 同步 ref 供游戏循环使用
    levelRef.current = level;
    waveRef.current = wave;
    langRef.current = lang;
    tRef.current = t;
    tutorialStepRef.current = tutorialStep;

    /**
     * Per-frame update: spawning, movement, combat, particles
     * 每帧更新：生成、移动、战斗、粒子
     */
    const update = (timestamp: number) => {
      if (gameState !== 'playing' || isPaused) return;
      const state = gameRef.current;

      // Enemy spawning / 敌人生成
      if (state.enemiesToSpawn.length > 0) {
        state.enemySpawnTimer++;
        if (state.enemySpawnTimer >= ENEMY_SPAWN_INTERVAL) {
          state.enemySpawnTimer = 0;
          state.enemies.push(spawnEnemy(state, state.enemiesToSpawn.shift()!, wave));
        }
      }

      // Enemy movement with leak handling / 敌人移动及漏怪处理
      moveEnemies(state, () => {
        triggerShake(shakeRef.current, 10, 15);
        setLives(l => {
          const n = l - 1;
          if (n <= 0) setGameState('gameover');
          return n;
        });
      });

      // Combat systems / 战斗系统
      towerAttacks(state, timestamp);
      updateProjectiles(state, onDamageEnemy);
      updateParticles(state);

      // Wave completion check / 波次完成检查
      if (state.waveInProgress && state.enemiesToSpawn.length === 0 && state.enemies.length === 0) {
        state.waveInProgress = false;

        // Level 1 completion - transition to Level 2
        // Level 1 完成 - 过渡到 Level 2
        if (levelRef.current === 1) {
          setTutorialStep(0);
          setLevelAnnouncement({ text: tRef.current.level1Complete });

          setTimeout(() => {
            // Full reset for Level 2 / 完全重置以开始 Level 2
            const { map, path, paths, pathIds } = buildInitialMap();
            const boxes = spawnBoxes(map);
            gameRef.current = initGameState(map, path, paths, pathIds, boxes);
            shakeRef.current = createShakeState();
            upgradeGlowRef.current = createUpgradeGlowState();
            setGold(INITIAL_GOLD); setLives(INITIAL_LIVES); setScore(0); setWave(1);
            setSelectedTowerType(-1); setIsPaused(false); setUpgradeMode(false);
            setSelectedTowerIndex(null); setGameState('playing');
            setPathUnlockNotification(null);
            setLevel(2);
            setTutorialStep(0);
            setLevelAnnouncement({
              text: tRef.current.level2Announcement,
              subtitle: tRef.current.level2Subtitle,
            });

            // Start Level 2 wave 1 / 开始 Level 2 第一波
            gameRef.current.enemiesToSpawn = createWave(1);
            gameRef.current.enemySpawnTimer = 0;
            gameRef.current.waveInProgress = true;
          }, TUTORIAL_TRANSITION_DELAY);
          return; // Skip wave completion handling / 跳过波次完成处理
        }

        // Level 2+ wave completion: check path unlocks, start next wave
        // Level 2+ 波次完成：检查路径解锁，开始下一波
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

    /**
     * Per-frame render: game world + shake + upgrade glow
     * 每帧渲染：游戏世界 + 震动 + 升级光环
     */
    const render = () => {
      const shake = applyShake(shakeRef.current);
      ctx.setTransform(1, 0, 0, 1, shake.offsetX, shake.offsetY);

      // Update upgrade glow state / 更新升级光环状态
      updateUpgradeGlow(upgradeGlowRef.current);

      // Render main game / 渲染游戏主画面
      renderGame(
        ctx, gameRef.current, gameRef.current.hoverTile,
        selectedTowerRef.current, goldRef.current,
        tutorialStepRef.current, selectedTowerIndexRef.current,
      );

      // Draw upgrade glow animation / 绘制升级光环动画
      if (upgradeGlowRef.current.active) {
        const g = upgradeGlowRef.current;
        const progress = g.frame / UPGRADE_GLOW_DURATION;  // Animation progress 1→0
        const radius = 20 + (1 - progress) * 20;            // Expands from 20px to 40px
        const alpha = progress;                             // Fades from opaque to transparent

        // Find upgraded tower for level-based color / 查找升级的防御塔以获取等级颜色
        const upgradedTower = gameRef.current.towers.find(
          t => Math.abs(t.x - g.towerX) < 1 && Math.abs(t.y - g.towerY) < 1,
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

    // Start animation loop / 启动动画循环
    let animationId = requestAnimationFrame(function loop(t: number) {
      update(t);
      render();
      animationId = requestAnimationFrame(loop);
    });

    return () => cancelAnimationFrame(animationId);
  }, [gameState, wave, startWave, isPaused, level, canvasRef,
      lang, t, tutorialStep,
      gameRef, shakeRef, upgradeGlowRef,
      selectedTowerRef, selectedTowerIndexRef,
      goldRef, levelRef, waveRef, langRef, tRef, tutorialStepRef,
      setGold, setLives, setScore, setWave,
      setSelectedTowerType, setIsPaused, setUpgradeMode, setSelectedTowerIndex,
      setGameState, setLevel, setTutorialStep, setPathUnlockNotification, setLevelAnnouncement,
      onDamageEnemy]);

  // Return nothing - this hook manages side effects only
  // 无返回值 - 此 Hook 仅管理副作用
  return;
}
