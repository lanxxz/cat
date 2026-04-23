/**
 * Projectile Renderer / 投射物渲染器
 * 
 * Renders projectiles (spit, laser, bread) fired by towers.
 * 渲染防御塔发射的投射物（口水、激光、面包）。
 */

import type { Projectile } from '../types';

/**
 * 渲染所有投射物 / Render all projectiles
 * @param ctx - Canvas context
 * @param projectiles - Array of projectile objects / 投射物数组
 */
export function renderProjectiles(ctx: CanvasRenderingContext2D, projectiles: Projectile[]): void {
  for (const proj of projectiles) {
    renderProjectile(ctx, proj);
  }
}

/**
 * 渲染单个投射物 / Render single projectile
 * @param ctx - Canvas context
 * @param proj - Projectile object / 投射物对象
 */
function renderProjectile(ctx: CanvasRenderingContext2D, proj: Projectile): void {
  ctx.save();
  ctx.translate(proj.x, proj.y);
  ctx.rotate(proj.angle);
  
  if (proj.type === 'aoe') {
    // 面包 (AOE 攻击) / Bread (AOE attack)
    ctx.fillStyle = '#D7CCC8';
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // 水滴/激光 (单发攻击) / Droplet/Laser (single attack)
    ctx.fillStyle = '#FFF8E1';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
}

export default {
  renderProjectiles
};