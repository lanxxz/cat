/**
 * Wave System / 波次系统
 * 
 * 波次管理和敌人生成
 * @module waveSystem
 */

import type { Enemy } from './types';
import { ENEMY_TYPES, WAVES, WAVE_SPEED_BONUS, LEAK_SPEED_BONUS, TOWER_SPEED_BONUS, MOSQUITO_SPEED_BONUS, RAT_SPEED_BONUS, TOWER_REWARD_BONUS, SPEED_SCORE_MULTIPLIER } from './constants';

/**
 * 创建敌人 / Spawn enemy
 * @param type - 敌人类型索引
 * @param path - 路径起点
 * @param currentWave - 当前波次
 * @param towersCount - 防御塔数量
 * @param enemiesLeaked - 漏敌数
 * @returns 敌对象
 */
export function createEnemy(type: number, path: { x: number; y: number }[], currentWave: number, towersCount: number, enemiesLeaked: number): Enemy {
  const enemyType = ENEMY_TYPES[type];
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
 * @param enemiesToSpawn - 待生成队列
 * @param timer - 生成计时器
 * @param interval - 生成间隔
 * @param path - 路径
 * @param currentWave - 当前波次
 * @param towersCount - 防御塔数量
 * @param enemiesLeaked - 漏敌数
 * @returns 生成的新敌人或null
 */
export function spawnEnemyIfNeeded(
  enemiesToSpawn: number[], 
  timer: number, 
  interval: number,
  path: { x: number; y: number }[],
  currentWave: number,
  towersCount: number,
  enemiesLeaked: number
): Enemy | null {
  if (enemiesToSpawn.length > 0 && timer >= interval) {
    return createEnemy(enemiesToSpawn.shift()!, path, currentWave, towersCount, enemiesLeaked);
  }
  return null;
}

/**
 * 计算击杀得分 / Calculate kill score
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