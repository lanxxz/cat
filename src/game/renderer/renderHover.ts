/**
 * Hover Preview Renderer / 悬停预览渲染器
 * 
 * Renders tower placement preview when hovering over valid tiles.
 * 悬停在有效格子上时渲染防御塔放置预览。
 */

import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, TOWER_TYPES } from '../constants';
import type { Position } from '../types';

/**
 * 渲染防御塔放置预览 / Render tower placement preview
 * @param ctx - Canvas context
 * @param hoverTile - Currently hovered tile position / 当前悬停的格子位置
 * @param selectedTowerType - Selected tower type index / 选中的防御塔类型索引
 * @param map - Current map state / 当前地图状态
 * @param gold - Current gold amount / 当前金币数量
 */
export function renderHoverPreview(
  ctx: CanvasRenderingContext2D, 
  hoverTile: Position, 
  selectedTowerType: number,
  map: number[][],
  gold: number
): void {
  // 如果没有选中防御塔，不渲染 / Don't render if no tower selected
  if (selectedTowerType < 0) return;
  
  const h = hoverTile;
  
  // 检查是否在有效范围内 / Check if in valid range
  if (h.x >= 0 && h.x < GRID_WIDTH && h.y >= 0 && h.y < GRID_HEIGHT && map[h.y]?.[h.x] === 0) {
    const x = h.x * TILE_SIZE;
    const y = h.y * TILE_SIZE;
    const towerType = TOWER_TYPES[selectedTowerType];
    
    // 攻击范围圆圈 / Attack range circle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, towerType.range, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 放置预览框 / Placement preview box
    if (gold >= towerType.cost) {
      // 绿色 - 可建造 / Green - can build
      ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
    } else {
      // 红色 - 金币不足 / Red - not enough gold
      ctx.fillStyle = 'rgba(244, 67, 54, 0.3)';
    }
    ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
  }
}

export default {
  renderHoverPreview
};