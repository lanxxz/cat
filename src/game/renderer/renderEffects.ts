/**
 * Base & Particles Renderer / 基地与粒子渲染器
 * 
 * Renders the golden tuna can (base) and particle effects.
 * 渲染金枪鱼罐头（基地）和粒子效果。
 */

import type { Particle } from '../types';

/**
 * 渲染终点基地（金枪鱼罐头）/ Render base (golden tuna can)
 * @param ctx - Canvas context
 * @param path - Path array (used to find base position) / 路径数组（用于找到基地位置）
 */
export function renderBase(ctx: CanvasRenderingContext2D, path: { x: number; y: number }[]): void {
  if (path.length === 0) return;
  
  const base = path[path.length - 1];
  
  // 发光效果 / Glow effect
  const gradient = ctx.createRadialGradient(base.x, base.y, 10, base.x, base.y, 40);
  gradient.addColorStop(0, 'rgba(255, 215, 0, 0.5)');
  gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(base.x, base.y, 40, 0, Math.PI * 2);
  ctx.fill();
  
  // 金色主体 / Gold body
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.ellipse(base.x, base.y + 5, 25, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FFA000';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // 金色顶部 / Gold top
  ctx.fillStyle = '#FFC107';
  ctx.beginPath();
  ctx.ellipse(base.x, base.y, 25, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  // 文字 / Text
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 10px Nunito';
  ctx.textAlign = 'center';
  ctx.fillText('TUNA', base.x, base.y + 3);
  
  // 猫咪爪印 / Cat paw
  ctx.font = '12px sans-serif';
  ctx.fillText('🐾', base.x, base.y + 15);
}

/**
 * 渲染所有粒子 / Render all particles
 * @param ctx - Canvas context
 * @param particles - Array of particle objects / 粒子数组
 */
export function renderParticles(ctx: CanvasRenderingContext2D, particles: Particle[]): void {
  for (const p of particles) {
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export default {
  renderBase,
  renderParticles
};