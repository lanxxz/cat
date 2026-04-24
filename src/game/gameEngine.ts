/**
 * Game Engine / 游戏引擎
 * 
 * Core game mechanics封装：
 * - 粒子系统
 * - 屏幕震动系统
 * - 游戏初始化辅助
 * 
 * @module gameEngine
 */

import type { Particle, Enemy, GameStateRef } from './types';
import {
  PARTICLE_COUNT_BREAK_BOX,
  PARTICLE_COUNT_PLACE_TOWER,
  PARTICLE_COUNT_KILL_ENEMY,
  PARTICLE_GRAVITY,
  TILE_SIZE
} from './constants';

// ============================================
// PARTICLE SYSTEM / 粒子系统
// ============================================

/**
 * 创建粒子 / Create particle
 * @param x - X坐标
 * @param y - Y坐标
 * @param color - 粒子颜色
 * @returns 粒子对象
 */
export function createParticle(x: number, y: number, color: string): Particle {
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 8,
    vy: (Math.random() - 0.5) * 8 - 3,
    color,
    life: 30 + Math.random() * 20,
    alpha: 1,
    size: 4 + Math.random() * 4
  };
}

/**
 * 生成打破纸箱的粒子 / Spawn particles when breaking box
 * @param state - 游戏状态
 * @param tileX - 格子X坐标
 * @param tileY - 格子Y坐标
 */
export function spawnBreakBoxParticles(state: GameStateRef, tileX: number, tileY: number): void {
  const x = tileX * TILE_SIZE + TILE_SIZE / 2;
  const y = tileY * TILE_SIZE + TILE_SIZE / 2;
  for (let p = 0; p < PARTICLE_COUNT_BREAK_BOX; p++) {
    state.particles.push(createParticle(x, y, '#8D6E63'));
  }
}

/**
 * 生成放置防御塔的粒子 / Spawn particles when placing tower
 * @param state - 游戏状态
 * @param tileX - 格子X坐标
 * @param tileY - 格子Y坐标
 */
export function spawnPlaceTowerParticles(state: GameStateRef, tileX: number, tileY: number): void {
  const x = tileX * TILE_SIZE + TILE_SIZE / 2;
  const y = tileY * TILE_SIZE + TILE_SIZE / 2;
  for (let p = 0; p < PARTICLE_COUNT_PLACE_TOWER; p++) {
    state.particles.push(createParticle(x, y, '#FFD700'));
  }
}

/**
 * 生成击杀敌人的粒子 / Spawn particles when killing enemy
 * @param state - 游戏状态
 * @param enemy - 敌人对象
 */
export function spawnKillEnemyParticles(state: GameStateRef, enemy: Enemy): void {
  for (let p = 0; p < PARTICLE_COUNT_KILL_ENEMY; p++) {
    state.particles.push(createParticle(enemy.x, enemy.y, '#7CB342'));
  }
}

/**
 * 更新所有粒子 / Update all particles
 * @param state - 游戏状态
 */
export function updateParticles(state: GameStateRef): void {
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += PARTICLE_GRAVITY;
    p.life--;
    p.alpha = p.life / 30;
    if (p.life <= 0) state.particles.splice(i, 1);
  }
}

// ============================================
// SCREEN SHAKE SYSTEM / 屏幕震动系统
// ============================================

export interface ShakeState {
  intensity: number;
  duration: number;
}

/**
 * 创建屏幕震动状态 / Create shake state
 * @returns 初始震动状态
 */
export function createShakeState(): ShakeState {
  return { intensity: 0, duration: 0 };
}

/**
 * 触发屏幕震动 / Trigger screen shake
 * @param state - 震动状态
 * @param intensity - 震动强度
 * @param duration - 持续帧数
 */
export function triggerShake(state: ShakeState, intensity: number, duration: number): void {
  state.intensity = intensity;
  state.duration = duration;
}

/**
 * 应用屏幕震动并获取偏移 / Apply shake and get offset
 * @param state - 震动状态
 * @returns 偏移量 { offsetX, offsetY }
 */
export function applyShake(state: ShakeState): { offsetX: number; offsetY: number } {
  if (state.duration > 0) {
    const offsetX = (Math.random() - 0.5) * state.intensity;
    const offsetY = (Math.random() - 0.5) * state.intensity;
    state.duration--;
    if (state.duration <= 0) state.intensity = 0;
    return { offsetX, offsetY };
  }
  return { offsetX: 0, offsetY: 0 };
}