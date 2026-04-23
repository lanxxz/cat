// Game Configuration Types

export type GameState = 'start' | 'playing' | 'gameover' | 'victory';

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
  type: 0 | 1 | 2 | 3 | 4; // 0=empty, 1=path, 2=box, 3=base, 4=tower
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

export const ENEMY_TYPES: EnemyType[] = [
  { name: 'Cucumber', health: 30, speed: 2, reward: 10, color: '#7CB342', emoji: '🥒' },
  { name: 'Vacuum', health: 100, speed: 1, reward: 25, color: '#607D8B', emoji: '🧹' }
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

// Wave definitions
export const WAVES: WaveData[][] = [
  [{type: 0, count: 5}],
  [{type: 0, count: 8}],
  [{type: 0, count: 10}, {type: 1, count: 2}],
  [{type: 0, count: 8}, {type: 1, count: 4}],
  [{type: 0, count: 12}, {type: 1, count: 5}],
  [{type: 0, count: 10}, {type: 1, count: 8}],
  [{type: 0, count: 15}, {type: 1, count: 6}],
  [{type: 1, count: 10}],
  [{type: 0, count: 15}, {type: 1, count: 8}],
  [{type: 0, count: 12}, {type: 1, count: 12}],
  [{type: 0, count: 20}, {type: 1, count: 10}],
  [{type: 1, count: 15}],
  [{type: 0, count: 25}, {type: 1, count: 12}],
  [{type: 0, count: 20}, {type: 1, count: 18}],
  [{type: 0, count: 30}, {type: 1, count: 20}]
];