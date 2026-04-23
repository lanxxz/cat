/**
 * Tower Renderer / 防御塔渲染器
 * 
 * Renders all 3 tower types with detailed hand-drawn kawaii style.
 * 渲染所有 3 种防御塔，采用精美的手绘卡哇伊风格。
 */

import type { Tower } from '../types';

/**
 * 渲染所有防御塔 / Render all towers
 * @param ctx - Canvas context
 * @param towers - Array of tower objects / 防御塔数组
 */
export function renderTowers(ctx: CanvasRenderingContext2D, towers: Tower[]): void {
  for (const tower of towers) {
    renderTower(ctx, tower);
  }
}

/**
 * 渲染单个防御塔 / Render single tower
 * @param ctx - Canvas context
 * @param tower - Tower object / 防御塔对象
 */
function renderTower(ctx: CanvasRenderingContext2D, tower: Tower): void {
  const tx = tower.x;
  const ty = tower.y;
  
  // 阴影 / Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.ellipse(tx, ty + 22, 24, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 根据类型渲染不同猫咪 / Render different cats based on type
  if (tower.type === 0) {
    renderSpittingTabby(ctx, tx, ty);
  } else if (tower.type === 1) {
    renderSiameseSniper(ctx, tx, ty);
  } else {
    renderOrangeBreadCat(ctx, tx, ty);
  }
}

/**
 * 渲染随地吐痰的虎斑猫 / Render Spitting Tabby (orange tabby cat)
 * @param ctx - Canvas context
 * @param tx - X position
 * @param ty - Y position
 */
function renderSpittingTabby(ctx: CanvasRenderingContext2D, tx: number, ty: number): void {
  // 身体 (chibi 风格) / Body (chibi style)
  ctx.fillStyle = '#FF8C42'; // 橙色身体
  ctx.beginPath();
  ctx.ellipse(tx, ty + 10, 24, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 条纹 / Stripes
  ctx.strokeStyle = '#E65100';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(tx - 12, ty); ctx.lineTo(tx - 6, ty + 12);
  ctx.moveTo(tx + 12, ty); ctx.lineTo(tx + 6, ty + 12);
  ctx.moveTo(tx, ty - 4); ctx.lineTo(tx, ty + 10);
  ctx.stroke();
  
  // 头部 (圆形) / Head (round)
  ctx.fillStyle = '#FF8C42';
  ctx.beginPath();
  ctx.arc(tx, ty - 8, 20, 0, Math.PI * 2);
  ctx.fill();
  
  // 耳朵 (小三角形) / Ears (small triangles)
  ctx.fillStyle = '#FF8C42';
  ctx.beginPath();
  ctx.moveTo(tx - 14, ty - 20); ctx.lineTo(tx - 10, ty - 32); ctx.lineTo(tx - 4, ty - 22);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(tx + 14, ty - 20); ctx.lineTo(tx + 10, ty - 32); ctx.lineTo(tx + 4, ty - 22);
  ctx.fill();
  
  // 内耳 (粉色) / Inner ears (pink)
  ctx.fillStyle = '#FFAB91';
  ctx.beginPath();
  ctx.moveTo(tx - 12, ty - 22); ctx.lineTo(tx - 10, ty - 28); ctx.lineTo(tx - 6, ty - 22);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(tx + 12, ty - 22); ctx.lineTo(tx + 10, ty - 28); ctx.lineTo(tx + 6, ty - 22);
  ctx.fill();
  
  // 眼睛 (大而有神) / Eyes (big kawaii)
  ctx.fillStyle = '#4E342E';
  ctx.beginPath();
  ctx.ellipse(tx - 7, ty - 10, 4, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(tx + 7, ty - 10, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 眼神光 / Eye shine
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(tx - 8, ty - 12, 2, 0, Math.PI * 2);
  ctx.arc(tx + 6, ty - 12, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // 腮红 / Blush
  ctx.fillStyle = '#FFAB91';
  ctx.beginPath();
  ctx.ellipse(tx - 14, ty - 2, 5, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(tx + 14, ty - 2, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 鼻子 / Nose
  ctx.fillStyle = '#FF8A80';
  ctx.beginPath();
  ctx.arc(tx, ty - 4, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // 嘴巴 (微笑) / Mouth (small smile)
  ctx.strokeStyle = '#4E342E';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(tx, ty, 4, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();
}

/**
 * 渲染狙击手暹罗猫 / Render Siamese Sniper (grey cat with blue eyes)
 * @param ctx - Canvas context
 * @param tx - X position
 * @param ty - Y position
 */
function renderSiameseSniper(ctx: CanvasRenderingContext2D, tx: number, ty: number): void {
  // 身体 / Body
  ctx.fillStyle = '#B0BEC5';
  ctx.beginPath();
  ctx.ellipse(tx, ty + 10, 24, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 头部 / Head
  ctx.beginPath();
  ctx.arc(tx, ty - 8, 20, 0, Math.PI * 2);
  ctx.fill();
  
  // 尖耳朵 / Pointed ears
  ctx.fillStyle = '#B0BEC5';
  ctx.beginPath();
  ctx.moveTo(tx - 14, ty - 20); ctx.lineTo(tx - 8, ty - 34); ctx.lineTo(tx - 2, ty - 22);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(tx + 14, ty - 20); ctx.lineTo(tx + 8, ty - 34); ctx.lineTo(tx + 2, ty - 22);
  ctx.fill();
  
  // 内耳 / Inner ears
  ctx.fillStyle = '#FFE0B2';
  ctx.beginPath();
  ctx.moveTo(tx - 12, ty - 22); ctx.lineTo(tx - 8, ty - 30); ctx.lineTo(tx - 4, ty - 22);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(tx + 12, ty - 22); ctx.lineTo(tx + 8, ty - 30); ctx.lineTo(tx + 4, ty - 22);
  ctx.fill();
  
  // 蓝色眼睛 (狙击手眼神 - 严肃) / Blue eyes (sniper eyes - serious)
  ctx.fillStyle = '#1E88E5';
  ctx.beginPath();
  ctx.ellipse(tx - 7, ty - 10, 5, 6, 0, 0, Math.PI * 2);
  ctx.ellipse(tx + 7, ty - 10, 5, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 瞳孔 / Pupil
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(tx - 7, ty - 10, 2, 0, Math.PI * 2);
  ctx.arc(tx + 7, ty - 10, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // 眼神光 / Eye shine
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(tx - 9, ty - 12, 2, 0, Math.PI * 2);
  ctx.arc(tx + 5, ty - 12, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // 腮红 / Blush
  ctx.fillStyle = '#FFAB91';
  ctx.beginPath();
  ctx.ellipse(tx - 14, ty - 2, 5, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(tx + 14, ty - 2, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 三角形鼻子 / Triangle nose
  ctx.fillStyle = '#FF8A80';
  ctx.beginPath();
  ctx.moveTo(tx, ty - 3);
  ctx.lineTo(tx - 3, ty);
  ctx.lineTo(tx + 3, ty);
  ctx.fill();
  
  // 严肃嘴巴 / Serious mouth
  ctx.strokeStyle = '#4E342E';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(tx - 3, ty + 4);
  ctx.lineTo(tx, ty + 3);
  ctx.lineTo(tx + 3, ty + 4);
  ctx.stroke();
}

/**
 * 渲染胖橘猫 / Render Orange Bread Fat Cat (fat orange cat)
 * @param ctx - Canvas context
 * @param tx - X position
 * @param ty - Y position
 */
function renderOrangeBreadCat(ctx: CanvasRenderingContext2D, tx: number, ty: number): void {
  // 胖身体 (非常圆) / FAT body (really round)
  ctx.fillStyle = '#FF9800';
  ctx.beginPath();
  ctx.ellipse(tx, ty + 12, 28, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 肚子 (较浅) / Belly (lighter)
  ctx.fillStyle = '#FFB74D';
  ctx.beginPath();
  ctx.ellipse(tx, ty + 14, 18, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 头部 (也圆) / Head (also round)
  ctx.beginPath();
  ctx.arc(tx, ty - 6, 22, 0, Math.PI * 2);
  ctx.fill();
  
  // 小耳朵 (因为胖) / Tiny ears (due to being fat)
  ctx.beginPath();
  ctx.moveTo(tx - 12, ty - 20); ctx.lineTo(tx - 6, ty - 28); ctx.lineTo(tx, ty - 22);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(tx + 12, ty - 20); ctx.lineTo(tx + 6, ty - 28); ctx.lineTo(tx, ty - 22);
  ctx.fill();
  
  // 内耳 (粉色) / Inner ears (pink)
  ctx.fillStyle = '#FFAB91';
  ctx.beginPath();
  ctx.moveTo(tx - 10, ty - 22); ctx.lineTo(tx - 6, ty - 26); ctx.lineTo(tx - 2, ty - 22);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(tx + 10, ty - 22); ctx.lineTo(tx + 6, ty - 26); ctx.lineTo(tx + 2, ty - 22);
  ctx.fill();
  
  // 开心闭眼 ^_^ / Happy closed eyes ^_^
  ctx.strokeStyle = '#5D4037';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(tx - 8, ty - 8, 6, Math.PI, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(tx + 8, ty - 8, 6, Math.PI, 0);
  ctx.stroke();
  
  // 大腮红 / Big blush
  ctx.fillStyle = '#FFAB91';
  ctx.beginPath();
  ctx.ellipse(tx - 14, ty, 8, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(tx + 14, ty, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 开心鼻子 / Happy nose
  ctx.fillStyle = '#FF8A80';
  ctx.beginPath();
  ctx.arc(tx, ty, 4, 0, Math.PI * 2);
  ctx.fill();
  
  // 开心嘴巴 / Happy mouth
  ctx.strokeStyle = '#5D4037';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(tx, ty + 2, 6, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();
  
  // 爪子里拿着面包 / Bread in paw
  ctx.fillStyle = '#D7CCC8';
  ctx.beginPath();
  ctx.ellipse(tx + 18, ty + 12, 14, 10, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#8D6E63';
  ctx.lineWidth = 2;
  ctx.stroke();
}

export default {
  renderTowers
};