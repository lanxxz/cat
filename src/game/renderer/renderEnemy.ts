/**
 * Enemy Renderer / 敌人渲染器
 * 
 * Renders all 4 enemy types with detailed hand-drawn kawaii style.
 * 渲染所有 4 种敌人，采用精美的手绘卡哇伊风格。
 */

import type { Enemy } from '../types';

/**
 * 渲染所有敌人 / Render all enemies
 * @param ctx - Canvas context
 * @param enemies - Array of enemy objects / 敌人数组
 */
export function renderEnemies(ctx: CanvasRenderingContext2D, enemies: Enemy[]): void {
  for (const enemy of enemies) {
    // 添加摆动动画 / Add wobble animation
    const enemyY = enemy.y + Math.sin(enemy.wobble) * 2;
    renderEnemy(ctx, enemy, enemyY);
  }
}

/**
 * 渲染单个敌人 / Render single enemy
 * @param ctx - Canvas context
 * @param enemy - Enemy object / 敌人对象
 * @param enemyY - Y position with wobble / 带摆动的 Y 坐标
 */
function renderEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy, enemyY: number): void {
  if (enemy.type === 0) {
    renderCucumber(ctx, enemy, enemyY);
  } else if (enemy.type === 1) {
    renderVacuum(ctx, enemy, enemyY);
  } else if (enemy.type === 2) {
    renderMosquito(ctx, enemy, enemyY);
  } else {
    renderRat(ctx, enemy, enemyY);
  }
}

/**
 * 渲染黄瓜 / Render Cucumber (cute green veggie)
 * 敌人类型 0 / Enemy type 0
 */
function renderCucumber(ctx: CanvasRenderingContext2D, enemy: Enemy, ey: number): void {
  const ex = enemy.x;
  
  // 身体 (黄瓜形状) / Body (cucumber shape)
  ctx.fillStyle = '#8BC34A'; // 浅绿色
  ctx.beginPath();
  ctx.ellipse(ex, ey, 22, 14, 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  // 深色条纹 / Darker stripes
  ctx.strokeStyle = '#689F38';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(ex - 8, ey, 4, 10, -0.3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(ex + 8, ey, 4, 10, 0.3, 0, Math.PI * 2);
  ctx.stroke();
  
  // 可爱脸 (凶但卡哇伊) / Cute face (angry but kawaii)
  // 眼白 / White of eyes
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.ellipse(ex - 6, ey - 4, 5, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(ex + 6, ey - 4, 5, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 瞳孔 (凶 diagonal) / Pupils (angry diagonal)
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(ex - 5, ey - 3, 2, 0, Math.PI * 2);
  ctx.arc(ex + 7, ey - 3, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // 凶眉毛 / Angry eyebrows
  ctx.strokeStyle = '#689F38';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ex - 10, ey - 10);
  ctx.lineTo(ex - 3, ey - 8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ex + 10, ey - 10);
  ctx.lineTo(ex + 3, ey - 8);
  ctx.stroke();
  
  // 小嘴巴 / Small mouth
  ctx.beginPath();
  ctx.arc(ex, ey + 4, 3, Math.PI, 0);
  ctx.stroke();
  
  // 血条 / Health bar
  renderHealthBar(ctx, ex, ey - 24, 36, 5, enemy.health / enemy.maxHealth);
}

/**
 * 渲染吸尘器 / Render Vacuum (cute household appliance)
 * 敌人类型 1 / Enemy type 1
 */
function renderVacuum(ctx: CanvasRenderingContext2D, enemy: Enemy, ey: number): void {
  const ex = enemy.x;
  
  // 身体 (圆形吸尘器) / Body (round vacuum)
  ctx.fillStyle = '#90A4AE'; // 灰色
  ctx.beginPath();
  ctx.arc(ex, ey, 24, 0, Math.PI * 2);
  ctx.fill();
  
  // 内圈 / Inner circle
  ctx.fillStyle = '#78909C';
  ctx.beginPath();
  ctx.arc(ex, ey, 18, 0, Math.PI * 2);
  ctx.fill();
  
  // 手柄 / Handle
  ctx.fillStyle = '#546E7A';
  ctx.beginPath();
  ctx.roundRect(ex - 4, ey - 32, 8, 16, 3);
  ctx.fill();
  
  // 手柄顶部 (握把) / Handle top (grip)
  ctx.beginPath();
  ctx.arc(ex, ey - 34, 6, 0, Math.PI * 2);
  ctx.fill();
  
  // LED 眼睛 (可爱机器人眼) / LED eyes (cute robot eyes)
  ctx.fillStyle = '#00E676'; // 绿色 LED
  ctx.beginPath();
  ctx.arc(ex - 8, ey - 2, 5, 0, Math.PI * 2);
  ctx.arc(ex + 8, ey - 2, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // LED 闪烁 / LED shine
  ctx.fillStyle = '#B9F6CA';
  ctx.beginPath();
  ctx.arc(ex - 10, ey - 4, 2, 0, Math.PI * 2);
  ctx.arc(ex + 6, ey - 4, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // 机器人嘴巴 / Robot mouth
  ctx.fillStyle = '#546E7A';
  ctx.beginPath();
  ctx.roundRect(ex - 6, ey + 6, 12, 6, 2);
  ctx.fill();
  
  // 牙齿 / Teeth
  ctx.fillStyle = '#FFF';
  ctx.fillRect(ex - 4, ey + 8, 3, 3);
  ctx.fillRect(ex + 1, ey + 8, 3, 3);
  
  // 轮子 / Wheels
  ctx.fillStyle = '#37474F';
  ctx.beginPath();
  ctx.arc(ex - 14, ey + 20, 5, 0, Math.PI * 2);
  ctx.arc(ex + 14, ey + 20, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // 血条 / Health bar
  renderHealthBar(ctx, ex, ey - 32, 40, 5, enemy.health / enemy.maxHealth);
}

/**
 * 渲染蚊子 / Render Mosquito (fast and annoying)
 * 敌人类型 2 / Enemy type 2
 */
function renderMosquito(ctx: CanvasRenderingContext2D, enemy: Enemy, ey: number): void {
  const ex = enemy.x;
  
  // 身体 (小黑椭圆) / Body (small dark oval)
  ctx.fillStyle = '#37474F';
  ctx.beginPath();
  ctx.ellipse(ex, ey, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 翅膀 (振翅) / Wings (fluttering)
  ctx.fillStyle = 'rgba(200, 200, 200, 0.6)';
  const wingOffset = Math.sin(enemy.wobble * 3) * 5;
  ctx.beginPath();
  ctx.ellipse(ex - 8, ey - 8 + wingOffset, 10, 5, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(ex + 8, ey - 8 - wingOffset, 10, 5, 0.5, 0, Math.PI * 2);
  ctx.fill();
  
  // 眼睛 (大红) / Eyes (big red)
  ctx.fillStyle = '#F44336';
  ctx.beginPath();
  ctx.arc(ex - 5, ey - 2, 4, 0, Math.PI * 2);
  ctx.arc(ex + 5, ey - 2, 4, 0, Math.PI * 2);
  ctx.fill();
  
  // 眼神光 / Eye shine
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(ex - 6, ey - 3, 1.5, 0, Math.PI * 2);
  ctx.arc(ex + 4, ey - 3, 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  // 喙 (针) / Proboscis (needle)
  ctx.strokeStyle = '#212121';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ex, ey + 6);
  ctx.lineTo(ex, ey + 14);
  ctx.stroke();
  
  // 腿 / Legs
  ctx.strokeStyle = '#37474F';
  ctx.lineWidth = 1;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(ex - 6, ey + 4);
    ctx.lineTo(ex - 12, ey + 8 + i * 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ex + 6, ey + 4);
    ctx.lineTo(ex + 12, ey + 8 + i * 4);
    ctx.stroke();
  }
  
  // 血条 / Health bar
  renderHealthBar(ctx, ex, ey - 16, 24, 4, enemy.health / enemy.maxHealth);
}

/**
 * 渲染老鼠 / Render Rat (slow but tough)
 * 敌人类型 3 / Enemy type 3
 */
function renderRat(ctx: CanvasRenderingContext2D, enemy: Enemy, ey: number): void {
  const ex = enemy.x;
  
  // 身体 (长椭圆) / Body (elongated oval)
  ctx.fillStyle = '#8D6E63';
  ctx.beginPath();
  ctx.ellipse(ex, ey, 20, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 肚子 (较浅) / Belly (lighter)
  ctx.fillStyle = '#A1887F';
  ctx.beginPath();
  ctx.ellipse(ex, ey + 3, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 头部 / Head
  ctx.fillStyle = '#8D6E63';
  ctx.beginPath();
  ctx.arc(ex - 18, ey - 2, 10, 0, Math.PI * 2);
  ctx.fill();
  
  // 耳朵 (圆) / Ears (round)
  ctx.fillStyle = '#BCAAA4';
  ctx.beginPath();
  ctx.arc(ex - 22, ey - 10, 5, 0, Math.PI * 2);
  ctx.arc(ex - 14, ey - 10, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // 眼睛 (小红, 狡猾) / Eyes (small red, sneaky)
  ctx.fillStyle = '#F44336';
  ctx.beginPath();
  ctx.arc(ex - 20, ey - 3, 3, 0, Math.PI * 2);
  ctx.arc(ex - 16, ey - 3, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // 眼神光 / Eye shine
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(ex - 21, ey - 4, 1, 0, Math.PI * 2);
  ctx.arc(ex - 17, ey - 4, 1, 0, Math.PI * 2);
  ctx.fill();
  
  // 鼻子 / Nose
  ctx.fillStyle = '#FFAB91';
  ctx.beginPath();
  ctx.arc(ex - 28, ey, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // 胡须 / Whiskers
  ctx.strokeStyle = '#5D4037';
  ctx.lineWidth = 1;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(ex - 26, ey);
    ctx.lineTo(ex - 34, ey - 4 + i * 3);
    ctx.stroke();
  }
  
  // 尾巴 (长而卷曲) / Tail (long and curly)
  ctx.strokeStyle = '#BCAAA4';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ex + 20, ey);
  ctx.quadraticCurveTo(ex + 30, ey - 5, ex + 35, ey + 5);
  ctx.quadraticCurveTo(ex + 40, ey + 15, ex + 32, ey + 10);
  ctx.stroke();
  
  // 脚 / Feet
  ctx.fillStyle = '#5D4037';
  ctx.beginPath();
  ctx.ellipse(ex - 8, ey + 12, 4, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(ex + 8, ey + 12, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 血条 / Health bar
  renderHealthBar(ctx, ex, ey - 22, 32, 5, enemy.health / enemy.maxHealth);
}

/**
 * 渲染血条 / Render Health Bar
 * @param ctx - Canvas context
 * @param x - Center X position
 * @param y - Y position
 * @param width - Bar width
 * @param height - Bar height
 * @param healthPercent - Health percentage (0-1)
 */
function renderHealthBar(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, healthPercent: number): void {
  // 背景 / Background
  ctx.fillStyle = '#C8E6C9';
  ctx.fillRect(x - width / 2, y, width, height);
  
  // 血量 / Health
  ctx.fillStyle = '#EF5350';
  ctx.fillRect(x - width / 2, y, width * healthPercent, height);
}

export default {
  renderEnemies
};