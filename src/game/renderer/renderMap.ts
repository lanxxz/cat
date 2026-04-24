/**
 * Map Renderer / 地图渲染器
 * 
 * Renders game map tiles, path, and boxes.
 * 支持多路径渲染。
 */

import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, TILE, PATHS } from '../constants';
import type { Box, Position } from '../types';

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
 * 渲染单条路径 / Render single path
 * @param ctx - Canvas context
 * @param path - 路径位置数组
 * @param color - 路径颜色
 * @param isPrimary - 是否为主要路径
 */
function renderSinglePath(ctx: CanvasRenderingContext2D, path: Position[], color: string, isPrimary: boolean = false): void {
  if (path.length === 0) return;
  
  const lineWidth = isPrimary ? TILE_SIZE * 0.6 : TILE_SIZE * 0.4;
  const shadowColor = isPrimary ? '#FFE0B2' : color + '40';
  
  // 路径阴影 / Path shadow
  ctx.strokeStyle = shadowColor;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let i = 0; i < path.length; i++) {
    if (i === 0) ctx.moveTo(path[i].x, path[i].y);
    else ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.stroke();
  
  // 路径实线 / Path solid line
  ctx.strokeStyle = color;
  ctx.lineWidth = isPrimary ? 4 : 2;
  ctx.setLineDash(isPrimary ? [10, 10] : [8, 8]);
  ctx.beginPath();
  for (let i = 0; i < path.length; i++) {
    if (i === 0) ctx.moveTo(path[i].x, path[i].y);
    else ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  
  // 绘制入口点标记 / Draw entry point marker
  const entry = path[0];
  ctx.beginPath();
  ctx.arc(entry.x, entry.y, 12, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.3;
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

/**
 * 渲染敌人路径（支持多路径）/ Render enemy paths (multi-path support)
 * @param ctx - Canvas context
 * @param paths - 路径数组（多路径）
 * @param pathIds - 路径ID数组
 */
export function renderPath(ctx: CanvasRenderingContext2D, paths: Position[][], _pathIds: number[] = []): void {
  // 渲染所有路径
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const config = PATHS[i];
    const color = config?.color || '#FFCC80';
    renderSinglePath(ctx, path, color, i === 0);  // 第一条路径为主路径
  }
  
  // 绘制路径难度图例 / Draw path difficulty legend
  drawPathLegend(ctx);
}

/**
 * 绘制路径难度图例 / Draw path difficulty legend
 */
function drawPathLegend(ctx: CanvasRenderingContext2D): void {
  const legendX = 10;
  const legendY = GRID_HEIGHT * TILE_SIZE - 25;
  
  ctx.font = '11px Nunito';
  ctx.textAlign = 'left';
  
  PATHS.forEach((path, index) => {
    const x = legendX + index * 80;
    
    // 颜色条
    ctx.fillStyle = path.color;
    ctx.fillRect(x, legendY, 10, 10);
    
    // 难度文字
    ctx.fillStyle = '#5D4037';
    const difficultyText = path.difficulty === 1 ? 'Easy' : path.difficulty === 2 ? 'Normal' : 'Hard';
    ctx.fillText(difficultyText, x + 14, legendY + 9);
  });
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