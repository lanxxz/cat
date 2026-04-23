// Game Configuration Types

export type GameState = 'start' | 'playing' | 'gameover' | 'victory';
export type Language = 'zh' | 'en';

export const TILE_SIZE = 64;
export const GRID_WIDTH = 12;
export const GRID_HEIGHT = 8;

export interface TowerType {
  name: string;
  cost: number;
  damage: number;
  attackSpeed: number;
  range: number;
  color: string;
  projectileColor: string;
  type: 'single' | 'aoe';
  aoeRadius?: number;
}

export interface EnemyType {
  name: string;
  health: number;
  speed: number;
  reward: number;
  color: string;
  emoji: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Tile {
  type: 0 | 1 | 2 | 3 | 4;
}

export interface WaveData {
  type: number;
  count: number;
}

export const TOWER_TYPES: TowerType[] = [
  { name: 'Spitting Tabby', cost: 50, damage: 15, attackSpeed: 500, range: 100, color: '#FFA726', projectileColor: '#FFF8E1', type: 'single' },
  { name: 'Siamese Sniper', cost: 75, damage: 50, attackSpeed: 1500, range: 200, color: '#90A4AE', projectileColor: '#E91E63', type: 'single' },
  { name: 'Orange Bread Cat', cost: 100, damage: 25, attackSpeed: 1000, range: 120, color: '#FF8A65', projectileColor: '#D7CCC8', type: 'aoe', aoeRadius: 60 }
];

// 4 enemy types: Cucumber, Vacuum, Mosquito (wave 5+), Rat (wave 10+)
export const ENEMY_TYPES: EnemyType[] = [
  { name: 'Cucumber', health: 30, speed: 1, reward: 10, color: '#7CB342', emoji: '🥒' },
  { name: 'Vacuum', health: 100, speed: 0.5, reward: 25, color: '#607D8B', emoji: '🧹' },
  { name: 'Mosquito', health: 20, speed: 1.5, reward: 15, color: '#37474F', emoji: '🦟' },
  { name: 'Rat', health: 60, speed: 0.8, reward: 20, color: '#8D6E63', emoji: '🐀' }
];

// Predefined path coordinates
export const PATH_COORDS: Position[] = [
  {x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3},
  {x: 3, y: 2}, {x: 3, y: 1}, {x: 3, y: 0},
  {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0},
  {x: 7, y: 1}, {x: 7, y: 2}, {x: 7, y: 3}, {x: 7, y: 4},
  {x: 7, y: 5}, {x: 7, y: 6}, {x: 7, y: 7},
  {x: 8, y: 7}, {x: 9, y: 7}, {x: 10, y: 7}, {x: 11, y: 7}
];

// Base wave definitions (will be scaled by wave number)
export const BASE_WAVES: WaveData[][] = [
  [{type: 0, count: 3}],           // Wave 1: 3 Cucumbers
  [{type: 0, count: 5}],           // Wave 2: 5 Cucumbers
  [{type: 0, count: 6}, {type: 1, count: 1}],  // Wave 3: 6 Cucumbers + 1 Vacuum
  [{type: 0, count: 5}, {type: 1, count: 2}],   // Wave 4: 5 Cucumbers + 2 Vacuums
  [{type: 0, count: 6}, {type: 1, count: 2}, {type: 2, count: 2}],  // Wave 5: + Mosquitos
  [{type: 0, count: 5}, {type: 1, count: 3}, {type: 2, count: 3}],   // Wave 6
  [{type: 0, count: 8}, {type: 1, count: 3}, {type: 2, count: 4}],   // Wave 7
  [{type: 1, count: 6}, {type: 2, count: 4}],   // Wave 8
  [{type: 0, count: 8}, {type: 1, count: 5}, {type: 2, count: 5}],   // Wave 9
  [{type: 0, count: 6}, {type: 1, count: 4}, {type: 2, count: 4}, {type: 3, count: 2}],  // Wave 10: + Rats
  [{type: 0, count: 8}, {type: 1, count: 5}, {type: 2, count: 5}, {type: 3, count: 3}],   // Wave 11
  [{type: 1, count: 8}, {type: 2, count: 6}, {type: 3, count: 4}],   // Wave 12
  [{type: 0, count: 10}, {type: 1, count: 6}, {type: 2, count: 6}, {type: 3, count: 4}],   // Wave 13
  [{type: 0, count: 12}, {type: 1, count: 8}, {type: 2, count: 8}, {type: 3, count: 5}],   // Wave 14
  [{type: 0, count: 15}, {type: 1, count: 10}, {type: 2, count: 10}, {type: 3, count: 6}]  // Wave 15: Final
];

// Generate scaled waves (more enemies each wave)
export function getWaveData(waveNum: number): WaveData[] {
  const baseWave = BASE_WAVES[waveNum - 1];
  const scale = 1 + (waveNum - 1) * 0.15; // +15% enemies per wave
  
  return baseWave.map(group => ({
    type: group.type,
    count: Math.ceil(group.count * scale)
  }));
}

// Export all 15 waves
export const WAVES: WaveData[][] = Array.from({ length: 15 }, (_, i) => getWaveData(i + 1));