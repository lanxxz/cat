/**
 * Wave System / 波次系统
 * 
 * 波次管理和敌人生成 - 支持多路径
 * @module waveSystem
 */

import type { Enemy } from './types';
import { ENEMY_TYPES, WAVES, WAVE_SPEED_BONUS, LEAK_SPEED_BONUS, TOWER_SPEED_BONUS, MOSQUITO_SPEED_BONUS, RAT_SPEED_BONUS, TOWER_REWARD_BONUS, SPEED_SCORE_MULTIPLIER } from './constants';

/**
 * 创建敌人 / Spawn enemy
 * 
 * @deprecated 未使用 - combatSystem.ts 中的 spawnEnemy 函数替代了此功能。保留供参考。
 * Unused - replaced by spawnEnemy() in combatSystem.ts. Kept for reference.
 * 
 * @param type - 敌人类型索引
 * @param path - 路径数组（多路径）
 * @param pathId - 路径ID
 * @param currentWave - 当前波次
 * @param towersCount - 防御塔数量
 * @param enemiesLeaked - 漏敌数
 * @returns 敌对象
 */
export function createEnemy(
  type: number, 
  paths: { x: number; y: number }[][], 
  pathId: number,
  currentWave: number, 
  towersCount: number, 
  enemiesLeaked: number
): Enemy {
  const enemyType = ENEMY_TYPES[type];
  const path = paths[pathId] || paths[0];
  const startPos = path[0];
  
  // 速度计算
  const waveBonus = (currentWave - 1) * WAVE_SPEED_BONUS;
  const leakBonus = enemiesLeaked * LEAK_SPEED_BONUS;
  const towerBonus = towersCount * TOWER_SPEED_BONUS;
  let enemyTypeBonus = 0;
  if (type === 2) enemyTypeBonus = MOSQUITO_SPEED_BONUS;
  if (type === 3) enemyTypeBonus = RAT_SPEED_BONUS;
  const speedMultiplier = 1 + waveBonus + leakBonus + towerBonus + enemyTypeBonus;
  const finalSpeed = enemyType.speed * speedMultiplier;
  
  // 奖励计算
  const rewardMultiplier = 1 + towersCount * TOWER_REWARD_BONUS;
  const finalReward = Math.floor(enemyType.reward * rewardMultiplier);
  
  return {
    x: startPos.x,
    y: startPos.y,
    type,
    health: enemyType.health,
    maxHealth: enemyType.health,
    speed: finalSpeed,
    reward: finalReward,
    pathIndex: 2,
    pathId: pathId,
    wobble: Math.random() * Math.PI * 2
  };
}

/**
 * 开始波次 / Start wave
 * @param waveNum - 波次号 (1-15)
 * @returns 敌人类型队列
 */
export function startWave(waveNum: number): number[] {
  const waveData = WAVES[waveNum - 1];
  const enemiesToSpawn: number[] = [];
  
  for (const enemyGroup of waveData) {
    for (let i = 0; i < enemyGroup.count; i++) {
      enemiesToSpawn.push(enemyGroup.type);
    }
  }
  
  // 随机打乱
  for (let i = enemiesToSpawn.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [enemiesToSpawn[i], enemiesToSpawn[j]] = [enemiesToSpawn[j], enemiesToSpawn[i]];
  }
  
  return enemiesToSpawn;
}

/**
 * 处理敌人生成 / Handle enemy spawning
 * 
 * @deprecated 未使用 - 游戏循环在 useGameLoop.ts 中直接使用 spawnEnemy()（来自 combatSystem.ts）。
 * Unused - game loop uses spawnEnemy() from combatSystem.ts directly.
 * 
 * @param enemiesToSpawn - 待生成队列
 * @param timer - 生成计时器
 * @param interval - 生成间隔
 * @param paths - 路径数组（多路径）
 * @param currentWave - 当前波次
 * @param towersCount - 防御塔数量
 * @param enemiesLeaked - 漏敌数
 * @returns 生成的新敌人或null
 */
export function spawnEnemyIfNeeded(
  enemiesToSpawn: number[], 
  timer: number, 
  interval: number,
  paths: { x: number; y: number }[][],  // 多路径数组
  currentWave: number,
  towersCount: number,
  enemiesLeaked: number
): Enemy | null {
  if (enemiesToSpawn.length > 0 && timer >= interval) {
    const pathId = Math.floor(Math.random() * paths.length);
    return createEnemy(enemiesToSpawn.shift()!, paths, pathId, currentWave, towersCount, enemiesLeaked);
  }
  return null;
}

/**
 * 计算击杀得分 / Calculate kill score
 * 
 * @deprecated 未使用 - combatSystem.ts 中的同名函数是实际使用版本。此副本已废弃。
 * Unused - duplicate function in combatSystem.ts is the live version.
 * 
 * @param enemy - 敌人
 * @returns { gold, score }
 */
export function calcKillReward(enemy: Enemy): { gold: number; score: number } {
  const speedBonus = Math.floor(enemy.speed * SPEED_SCORE_MULTIPLIER);
  return {
    gold: enemy.reward,
    score: (enemy.reward + speedBonus) * 10
  };
}