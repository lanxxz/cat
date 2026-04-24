/**
 * Combat System / 战斗系统
 * 
 * 敌人生成、攻击、伤害计算 - 支持多路径
 * @module combatSystem
 */

import type { Enemy, GameStateRef } from './types';
import { ENEMY_TYPES, TOWER_TYPES, WAVE_SPEED_BONUS, LEAK_SPEED_BONUS, TOWER_SPEED_BONUS, MOSQUITO_SPEED_BONUS, RAT_SPEED_BONUS, TOWER_REWARD_BONUS, SPEED_SCORE_MULTIPLIER, PROJECTILE_LIFE, TILE_SIZE, GRID_WIDTH, GRID_HEIGHT } from './constants';

/**
 * 敌人生成 / Spawn enemy
 * @param state - 游戏状态
 * @param type - 敌人类型
 * @param currentWave - 当前波次
 * @param pathId - 路径ID（如果有指定）
 */
export function spawnEnemy(state: GameStateRef, type: number, currentWave: number, pathId?: number): Enemy {
  const enemyType = ENEMY_TYPES[type];
  
  // 如果指定了路径ID，使用该路径；否则从已解锁路径中随机选择
  let chosenPathId: number;
  if (pathId !== undefined) {
    chosenPathId = pathId;
  } else {
    // 从已解锁路径中随机选择
    const unlocked = state.unlockedPaths || [2];  // 默认只有Easy路径
    chosenPathId = unlocked[Math.floor(Math.random() * unlocked.length)];
  }
  
  const path = state.paths[chosenPathId] || state.paths[0];
  const startPos = path[0];
  
  const waveBonus = (currentWave - 1) * WAVE_SPEED_BONUS;
  const leakBonus = state.enemiesLeaked * LEAK_SPEED_BONUS;
  const towerBonus = state.towers.length * TOWER_SPEED_BONUS;
  const enemyTypeBonus = type === 2 ? MOSQUITO_SPEED_BONUS : (type === 3 ? RAT_SPEED_BONUS : 0);
  const speed = enemyType.speed * (1 + waveBonus + leakBonus + towerBonus + enemyTypeBonus);
  const reward = Math.floor(enemyType.reward * (1 + state.towers.length * TOWER_REWARD_BONUS));
  
  return { 
    x: startPos.x, 
    y: startPos.y, 
    type, 
    health: enemyType.health, 
    maxHealth: enemyType.health, 
    speed, 
    reward, 
    pathIndex: 2, 
    pathId: chosenPathId,
    wobble: Math.random() * 6.28 
  };
}

/**
 * 敌人移动 - 支持多路径 / Move enemies with multi-path support
 */
export function moveEnemies(state: GameStateRef, onLeak: () => void): number {
  let leakedCount = 0;
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const e = state.enemies[i];
    
    // 获取当前敌人所在的路径
    const path = state.paths[e.pathId];
    if (!path) continue;
    
    const targetIndex = Math.min(e.pathIndex, path.length - 1);
    const target = path[targetIndex];
    const dx = target.x - e.x;
    const dy = target.y - e.y;
    const dist = Math.hypot(dx, dy);
    
    if (dist < e.speed) {
      e.pathIndex++;
    } else {
      e.x += (dx / dist) * e.speed;
      e.y += (dy / dist) * e.speed;
    }
    e.wobble += 0.2;
    
    // 检查是否到达路径终点
    if (e.pathIndex >= path.length) {
      state.enemies.splice(i, 1);
      state.enemiesLeaked++;
      onLeak();
    }
  }
  return leakedCount;
}

/**
 * 防御塔攻击 / Tower attacks
 */
export function towerAttacks(state: GameStateRef, timestamp: number): void {
  for (const tower of state.towers) {
    const towerType = TOWER_TYPES[tower.type];
    if (timestamp - tower.lastAttack < towerType.attackSpeed) continue;
    
    let target: Enemy | null = null;
    let maxProgress = -1;
    for (const e of state.enemies) {
      const dist = Math.hypot(e.x - tower.x, e.y - tower.y);
      if (dist <= towerType.range && e.pathIndex > maxProgress) { maxProgress = e.pathIndex; target = e; }
    }
    
    if (target) {
      tower.lastAttack = timestamp;
      const angle = Math.atan2(target.y - tower.y, target.x - tower.x);
      tower.angle = angle;
      state.projectiles.push({ x: tower.x, y: tower.y, angle, speed: towerType.type === 'aoe' ? 8 : (tower.type === 0 ? 10 : 15), damage: towerType.damage, type: towerType.type as 'single' | 'aoe', aoeRadius: towerType.aoeRadius, life: PROJECTILE_LIFE });
    }
  }
}

/**
 * 投射物更新 / Update projectiles
 */
export function updateProjectiles(state: GameStateRef, onDamageEnemy: (e: Enemy) => void): void {
  for (let i = state.projectiles.length - 1; i >= 0; i--) {
    const p = state.projectiles[i];
    p.x += Math.cos(p.angle) * p.speed;
    p.y += Math.sin(p.angle) * p.speed;
    p.life--;
    
    for (let j = state.enemies.length - 1; j >= 0; j--) {
      const e = state.enemies[j];
      if (Math.hypot(p.x - e.x, p.y - e.y) < 25) {
        if (p.type === 'aoe') {
          const aoeRad = p.aoeRadius || 60;
          for (const e2 of state.enemies) if (Math.hypot(p.x - e2.x, p.y - e2.y) < aoeRad) { e2.health -= p.damage; if (e2.health <= 0) onDamageEnemy(e2); }
        } else { e.health -= p.damage; if (e.health <= 0) onDamageEnemy(e); }
        state.projectiles.splice(i, 1);
        break;
      }
    }
    
    if (p.life <= 0 || p.x < 0 || p.x > GRID_WIDTH * TILE_SIZE || p.y < 0 || p.y > GRID_HEIGHT * TILE_SIZE) state.projectiles.splice(i, 1);
  }
}

/**
 * 计算击杀奖励 / Calculate kill reward
 */
export function calcKillReward(enemy: Enemy): { gold: number; score: number } {
  const speedBonus = Math.floor(enemy.speed * SPEED_SCORE_MULTIPLIER);
  return { gold: enemy.reward, score: (enemy.reward + speedBonus) * 10 };
}