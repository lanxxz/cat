/**
 * Game Renderer Index / 游戏渲染器索引
 * 
 * Central export file for all renderer modules.
 * 所有渲染器模块的集中导出文件。
 * 
 * Rendering order (painter's algorithm):
 * 渲染顺序（画家算法）:
 * 1. Map background / 地图背景
 * 2. Path / 路径
 * 3. Boxes / 纸箱
 * 4. Towers / 防御塔
 * 5. Enemies / 敌人
 * 6. Projectiles / 投射物
 * 7. Base (tuna can) / 基地（金枪鱼罐头）
 * 8. Particles / 粒子
 * 9. Hover preview / 悬停预览
 */

import { renderMap, renderPath, renderBoxes } from './renderMap';
import { renderTowers } from './renderTower';
import { renderEnemies } from './renderEnemy';
import { renderProjectiles } from './renderProjectile';
import { renderBase, renderParticles } from './renderEffects';
import { renderHoverPreview } from './renderHover';
import type { Tower, Enemy, Projectile, Particle, Box } from '../types';

/**
 * 完整渲染函数 / Complete render function
 * Renders all game elements in correct order
 * 按正确顺序渲染所有游戏元素
 */
export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: {
    map: number[][];
    path: { x: number; y: number }[];
    boxes: Box[];
    towers: Tower[];
    enemies: Enemy[];
    projectiles: Projectile[];
    particles: Particle[];
  },
  hoverTile: { x: number; y: number },
  selectedTowerType: number,
  gold: number
): void {
  // 1. 地图 / Map
  renderMap(ctx, state.map);
  
  // 2. 路径 / Path
  renderPath(ctx, state.path);
  
  // 3. 纸箱 / Boxes
  renderBoxes(ctx, state.boxes);
  
  // 4. 防御塔 / Towers
  renderTowers(ctx, state.towers);
  
  // 5. 敌人 / Enemies
  renderEnemies(ctx, state.enemies);
  
  // 6. 投射物 / Projectiles
  renderProjectiles(ctx, state.projectiles);
  
  // 7. 基地 / Base
  renderBase(ctx, state.path);
  
  // 8. 粒子 / Particles
  renderParticles(ctx, state.particles);
  
  // 9. 悬停预览 / Hover preview
  renderHoverPreview(ctx, hoverTile, selectedTowerType, state.map, gold);
}

export default renderGame;