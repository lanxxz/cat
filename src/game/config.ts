/**
 * Game Configuration Types / 游戏配置类型
 * 
 * Legacy export file - maintained for backward compatibility.
 * 遗留导出文件 - 为保持向后兼容性。
 * 
 * @deprecated Use constants.ts and types.ts instead
 */

export type { GameState, Language, Tower, Enemy, Projectile, Particle, Box, Position, WaveData, GameStateRef, Level, TutorialStep } from './types';

export {
  TILE_SIZE,
  GRID_WIDTH,
  GRID_HEIGHT,
  TOWER_TYPES,
  ENEMY_TYPES,
  PATH_COORDS,
  BASE_WAVES,
  WAVES,
  getWaveData,
  TILE,
  TOTAL_WAVES,
  INITIAL_GOLD,
  INITIAL_LIVES,
  BOX_COUNT,
  BOX_GOLD_REWARD,
  BOX_SCORE_REWARD,
  WAVE_SPEED_BONUS,
  LEAK_SPEED_BONUS,
  TOWER_SPEED_BONUS,
  MOSQUITO_SPEED_BONUS,
  RAT_SPEED_BONUS,
  TOWER_REWARD_BONUS,
  WAVE_SCALE_FACTOR,
  SPEED_SCORE_MULTIPLIER,
  KILL_SCORE_MULTIPLIER,
  ENEMY_SPAWN_INTERVAL,
  LEVEL1_ENEMY_COUNT,
  LEVEL1_WAVE,
  TUTORIAL_TRANSITION_DELAY,
  LEVEL_ANNOUNCEMENT_DURATION
} from './constants';

export type { TowerTypeConfig, EnemyTypeConfig } from './constants';
export type { TileType } from './constants';