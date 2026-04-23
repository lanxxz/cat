/**
 * Map Renderer / 地图渲染器
 * 
 * Renders game map tiles, path, and boxes.
 * 渲染游戏地图格子、路径和纸箱。
 */

import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, TILE } from '../constants';
import type { Box } from '../types';

/**
 * 渲染地图背景和格子 / Render map background and tiles
 * @param ctx - Canvas context
 * @param map - 2D array of tile types / 2D 格子类型数组
 */
export function renderMap(ctx: CanvasRenderingContext2D, map: number[][]): void {
  // 填充背景色 / Fill background
  ctx.fillStyle = '#FFF8E7';
  ctx.fillRect(0, 0, GRID_WIDTH * TILE_SIZE, GRID_HEIGHT * TILE_SIZE);
  
  // 渲染空地格子（棋盘格）/ Render empty tiles (checkerboard pattern)
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (map[y]?.[x] === TILE.EMPTY) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#FFF8E7' : '#FFF1E0';
        ctx.fillRect(x * TILE_SIZE + 2, y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      }
    }
  }
}

/**
 * 渲染敌人路径 / Render enemy path
 * @param ctx - Canvas context
 * @param path - Array of path positions / 路径位置数组
 */
export function renderPath(ctx: CanvasRenderingContext2D, path: { x: number; y: number }[]): void {
  if (path.length === 0) return;
  
  // 路径阴影 / Path shadow
  ctx.strokeStyle = '#FFE0B2';
  ctx.lineWidth = TILE_SIZE * 0.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let i = 0; i < path.length; i++) {
    if (i === 0) ctx.moveTo(path[i].x, path[i].y);
    else ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.stroke();
  
  // 路径虚线 / Path dashes
  ctx.strokeStyle = '#FFCC80';
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  for (let i = 0; i < path.length; i++) {
    if (i === 0) ctx.moveTo(path[i].x, path[i].y);
    else ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.stroke();
  ctx.setLineDash([]);
}

/**
 * 渲染纸箱障碍物 / Render box obstacles
 * @param ctx - Canvas context
 * @param boxes - Array of box positions / 纸箱位置数组
 */
export function renderBoxes(ctx: CanvasRenderingContext2D, boxes: Box[]): void {
  for (const box of boxes) {
    const x = box.x * TILE_SIZE;
    const y = box.y * TILE_SIZE;
    
    // 箱子主体 / Box body
    ctx.fillStyle = '#A1887F';
    ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 12);
    
    // 箱子顶部条纹 / Box top stripes
    ctx.fillStyle = '#BCAAA4';
    ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, 15);
    
    // 十字交叉 / Cross
    ctx.fillStyle = '#8D6E63';
    ctx.fillRect(x + TILE_SIZE / 2 - 3, y + 4, 6, TILE_SIZE - 12);
    ctx.fillRect(x + 4, y + TILE_SIZE / 2 - 3, TILE_SIZE - 8, 6);
    
    // 点击提示 / Click hint
    ctx.fillStyle = '#FFF';
    ctx.font = '12px Nunito';
    ctx.textAlign = 'center';
    ctx.fillText('🖱️', x + TILE_SIZE / 2, y + TILE_SIZE - 15);
  }
}

export default {
  renderMap,
  renderPath,
  renderBoxes
};