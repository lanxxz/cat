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
 * 10. Tutorial highlights / 教程高亮
 */

import { renderMap, renderPath, renderBoxes } from './renderMap';
import { renderTowers } from './renderTower';
import { renderEnemies } from './renderEnemy';
import { renderProjectiles } from './renderProjectile';
import { renderBase, renderParticles } from './renderEffects';
import { renderHoverPreview } from './renderHover';
import { renderTutorialHighlights } from './tutorial';
import type { Tower, Enemy, Projectile, Particle, Box } from '../types';

/**
 * 完整渲染函数 / Complete render function
 * Renders all game elements in correct order
 * 按正确顺序渲染所有游戏元素
 */
import type { Position } from '../types';

export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: {
    map: number[][];
    path: Position[];
    paths: Position[][];
    pathIds: number[];
    boxes: Box[];
    towers: Tower[];
    enemies: Enemy[];
    projectiles: Projectile[];
    particles: Particle[];
  },
  hoverTile: { x: number; y: number },
  selectedTowerType: number,
  gold: number,
  tutorialStep: number = 0,
  _selectedTowerIndex: number | null = null  // 升级弹窗：选中的防御塔索引（渲染器暂未使用 / Not yet used by renderer）
): void {
  // 1. 地图 / Map
  renderMap(ctx, state.map);
  
  // 2. 路径 / Path (支持多路径)
  const allPaths = state.paths && state.paths.length > 0 ? state.paths : [state.path];
  renderPath(ctx, allPaths, state.pathIds);
  
  // 3. 纸箱 / Boxes
  renderBoxes(ctx, state.boxes);
  
  // 4. 防御塔 / Towers
  renderTowers(ctx, state.towers);
  
  // 5. 敌人 / Enemies
  renderEnemies(ctx, state.enemies);
  
  // 6. 投射物 / Projectiles
  renderProjectiles(ctx, state.projectiles);
  
  // 7. 基地 / Base
  const basePath = state.paths && state.paths[0] ? state.paths[0] : state.path;
  renderBase(ctx, basePath);
  
  // 8. 粒子 / Particles
  renderParticles(ctx, state.particles);
  
  // 9. 悬停预览 / Hover preview
  renderHoverPreview(ctx, hoverTile, selectedTowerType, state.map, gold);
  
  // 10. 教程高亮 / Tutorial highlights
  renderTutorialHighlights(ctx, { map: state.map, boxes: state.boxes }, tutorialStep);
}

export default renderGame;