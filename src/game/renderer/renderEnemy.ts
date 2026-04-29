/**
 * Enemy Renderer / 敌人渲染器
 * 
 * Renders all 4 enemy types with animal-island-ui inspired palette.
 * 渲染所有 4 种敌人，采用动物森友会风格的温暖配色。
 * 
 * Design principles / 设计原则:
 * - Softer, warmer colors — no harsh neons
 * - Warm brown outlines instead of pure black
 * - Amber LED glow instead of green (vacuum)
 * - Earthy greens and warm grey-browns
 * - 更柔和温暖的色调——拒绝刺眼霓虹
 * - 暖棕描边替代纯黑
 * - 琥珀色 LED 替代绿色（吸尘器）
 * - 大地的绿色和暖灰褐色
 */

import type { Enemy } from '../types';

// ============================================
// DESIGN TOKENS / 设计 token
// ============================================

// Cucumber (type 0) / 黄瓜 — 柔和大地绿
const CUCUMBER_SKIN    = '#9CCC65';  // 柔和黄瓜绿 / Soft cucumber green
const CUCUMBER_STRIPE  = '#7CB342';  // 暖绿条纹 / Warm green stripes
const CUCUMBER_BROW    = '#6D4C41';  // 暖棕眉毛（替代绿色）/ Warm brown brows (instead of green)

// Vacuum (type 1) / 吸尘器 — 暖灰褐复古风
const VACUUM_BODY      = '#A49E96';  // 暖灰褐外壳 / Warm taupe body
const VACUUM_INNER      = '#8D8278';  // 深暖灰内圈 / Darker warm grey inner
const VACUUM_HANDLE     = '#6D5F55';  // 暖棕手柄 / Warm brown handle
const VACUUM_GRIP       = '#7D6F65';  // 暖棕握把 / Warm brown grip
const VACUUM_LED_ON     = '#FFD54F';  // 琥珀色 LED (替代绿色) / Amber LED
const VACUUM_LED_SHINE  = '#FFF5C2';  // 暖奶油 LED 高光 / Warm cream shine
const VACUUM_TEETH      = '#FEFAE0';  // 暖白牙齿 / Warm white teeth
const VACUUM_WHEEL      = '#4A4038';  // 深暖棕轮子 / Dark warm brown wheels

// Mosquito (type 2) / 蚊子 — 保持暗色但加暖调
const MOSQUITO_BODY     = '#3D3430';  // 暖暗棕身体 / Warm dark brown body
const MOSQUITO_WING     = 'rgba(200, 196, 188, 0.55)'; // 暖灰半透明翅膀 / Warm semi-transparent wings
const MOSQUITO_EYE      = '#D9584A';  // 柔和红眼 / Softer red eyes
const MOSQUITO_LEG      = '#3D3430';  // 暖暗棕腿 / Warm dark legs
const MOSQUITO_BEAK     = '#2D241D';  // 深暖棕喙 / Dark warm beak

// Rat (type 3) / 老鼠 — 已经大地色，微调
const RAT_BODY          = '#9C8275';  // 暖棕身体 / Warm brown body
const RAT_BELLY         = '#B8A094';  // 浅暖棕肚皮 / Light warm brown belly
const RAT_HEAD          = '#9C8275';  // 暖棕头部 / Warm brown head
const RAT_EAR           = '#C8B6AC';  // 奶油棕耳朵 / Cream-brown ears
const RAT_EYE           = '#D9584A';  // 柔和红眼 / Softer red eyes
const RAT_NOSE          = '#F0C8A0';  // 暖蜜桃鼻 / Warm peach nose
const RAT_WHISKER       = '#6D4C41';  // 暖棕胡须 / Warm brown whiskers
const RAT_TAIL          = '#C8B6AC';  // 暖棕尾巴 / Warm brown tail
const RAT_FOOT          = '#6D4C41';  // 暖棕脚 / Warm brown feet

// Health bar / 血条
const HP_BG             = '#D4E8D4';  // 暖薄荷绿背景 / Warm mint background
const HP_FILL           = '#E06050';  // 柔和红色血量 / Softer red fill

/**
 * 渲染所有敌人 / Render all enemies
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
 * 渲染黄瓜 (柔和大地绿) / Render Cucumber — soft earthy green
 * 敌人类型 0 / Enemy type 0
 */
function renderCucumber(ctx: CanvasRenderingContext2D, enemy: Enemy, ey: number): void {
  const ex = enemy.x;
  
  // 身体 (黄瓜形状) / Body (cucumber shape)
  ctx.fillStyle = CUCUMBER_SKIN;
  ctx.beginPath();
  ctx.ellipse(ex, ey, 22, 14, 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  // 暖绿条纹 / Warm green stripes
  ctx.strokeStyle = CUCUMBER_STRIPE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(ex - 8, ey, 4, 10, -0.3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(ex + 8, ey, 4, 10, 0.3, 0, Math.PI * 2);
  ctx.stroke();
  
  // 眼白 / White of eyes — 暖白
  ctx.fillStyle = '#FEFAE0';
  ctx.beginPath();
  ctx.ellipse(ex - 6, ey - 4, 5, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(ex + 6, ey - 4, 5, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 瞳孔 (凶 diagonal) / Pupils — 暖棕
  ctx.fillStyle = CUCUMBER_BROW;
  ctx.beginPath();
  ctx.arc(ex - 5, ey - 3, 2, 0, Math.PI * 2);
  ctx.arc(ex + 7, ey - 3, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // 凶眉毛 — 暖棕（替代绿色）/ Angry eyebrows — warm brown
  ctx.strokeStyle = CUCUMBER_BROW;
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
 * 渲染吸尘器 (暖灰褐复古风格) / Render Vacuum — warm taupe vintage style
 * 敌人类型 1 / Enemy type 1
 */
function renderVacuum(ctx: CanvasRenderingContext2D, enemy: Enemy, ey: number): void {
  const ex = enemy.x;
  
  // 身体 (圆形吸尘器) / Body — warm taupe
  ctx.fillStyle = VACUUM_BODY;
  ctx.beginPath();
  ctx.arc(ex, ey, 24, 0, Math.PI * 2);
  ctx.fill();
  
  // 内圈 / Inner circle — darker warm grey
  ctx.fillStyle = VACUUM_INNER;
  ctx.beginPath();
  ctx.arc(ex, ey, 18, 0, Math.PI * 2);
  ctx.fill();
  
  // 手柄 / Handle — warm brown
  ctx.fillStyle = VACUUM_HANDLE;
  ctx.beginPath();
  ctx.roundRect(ex - 4, ey - 32, 8, 16, 3);
  ctx.fill();
  
  // 手柄顶部 (握把) / Handle top (grip)
  ctx.fillStyle = VACUUM_GRIP;
  ctx.beginPath();
  ctx.arc(ex, ey - 34, 6, 0, Math.PI * 2);
  ctx.fill();
  
  // 琥珀色 LED 眼睛 (替代绿色) / Amber LED eyes
  ctx.fillStyle = VACUUM_LED_ON;
  ctx.beginPath();
  ctx.arc(ex - 8, ey - 2, 5, 0, Math.PI * 2);
  ctx.arc(ex + 8, ey - 2, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // LED 高光 / LED shine — warm cream
  ctx.fillStyle = VACUUM_LED_SHINE;
  ctx.beginPath();
  ctx.arc(ex - 10, ey - 4, 2, 0, Math.PI * 2);
  ctx.arc(ex + 6, ey - 4, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // 机器人嘴巴 / Robot mouth
  ctx.fillStyle = VACUUM_HANDLE;
  ctx.beginPath();
  ctx.roundRect(ex - 6, ey + 6, 12, 6, 2);
  ctx.fill();
  
  // 牙齿 / Teeth — warm white
  ctx.fillStyle = VACUUM_TEETH;
  ctx.fillRect(ex - 4, ey + 8, 3, 3);
  ctx.fillRect(ex + 1, ey + 8, 3, 3);
  
  // 轮子 / Wheels — warm dark brown
  ctx.fillStyle = VACUUM_WHEEL;
  ctx.beginPath();
  ctx.arc(ex - 14, ey + 20, 5, 0, Math.PI * 2);
  ctx.arc(ex + 14, ey + 20, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // 血条 / Health bar
  renderHealthBar(ctx, ex, ey - 32, 40, 5, enemy.health / enemy.maxHealth);
}

/**
 * 渲染蚊子 (保持暗色 + 暖调) / Render Mosquito — dark with warm accents
 * 敌人类型 2 / Enemy type 2
 */
function renderMosquito(ctx: CanvasRenderingContext2D, enemy: Enemy, ey: number): void {
  const ex = enemy.x;
  
  // 身体 (暖暗棕椭圆) / Body — warm dark brown
  ctx.fillStyle = MOSQUITO_BODY;
  ctx.beginPath();
  ctx.ellipse(ex, ey, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 翅膀 (振翅, 暖灰半透明) / Wings — warm semi-transparent
  ctx.fillStyle = MOSQUITO_WING;
  const wingOffset = Math.sin(enemy.wobble * 3) * 5;
  ctx.beginPath();
  ctx.ellipse(ex - 8, ey - 8 + wingOffset, 10, 5, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(ex + 8, ey - 8 - wingOffset, 10, 5, 0.5, 0, Math.PI * 2);
  ctx.fill();
  
  // 眼睛 (柔和红) / Eyes — softer red
  ctx.fillStyle = MOSQUITO_EYE;
  ctx.beginPath();
  ctx.arc(ex - 5, ey - 2, 4, 0, Math.PI * 2);
  ctx.arc(ex + 5, ey - 2, 4, 0, Math.PI * 2);
  ctx.fill();
  
  // 眼神光 — 暖白 / Eye shine — warm white
  ctx.fillStyle = '#FEFAE0';
  ctx.beginPath();
  ctx.arc(ex - 6, ey - 3, 1.5, 0, Math.PI * 2);
  ctx.arc(ex + 4, ey - 3, 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  // 喙 (针) / Proboscis — dark warm
  ctx.strokeStyle = MOSQUITO_BEAK;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ex, ey + 6);
  ctx.lineTo(ex, ey + 14);
  ctx.stroke();
  
  // 腿 / Legs
  ctx.strokeStyle = MOSQUITO_LEG;
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
 * 渲染老鼠 (暖棕大地色) / Render Rat — warm earthy brown
 * 敌人类型 3 / Enemy type 3
 */
function renderRat(ctx: CanvasRenderingContext2D, enemy: Enemy, ey: number): void {
  const ex = enemy.x;
  
  // 身体 (长椭圆) / Body — warm brown
  ctx.fillStyle = RAT_BODY;
  ctx.beginPath();
  ctx.ellipse(ex, ey, 20, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 肚子 (较浅暖棕) / Belly — lighter warm brown
  ctx.fillStyle = RAT_BELLY;
  ctx.beginPath();
  ctx.ellipse(ex, ey + 3, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 头部 / Head — warm brown
  ctx.fillStyle = RAT_HEAD;
  ctx.beginPath();
  ctx.arc(ex - 18, ey - 2, 10, 0, Math.PI * 2);
  ctx.fill();
  
  // 耳朵 (圆) / Ears — cream-brown
  ctx.fillStyle = RAT_EAR;
  ctx.beginPath();
  ctx.arc(ex - 22, ey - 10, 5, 0, Math.PI * 2);
  ctx.arc(ex - 14, ey - 10, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // 眼睛 (柔和红) / Eyes — softer red
  ctx.fillStyle = RAT_EYE;
  ctx.beginPath();
  ctx.arc(ex - 20, ey - 3, 3, 0, Math.PI * 2);
  ctx.arc(ex - 16, ey - 3, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // 眼神光 — 暖白 / Eye shine — warm white
  ctx.fillStyle = '#FEFAE0';
  ctx.beginPath();
  ctx.arc(ex - 21, ey - 4, 1, 0, Math.PI * 2);
  ctx.arc(ex - 17, ey - 4, 1, 0, Math.PI * 2);
  ctx.fill();
  
  // 鼻子 — 暖蜜桃色 / Nose — warm peach
  ctx.fillStyle = RAT_NOSE;
  ctx.beginPath();
  ctx.arc(ex - 28, ey, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // 胡须 — 暖棕 / Whiskers — warm brown
  ctx.strokeStyle = RAT_WHISKER;
  ctx.lineWidth = 1;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(ex - 26, ey);
    ctx.lineTo(ex - 34, ey - 4 + i * 3);
    ctx.stroke();
  }
  
  // 尾巴 (长而卷曲) / Tail — warm brown
  ctx.strokeStyle = RAT_TAIL;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ex + 20, ey);
  ctx.quadraticCurveTo(ex + 30, ey - 5, ex + 35, ey + 5);
  ctx.quadraticCurveTo(ex + 40, ey + 15, ex + 32, ey + 10);
  ctx.stroke();
  
  // 脚 / Feet — warm dark brown
  ctx.fillStyle = RAT_FOOT;
  ctx.beginPath();
  ctx.ellipse(ex - 8, ey + 12, 4, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(ex + 8, ey + 12, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 血条 / Health bar
  renderHealthBar(ctx, ex, ey - 22, 32, 5, enemy.health / enemy.maxHealth);
}

/**
 * 渲染血条 (暖色版) / Render Health Bar — warm version
 * @param ctx - Canvas context
 * @param x - Center X position
 * @param y - Y position
 * @param width - Bar width
 * @param height - Bar height
 * @param healthPercent - Health percentage (0-1)
 */
function renderHealthBar(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, healthPercent: number): void {
  // 暖薄荷绿背景 / Warm mint background
  ctx.fillStyle = HP_BG;
  ctx.fillRect(x - width / 2, y, width, height);
  
  // 柔和红色血量 / Softer red for health
  ctx.fillStyle = HP_FILL;
  ctx.fillRect(x - width / 2, y, width * healthPercent, height);
}

export default {
  renderEnemies
};
