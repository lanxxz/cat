/**
 * Map System / 地图系统
 * 
 * 地图和路径的初始化
 * @module mapSystem
 */

import type { Box, Position, GameStateRef } from './types';
import { TILE, TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, PATH_COORDS, BOX_COUNT } from './constants';

/**
 * 创建初始地图 / Build initial map with path
 * @returns { map, path } - 网格地图和路径坐标
 */
export function buildInitialMap(): { map: number[][]; path: Position[] } {
  const map: number[][] = [];
  const path: Position[] = [];
  
  for (let y = 0; y < GRID_HEIGHT; y++) {
    map[y] = [];
    for (let x = 0; x < GRID_WIDTH; x++) map[y][x] = TILE.EMPTY;
  }
  
  for (const coord of PATH_COORDS) {
    if (coord.x >= 0 && coord.x < GRID_WIDTH && coord.y >= 0 && coord.y < GRID_HEIGHT) {
      map[coord.y][coord.x] = TILE.PATH;
      path.push({ 
        x: coord.x * TILE_SIZE + TILE_SIZE / 2, 
        y: coord.y * TILE_SIZE + TILE_SIZE / 2 
      });
    }
  }
  
  const lastPath = PATH_COORDS[PATH_COORDS.length - 1];
  map[lastPath.y][lastPath.x] = TILE.BASE;
  
  return { map, path };
}

/**
 * 生成纸箱障碍物 / Spawn box obstacles
 * @param map - Current map state
 * @returns Box[] - 纸箱位置数组
 */
export function spawnBoxes(map: number[][]): Box[] {
  const boxes: Box[] = [];
  for (let i = 0; i < BOX_COUNT; i++) {
    let boxX: number, boxY: number;
    do {
      boxX = Math.floor(Math.random() * GRID_WIDTH);
      boxY = Math.floor(Math.random() * GRID_HEIGHT);
    } while (map[boxY][boxX] !== TILE.EMPTY);
    
    map[boxY][boxX] = TILE.BOX;
    boxes.push({ x: boxX, y: boxY });
  }
  return boxes;
}

/**
 * 初始化游戏状态 / Initialize game stateref
 * @param map - 网格地图
 * @param path - 路径坐标
 * @param boxes - 纸箱数组
 * @returns GameStateRef - 游戏状态
 */
export function initGameState(map: number[][], path: Position[], boxes: Box[]): GameStateRef {
  return {
    map,
    path,
    towers: [],
    enemies: [],
    projectiles: [],
    particles: [],
    boxes,
    enemiesToSpawn: [],
    enemySpawnTimer: 0,
    waveInProgress: false,
    hoverTile: { x: -1, y: -1 },
    enemiesLeaked: 0
  };
}