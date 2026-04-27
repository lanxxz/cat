/**
 * Game Constants / 游戏常量配置
 * 
 * Central configuration file for all game constants.
 * 所有游戏常量的集中配置文件。
 */

import type { WaveData } from './types';

/** 
 * ============================================
 * GRID & MAP CONFIGURATION / 网格与地图配置
 * ============================================
 */

/** 单个格子像素大小 / Size of each tile in pixels */
export const TILE_SIZE = 64;

/** 网格宽度（格子数）/ Grid width in tiles */
export const GRID_WIDTH = 12;

/** 网格高度（格子数）/ Grid height in tiles */
export const GRID_HEIGHT = 8;

/** 
 * ============================================
 * GAME BALANCE / 游戏平衡
 * ============================================
 */

/** 波次总数 / Total number of waves */
export const TOTAL_WAVES = 15;

/** 初始金币 / Starting gold */
export const INITIAL_GOLD = 200;

/** 初始生命值 / Starting lives */
export const INITIAL_LIVES = 10;

/** 玩家生命值上限 / Maximum lives player can have */
export const MAX_LIVES = 10;

/** 纸箱数量 / Number of box obstacles */
export const BOX_COUNT = 5;

/** 打破纸箱奖励金币 / Gold reward for breaking a box */
export const BOX_GOLD_REWARD = 5;

/** 打破纸箱奖励分数 / Score reward for breaking a box */
export const BOX_SCORE_REWARD = 10;

/** 敌人生成间隔（帧）/ Enemy spawn interval in frames */
export const ENEMY_SPAWN_INTERVAL = 60;

/** Level 1 敌人数量 / Level 1 enemy count */
export const LEVEL1_ENEMY_COUNT = 3;

/** 粒子效果数量 - 打破纸箱 / Particle count - breaking box */
export const PARTICLE_COUNT_BREAK_BOX = 10;

/** 粒子效果数量 - 放置防御塔 / Particle count - placing tower */
export const PARTICLE_COUNT_PLACE_TOWER = 15;

/** 粒子效果数量 - 击杀敌人 / Particle count - killing enemy */
export const PARTICLE_COUNT_KILL_ENEMY = 15;

/** 敌人摆动动画速度 / Enemy wobble animation speed */
export const ENEMY_WOBBLE_SPEED = 0.2;

/** 投射物生命周期（帧）/ Projectile life in frames */
export const PROJECTILE_LIFE = 60;

/** 粒子重力 / Particle gravity */
export const PARTICLE_GRAVITY = 0.2;

/** 波次间隔延迟（毫秒）/ Wave transition delay in ms */
export const WAVE_TRANSITION_DELAY = 1000;

/** 教程过渡延迟（毫秒）/ Tutorial transition delay in ms */
export const TUTORIAL_TRANSITION_DELAY = 2000;

/** 关卡播报持续时间（毫秒）/ Level announcement duration in ms */
export const LEVEL_ANNOUNCEMENT_DURATION = 2500;

/** 
 * ============================================
 * SPEED MULTIPLIERS / 速度倍率
 * ============================================
 */

/** 每波敌人速度加成 / Speed bonus per wave (+10%) */
export const WAVE_SPEED_BONUS = 0.1;

/** 每个漏掉敌人速度加成 / Speed bonus per leaked enemy (+5%) */
export const LEAK_SPEED_BONUS = 0.05;

/** 每只猫速度加成 / Speed bonus per tower (+2%) */
export const TOWER_SPEED_BONUS = 0.02;

/** 蚊子额外速度加成 (+50%) / Mosquito speed bonus */
export const MOSQUITO_SPEED_BONUS = 0.5;

/** 老鼠额外速度加成 (+100%) / Rat speed bonus */
export const RAT_SPEED_BONUS = 1.0;

/** 
 * ============================================
 * SCORE & REWARD / 分数与奖励
 * ============================================
 */

/** 每只猫奖励加成 (+4%) / Reward bonus per tower */
export const TOWER_REWARD_BONUS = 0.04;

/** 速度奖励分数计算系数 / Speed bonus score multiplier */
export const SPEED_SCORE_MULTIPLIER = 10;

/** 击杀分数倍率 / Kill score multiplier */
export const KILL_SCORE_MULTIPLIER = 10;

/** 
 * ============================================
 * TOWER TYPES / 防御塔类型
 * ============================================
 */

export interface TowerTypeConfig {
  name: string;           // Tower name / 防御塔名称
  cost: number;           // Gold cost / 金币费用
  damage: number;         // Damage per attack / 每次攻击伤害
  attackSpeed: number;    // Attack interval (ms) / 攻击间隔 (毫秒)
  range: number;          // Attack range (pixels) / 攻击范围 (像素)
  color: string;          // Primary color / 主颜色
  projectileColor: string; // Projectile color / 投射物颜色
  type: 'single' | 'aoe'; // Attack type / 攻击类型
  aoeRadius?: number;     // AOE radius (for AOE towers) / AOE 半径
}

/**
 * 防御塔配置 / Tower configurations
 * 
 * 0: 😸 Spitting Tabby - 快速单发攻击 / Fast single attack
 * 1: 😺 Siamese Sniper - 远程高伤害 / Long range, high damage  
 * 2: 😻 Orange Bread Cat - 范围AOE伤害 / Area damage
 */
export const TOWER_TYPES: TowerTypeConfig[] = [
  { 
    name: 'Spitting Tabby', 
    cost: 50, 
    damage: 15, 
    attackSpeed: 500, 
    range: 100, 
    color: '#FFA726', 
    projectileColor: '#FFF8E1', 
    type: 'single' 
  },
  { 
    name: 'Siamese Sniper', 
    cost: 75, 
    damage: 50, 
    attackSpeed: 1500, 
    range: 200, 
    color: '#90A4AE', 
    projectileColor: '#E91E63', 
    type: 'single' 
  },
  { 
    name: 'Orange Bread Cat', 
    cost: 100, 
    damage: 25, 
    attackSpeed: 1000, 
    range: 120, 
    color: '#FF8A65', 
    projectileColor: '#D7CCC8', 
    type: 'aoe', 
    aoeRadius: 60 
  }
];

/** 
 * ============================================
 * ENEMY TYPES / 敌人类型
 * ============================================
 */

export interface EnemyTypeConfig {
  name: string;      // Enemy name / 敌人名称
  health: number;    // Health points / 生命值
  speed: number;     // Base speed / 基础速度
  reward: number;    // Gold reward / 金币奖励
  color: string;     // Primary color / 主颜色
  emoji: string;     // Emoji representation / Emoji 表示
}

/**
 * 敌人配置 / Enemy configurations
 * 
 * 0: 🥒 Cucumber - 黄瓜 / 快速低血量
 * 1: 🧹 Vacuum - 吸尘器 / 慢速高血量
 * 2: 🦟 Mosquito - 蚊子 / 快速低血量 (wave 5+)
 * 3: 🐀 Rat - 老鼠 / 中速中血量 (wave 10+)
 */
export const ENEMY_TYPES: EnemyTypeConfig[] = [
  { name: 'Cucumber', health: 30, speed: 1, reward: 20, color: '#7CB342', emoji: '🥒' },
  { name: 'Vacuum', health: 180, speed: 0.8, reward: 35, color: '#607D8B', emoji: '🧹' },
  { name: 'Mosquito', health: 30, speed: 3, reward: 40, color: '#37474F', emoji: '🦟' },
  { name: 'Rat', health: 200, speed: 1.5, reward: 50, color: '#8D6E63', emoji: '🐀' }
];

/** 
 * ============================================
 * PATH CONFIGURATION / 路径配置
 * ============================================
 */

import type { Path, Position } from './types';

/**
 * 敌人路径坐标（网格坐标）/ Enemy path coordinates (grid coordinates)
 * 
 * 路径从左侧进入，蜿蜒穿过地图，从右侧离开
 * Path enters from left, winds through map, exits on right
 * @deprecated 使用 PATHS 多路径系统 / Use PATHS multi-path system
 */
export const PATH_COORDS = [
  { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 },
  { x: 3, y: 2 }, { x: 3, y: 1 }, { x: 3, y: 0 },
  { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
  { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 },
  { x: 7, y: 5 }, { x: 7, y: 6 }, { x: 7, y: 7 },
  { x: 8, y: 7 }, { x: 9, y: 7 }, { x: 10, y: 7 }, { x: 11, y: 7 }
];

/**
 * 多路径系统配置 / Multi-path system configuration
 * 
 * 支持多条路径、分支、循环
 * - Path 0 (顶部): 从上方进入，短路径，高难度
 * - Path 1 (中部): 从左侧进入，中等难度  
 * - Path 2 (底部): 从下方进入，长路径，低难度
 */
export const PATHS: Path[] = [
  // Path 0: 顶部路径 - 短而快，高难度
  {
    id: 0,
    name: 'Top Road',
    difficulty: 3,
    color: '#FF8A80',  // 红色 - 高难度
    enemyTypes: [0, 1, 2, 3],  // 所有敌人类型
    nodes: [
      { x: 5 * TILE_SIZE + TILE_SIZE / 2, y: 0 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 5 * TILE_SIZE + TILE_SIZE / 2, y: 1 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 5 * TILE_SIZE + TILE_SIZE / 2, y: 2 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 6 * TILE_SIZE + TILE_SIZE / 2, y: 2 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 7 * TILE_SIZE + TILE_SIZE / 2, y: 2 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 8 * TILE_SIZE + TILE_SIZE / 2, y: 2 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 9 * TILE_SIZE + TILE_SIZE / 2, y: 2 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 10 * TILE_SIZE + TILE_SIZE / 2, y: 2 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 10 * TILE_SIZE + TILE_SIZE / 2, y: 3 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 10 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 10 * TILE_SIZE + TILE_SIZE / 2, y: 5 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 11 * TILE_SIZE + TILE_SIZE / 2, y: 5 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 11 * TILE_SIZE + TILE_SIZE / 2, y: 6 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 11 * TILE_SIZE + TILE_SIZE / 2, y: 7 * TILE_SIZE + TILE_SIZE / 2 }
    ]
  },
  // Path 1: 中部路径 - 原始路径，中等难度
  {
    id: 1,
    name: 'Middle Road',
    difficulty: 2,
    color: '#80D8FF',  // 蓝色 - 中等难度
    enemyTypes: [0, 1, 2, 3],
    nodes: [
      { x: 0 * TILE_SIZE + TILE_SIZE / 2, y: 3 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 1 * TILE_SIZE + TILE_SIZE / 2, y: 3 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 2 * TILE_SIZE + TILE_SIZE / 2, y: 3 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 3 * TILE_SIZE + TILE_SIZE / 2, y: 3 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 3 * TILE_SIZE + TILE_SIZE / 2, y: 2 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 3 * TILE_SIZE + TILE_SIZE / 2, y: 1 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 3 * TILE_SIZE + TILE_SIZE / 2, y: 0 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 4 * TILE_SIZE + TILE_SIZE / 2, y: 0 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 5 * TILE_SIZE + TILE_SIZE / 2, y: 0 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 6 * TILE_SIZE + TILE_SIZE / 2, y: 0 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 7 * TILE_SIZE + TILE_SIZE / 2, y: 0 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 7 * TILE_SIZE + TILE_SIZE / 2, y: 1 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 7 * TILE_SIZE + TILE_SIZE / 2, y: 2 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 7 * TILE_SIZE + TILE_SIZE / 2, y: 3 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 7 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 7 * TILE_SIZE + TILE_SIZE / 2, y: 5 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 7 * TILE_SIZE + TILE_SIZE / 2, y: 6 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 7 * TILE_SIZE + TILE_SIZE / 2, y: 7 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 8 * TILE_SIZE + TILE_SIZE / 2, y: 7 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 9 * TILE_SIZE + TILE_SIZE / 2, y: 7 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 10 * TILE_SIZE + TILE_SIZE / 2, y: 7 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 11 * TILE_SIZE + TILE_SIZE / 2, y: 7 * TILE_SIZE + TILE_SIZE / 2 }
    ]
  },
  // Path 2: 底部路径 - 长路径，低难度
  {
    id: 2,
    name: 'Bottom Road',
    difficulty: 1,
    color: '#B9F6CA',  // 绿色 - 低难度
    enemyTypes: [0, 1, 2, 3],
    nodes: [
      { x: 0 * TILE_SIZE + TILE_SIZE / 2, y: 7 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 1 * TILE_SIZE + TILE_SIZE / 2, y: 7 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 2 * TILE_SIZE + TILE_SIZE / 2, y: 7 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 2 * TILE_SIZE + TILE_SIZE / 2, y: 6 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 2 * TILE_SIZE + TILE_SIZE / 2, y: 5 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 2 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 3 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 4 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 5 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 6 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 7 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 8 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 9 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 10 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 11 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 11 * TILE_SIZE + TILE_SIZE / 2, y: 5 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 11 * TILE_SIZE + TILE_SIZE / 2, y: 6 * TILE_SIZE + TILE_SIZE / 2 },
      { x: 11 * TILE_SIZE + TILE_SIZE / 2, y: 7 * TILE_SIZE + TILE_SIZE / 2 }
    ]
  }
];

/**
 * 获取所有路径的入口点 / Get all path entry points
 */
export function getPathEntries(): Position[] {
  return PATHS.map(p => p.nodes[0]);
}

/**
 * 获取所有路径的出口点 / Get all path exit points
 */
export function getPathExits(): Position[] {
  return PATHS.map(p => p.nodes[p.nodes.length - 1]);
}

/**
 * 根据难度获取可用路径 / Get available paths by difficulty
 * @param difficulty - 难度等级 (1-3)
 */
export function getPathsByDifficulty(difficulty: number): Path[] {
  return PATHS.filter(p => p.difficulty <= difficulty);
}

/** 
 * ============================================
 * WAVE CONFIGURATION / 波次配置
 * ============================================
 */

/** 基础波次数据（未缩放）/ Base wave definitions (unscaled) */
export const BASE_WAVES: WaveData[][] = [
  [{ type: 0, count: 3 }],                                          // Wave 1: 3 Cucumbers
  [{ type: 0, count: 5 }],                                          // Wave 2: 5 Cucumbers
  [{ type: 0, count: 6 }, { type: 1, count: 1 }],                   // Wave 3: 6 Cucumbers + 1 Vacuum
  [{ type: 0, count: 5 }, { type: 1, count: 2 }],                    // Wave 4: 5 Cucumbers + 2 Vacuums
  [{ type: 0, count: 6 }, { type: 1, count: 2 }, { type: 2, count: 2 }], // Wave 5: + Mosquitos
  [{ type: 0, count: 5 }, { type: 1, count: 3 }, { type: 2, count: 3 }],  // Wave 6
  [{ type: 0, count: 8 }, { type: 1, count: 3 }, { type: 2, count: 4 }],  // Wave 7
  [{ type: 1, count: 6 }, { type: 2, count: 4 }],                    // Wave 8
  [{ type: 0, count: 8 }, { type: 1, count: 5 }, { type: 2, count: 5 }],  // Wave 9
  [{ type: 0, count: 6 }, { type: 1, count: 4 }, { type: 2, count: 4 }, { type: 3, count: 2 }], // Wave 10: + Rats
  [{ type: 0, count: 8 }, { type: 1, count: 5 }, { type: 2, count: 5 }, { type: 3, count: 3 }],  // Wave 11
  [{ type: 1, count: 8 }, { type: 2, count: 6 }, { type: 3, count: 4 }],   // Wave 12
  [{ type: 0, count: 10 }, { type: 1, count: 6 }, { type: 2, count: 6 }, { type: 3, count: 4 }],  // Wave 13
  [{ type: 0, count: 12 }, { type: 1, count: 8 }, { type: 2, count: 8 }, { type: 3, count: 5 }],  // Wave 14
  [{ type: 0, count: 15 }, { type: 1, count: 10 }, { type: 2, count: 10 }, { type: 3, count: 6 }] // Wave 15: Final
];

/** Level 1 波次数据（未缩放）/ Level 1 wave data (unscaled) */
export const LEVEL1_WAVE: WaveData[] = [{ type: 0, count: 3 }];

/**
 * 每波敌人数量缩放系数 / Enemy count scaling per wave
 * 每波增加 15% 敌人数量 / +15% enemies each wave
 */
export const WAVE_SCALE_FACTOR = 0.15;

/**
 * 生成缩放后的波次数据 / Generate scaled wave data
 * @param waveNum - 波次号 (1-15) / Wave number (1-15)
 * @returns 缩放后的波次数据 / Scaled wave data
 */
export function getWaveData(waveNum: number): WaveData[] {
  const baseWave = BASE_WAVES[waveNum - 1];
  const scale = 1 + (waveNum - 1) * WAVE_SCALE_FACTOR;
  
  return baseWave.map(group => ({
    type: group.type,
    count: Math.ceil(group.count * scale)
  }));
}

/** 预生成的 15 波数据 / Pre-generated 15 waves */
export const WAVES: WaveData[][] = Array.from({ length: TOTAL_WAVES }, (_, i) => getWaveData(i + 1));

/** 
 * ============================================
 * TILE TYPES / 格子类型
 * ============================================
 */

export const TILE = {
  EMPTY: 0,       // 可建造 / Buildable
  PATH: 1,        // 敌人路径 / Enemy path
  BOX: 2,         // 纸箱障碍 / Box obstacle
  BASE: 3,        // 终点/金枪鱼罐头 / Base/Tuna can
  TOWER: 4        // 已建防御塔 / Built tower
} as const;

/**
 * 格子类型 / Tile types
 * 0 = 空地（可建造）
 * 1 = 路径
 * 2 = 纸箱
 * 3 = 终点基地
 * 4 = 防御塔
 */
export type TileType = typeof TILE.EMPTY | typeof TILE.PATH | typeof TILE.BOX | typeof TILE.BASE | typeof TILE.TOWER;