/**
 * Map System / 地图系统
 * 
 * 地图和路径的初始化 - 支持多路径系统
 * @module mapSystem
 */

import type { Box, Position, GameStateRef } from './types';
import { TILE, TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, PATH_COORDS, BOX_COUNT, PATHS } from './constants';

/**
 * 创建初始地图 / Build initial map with path
 * @returns { map, path, paths, pathIds } - 网格地图、默认路径、多路径数组、路径ID数组
 */
export function buildInitialMap(): { map: number[][]; path: Position[]; paths: Position[][]; pathIds: number[] } {
  const map: number[][] = [];
  const path: Position[] = [];
  const paths: Position[][] = [];
  const pathIds: number[] = [];
  
  for (let y = 0; y < GRID_HEIGHT; y++) {
    map[y] = [];
    for (let x = 0; x < GRID_WIDTH; x++) map[y][x] = TILE.EMPTY;
  }
  
  // 标记单路径（向后兼容）
  for (const coord of PATH_COORDS) {
    if (coord.x >= 0 && coord.x < GRID_WIDTH && coord.y >= 0 && coord.y < GRID_HEIGHT) {
      map[coord.y][coord.x] = TILE.PATH;
      path.push({ 
        x: coord.x * TILE_SIZE + TILE_SIZE / 2, 
        y: coord.y * TILE_SIZE + TILE_SIZE / 2 
      });
    }
  }

  // 标记多路径
  for (const pathConfig of PATHS) {
    paths.push(pathConfig.nodes);
    pathIds.push(pathConfig.id);
    for (const node of pathConfig.nodes) {
      const gridX = Math.floor(node.x / TILE_SIZE);
      const gridY = Math.floor(node.y / TILE_SIZE);
      if (gridX >= 0 && gridX < GRID_WIDTH && gridY >= 0 && gridY < GRID_HEIGHT) {
        // 不覆盖已有的非空格子（BOX、BASE、TOWER）
        if (map[gridY][gridX] === TILE.EMPTY) {
          map[gridY][gridX] = TILE.PATH;
        }
      }
    }
  }
  
  // 标记终点（使用第一条路径的终点）
  const lastPath = PATHS[0].nodes[PATHS[0].nodes.length - 1];
  const endGridX = Math.floor(lastPath.x / TILE_SIZE);
  const endGridY = Math.floor(lastPath.y / TILE_SIZE);
  map[endGridY][endGridX] = TILE.BASE;
  
  return { map, path, paths, pathIds };
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
 * 初始化游戏状态 / Initialize gamestate
 * @param map - 网格地图
 * @param path - 路径坐标
 * @param paths - 多路径数组
 * @param pathIds - 路径ID数组
 * @param boxes - 纸箱数组
 * @returns GameStateRef - 游戏状态
 */
export function initGameState(map: number[][], path: Position[], paths: Position[][], pathIds: number[], boxes: Box[]): GameStateRef {
  return {
    map,
    path,
    paths,
    pathIds,
    unlockedPaths: [2],  // 初始只解锁 Easy 路径 (id=2)
    pathUnlockNotifications: [],
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