/**
 * Enemy Renderer / 敌人渲染器
 * 
 * Renders 4 enemy types in refined illustration style.
 * 以精致插画风格渲染 4 种敌人。
 * 
 * Design: picture-book illustration — detailed features,
 * warm earthy palette (animal-island), natural cute proportions.
 * 设计：绘本插画风 — 丰富细节、温暖大地色、自然可爱比例。
 */

import type { Enemy } from '../types';

// ── Shared / 共享 ──
const WARM_WHITE = '#FEFAE0';
const BROW_COLOR = '#6D4C41';

// Cucumber (type 0) / 黄瓜
const CU_SKIN   = '#9CCC65';
const CU_STRIPE = '#7CB342';
const CU_VINE   = '#558B2F';
const CU_LEAF   = '#8BC34A';

// Vacuum (type 1) / 吸尘器
const VC_BODY    = '#A49E96';
const VC_INNER   = '#8D8278';
const VC_HANDLE  = '#6D5F55';
const VC_GRIP    = '#7D6F65';
const VC_LED     = '#FFD54F';
const VC_LED_HL  = '#FFF5C2';
const VC_WHEEL   = '#4A4038';
const VC_BUTTON  = '#E06050';

// Mosquito (type 2) / 蚊子
const MQ_BODY    = '#3D3430';
const MQ_WING    = 'rgba(200,196,188,0.5)';
const MQ_VEIN    = 'rgba(180,176,168,0.4)';
const MQ_EYE     = '#D9584A';

// Rat (type 3) / 老鼠
const RT_BODY    = '#9C8275';
const RT_BELLY   = '#B8A094';
const RT_EAR_OUT = '#C8B6AC';
const RT_EAR_IN  = '#F0C8A0';
const RT_EYE     = '#D9584A';
const RT_NOSE    = '#F0C8A0';
const RT_TAIL    = '#C8B6AC';
const RT_FOOT    = '#6D4C41';
const RT_TOE     = '#F0C8A0';

// Health bar / 血条
const HP_BG   = '#D4E8D4';
const HP_FILL = '#E06050';

// ── Public / 公共 ──

export function renderEnemies(ctx: CanvasRenderingContext2D, enemies: Enemy[]): void {
  for (const e of enemies) {
    const ey = e.y + Math.sin(e.wobble) * 2;
    dispatchEnemy(ctx, e, ey);
  }
}

function dispatchEnemy(ctx: CanvasRenderingContext2D, e: Enemy, ey: number): void {
  switch (e.type) {
    case 0: drawCucumber(ctx, e, ey); break;
    case 1: drawVacuum(ctx, e, ey); break;
    case 2: drawMosquito(ctx, e, ey); break;
    case 3: drawRat(ctx, e, ey); break;
  }
}

// ═══════════════════════════════════════════
// CUCUMBER / 黄瓜 (vine+leaf, angry-cute)
// ═══════════════════════════════════════════

function drawCucumber(ctx: CanvasRenderingContext2D, e: Enemy, ey: number): void {
  const ex = e.x;

  // body
  ctx.fillStyle = CU_SKIN;
  ctx.beginPath(); ctx.ellipse(ex, ey, 22, 14, 0.2, 0, Math.PI * 2); ctx.fill();

  // lighter highlight
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath(); ctx.ellipse(ex - 4, ey - 4, 10, 6, 0.1, 0, Math.PI * 2); ctx.fill();

  // stripes
  ctx.strokeStyle = CU_STRIPE; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(ex - 8, ey, 4, 10, -0.3, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(ex + 8, ey, 4, 10, 0.3, 0, Math.PI * 2); ctx.stroke();

  // vine + leaf on top
  ctx.strokeStyle = CU_VINE; ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(ex - 2, ey - 14);
  ctx.quadraticCurveTo(ex - 8, ey - 22, ex - 12, ey - 18);
  ctx.stroke();
  // leaf
  ctx.fillStyle = CU_LEAF;
  ctx.beginPath(); ctx.ellipse(ex - 10, ey - 20, 5, 3.5, -0.4, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = CU_VINE; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(ex - 12, ey - 19); ctx.lineTo(ex - 8, ey - 21); ctx.stroke();

  // eyes (white base + iris + highlight)
  ctx.fillStyle = WARM_WHITE;
  ctx.beginPath(); ctx.ellipse(ex - 6, ey - 4, 5, 5.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(ex + 6, ey - 4, 5, 5.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3D2D1F';
  ctx.beginPath(); ctx.arc(ex - 5, ey - 3, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ex + 7, ey - 3, 2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = WARM_WHITE;
  ctx.beginPath(); ctx.arc(ex - 6, ey - 5, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ex + 6, ey - 5, 1.5, 0, Math.PI * 2); ctx.fill();

  // angry brows
  ctx.strokeStyle = BROW_COLOR; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(ex - 10, ey - 10); ctx.lineTo(ex - 3, ey - 8); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ex + 10, ey - 10); ctx.lineTo(ex + 3, ey - 8); ctx.stroke();

  // zigzag mouth + tooth
  ctx.fillStyle = WARM_WHITE;
  ctx.beginPath();
  ctx.moveTo(ex, ey + 3); ctx.lineTo(ex + 2, ey + 8); ctx.lineTo(ex, ey + 6); ctx.lineTo(ex - 2, ey + 8); ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = BROW_COLOR; ctx.lineWidth = 1.5;
  ctx.stroke();

  // tiny stubby legs
  ctx.fillStyle = CU_SKIN;
  ctx.beginPath(); ctx.ellipse(ex - 8, ey + 12, 3, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(ex + 8, ey + 12, 3, 3, 0, 0, Math.PI * 2); ctx.fill();

  // health bar
  renderHealthBar(ctx, ex, ey - 22, 36, 5, e.health / e.maxHealth);
}

// ═══════════════════════════════════════════
// VACUUM / 吸尘器 (vintage, amber LED)
// ═══════════════════════════════════════════

function drawVacuum(ctx: CanvasRenderingContext2D, e: Enemy, ey: number): void {
  const ex = e.x;

  // body disc
  ctx.fillStyle = VC_BODY;
  ctx.beginPath(); ctx.arc(ex, ey, 24, 0, Math.PI * 2); ctx.fill();
  // metallic rim
  ctx.strokeStyle = '#B8AEA5'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(ex, ey, 24, 0, Math.PI * 2); ctx.stroke();

  // inner circle
  ctx.fillStyle = VC_INNER;
  ctx.beginPath(); ctx.arc(ex, ey, 18, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#A49890'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(ex, ey, 18, 0, Math.PI * 2); ctx.stroke();

  // handle
  ctx.fillStyle = VC_HANDLE;
  ctx.beginPath(); ctx.roundRect(ex - 3.5, ey - 36, 7, 18, 3); ctx.fill();
  // grip
  ctx.fillStyle = VC_GRIP;
  ctx.beginPath(); ctx.arc(ex, ey - 38, 5, 0, Math.PI * 2); ctx.fill();

  // amber LED eyes
  ctx.fillStyle = VC_LED; ctx.shadowColor = VC_LED; ctx.shadowBlur = 4;
  ctx.beginPath(); ctx.arc(ex - 8, ey - 2, 5.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ex + 8, ey - 2, 5.5, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  // LED shine
  ctx.fillStyle = VC_LED_HL;
  ctx.beginPath(); ctx.arc(ex - 10, ey - 4, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ex + 6, ey - 4, 2, 0, Math.PI * 2); ctx.fill();

  // LED smile
  ctx.strokeStyle = VC_LED; ctx.lineWidth = 2; ctx.shadowColor = VC_LED; ctx.shadowBlur = 3;
  ctx.beginPath(); ctx.arc(ex, ey + 6, 8, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
  ctx.shadowBlur = 0;

  // power button
  ctx.fillStyle = VC_BUTTON;
  ctx.beginPath(); ctx.arc(ex - 10, ey + 16, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = WARM_WHITE;
  ctx.fillRect(ex - 11, ey + 14, 2, 3);

  // tiny power cord
  ctx.strokeStyle = VC_HANDLE; ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(ex + 16, ey + 14);
  ctx.quadraticCurveTo(ex + 28, ey + 10, ex + 30, ey + 20);
  ctx.quadraticCurveTo(ex + 32, ey + 28, ex + 26, ey + 24);
  ctx.stroke();

  // wheels
  ctx.fillStyle = VC_WHEEL;
  ctx.beginPath(); ctx.arc(ex - 14, ey + 22, 4.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ex + 14, ey + 22, 4.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#6D6058';
  ctx.beginPath(); ctx.arc(ex - 14, ey + 22, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ex + 14, ey + 22, 2, 0, Math.PI * 2); ctx.fill();

  renderHealthBar(ctx, ex, ey - 34, 40, 5, e.health / e.maxHealth);
}

// ═══════════════════════════════════════════
// MOSQUITO / 蚊子 (dual wings + 6 legs)
// ═══════════════════════════════════════════

function drawMosquito(ctx: CanvasRenderingContext2D, e: Enemy, ey: number): void {
  const ex = e.x;
  const wo = Math.sin(e.wobble * 3) * 5; // wing offset

  // 6 legs (behind body, upper half)
  ctx.strokeStyle = MQ_BODY; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
  for (let i = -1; i <= 1; i++) {
    // left side
    ctx.beginPath();
    ctx.moveTo(ex - 6, ey + 1);
    ctx.lineTo(ex - 14, ey + 5 + i * 4);
    ctx.lineTo(ex - 18, ey + 7 + i * 3);
    ctx.stroke();
    // joints
    ctx.fillStyle = MQ_BODY;
    ctx.beginPath(); ctx.arc(ex - 14, ey + 5 + i * 4, 1.2, 0, Math.PI * 2); ctx.fill();
    // right side
    ctx.beginPath();
    ctx.moveTo(ex + 6, ey + 1);
    ctx.lineTo(ex + 14, ey + 5 + i * 4);
    ctx.lineTo(ex + 18, ey + 7 + i * 3);
    ctx.stroke();
    ctx.beginPath(); ctx.arc(ex + 14, ey + 5 + i * 4, 1.2, 0, Math.PI * 2); ctx.fill();
  }

  // body
  ctx.fillStyle = MQ_BODY;
  ctx.beginPath(); ctx.ellipse(ex, ey, 12, 8, 0, 0, Math.PI * 2); ctx.fill();
  // body highlight
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath(); ctx.ellipse(ex - 2, ey - 2, 6, 4, 0, 0, Math.PI * 2); ctx.fill();

  // upper wings
  ctx.fillStyle = MQ_WING;
  ctx.beginPath(); ctx.ellipse(ex - 6, ey - 10 + wo, 8, 4.5, -0.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(ex + 6, ey - 10 - wo, 8, 4.5, 0.4, 0, Math.PI * 2); ctx.fill();
  // wing veins
  ctx.strokeStyle = MQ_VEIN; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(ex - 6, ey - 10 + wo); ctx.lineTo(ex - 11, ey - 14 + wo); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ex - 6, ey - 10 + wo); ctx.lineTo(ex - 2, ey - 13 + wo); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ex + 6, ey - 10 - wo); ctx.lineTo(ex + 11, ey - 14 - wo); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ex + 6, ey - 10 - wo); ctx.lineTo(ex + 2, ey - 13 - wo); ctx.stroke();

  // lower wings
  ctx.fillStyle = MQ_WING;
  ctx.beginPath(); ctx.ellipse(ex - 5, ey - 6 + wo * 0.5, 6, 3.5, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(ex + 5, ey - 6 - wo * 0.5, 6, 3.5, 0.3, 0, Math.PI * 2); ctx.fill();

  // eyes (big red)
  ctx.fillStyle = MQ_EYE;
  ctx.beginPath(); ctx.arc(ex - 5, ey - 2, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ex + 5, ey - 2, 4, 0, Math.PI * 2); ctx.fill();
  // highlights
  ctx.fillStyle = WARM_WHITE;
  ctx.beginPath(); ctx.arc(ex - 6, ey - 4, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ex + 4, ey - 4, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ex - 4, ey - 1, 0.8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ex + 6, ey - 1, 0.8, 0, Math.PI * 2); ctx.fill();

  // proboscis
  ctx.strokeStyle = '#2D241D'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(ex, ey + 6); ctx.lineTo(ex, ey + 14); ctx.stroke();
  ctx.fillStyle = '#2D241D';
  ctx.beginPath(); ctx.arc(ex, ey + 14, 1.5, 0, Math.PI * 2); ctx.fill();

  renderHealthBar(ctx, ex, ey - 16, 24, 4, e.health / e.maxHealth);
}

// ═══════════════════════════════════════════
// RAT / 老鼠 (Mickey ears, 5 whiskers)
// ═══════════════════════════════════════════

function drawRat(ctx: CanvasRenderingContext2D, e: Enemy, ey: number): void {
  const ex = e.x;

  // tail (behind)
  ctx.strokeStyle = RT_TAIL; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(ex + 20, ey);
  ctx.quadraticCurveTo(ex + 30, ey - 6, ex + 35, ey + 4);
  ctx.quadraticCurveTo(ex + 40, ey + 14, ex + 32, ey + 10);
  ctx.stroke();

  // body
  ctx.fillStyle = RT_BODY;
  ctx.beginPath(); ctx.ellipse(ex, ey, 20, 14, 0, 0, Math.PI * 2); ctx.fill();
  // belly
  ctx.fillStyle = RT_BELLY;
  ctx.beginPath(); ctx.ellipse(ex, ey + 3, 12, 8, 0, 0, Math.PI * 2); ctx.fill();

  // feet + pink toes
  ctx.fillStyle = RT_FOOT;
  ctx.beginPath(); ctx.ellipse(ex - 8, ey + 12, 4.5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(ex + 8, ey + 12, 4.5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = RT_TOE;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath(); ctx.arc(ex - 8 + i * 2, ey + 14, 1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ex + 8 + i * 2, ey + 14, 1, 0, Math.PI * 2); ctx.fill();
  }

  // head
  ctx.fillStyle = RT_BODY;
  ctx.beginPath(); ctx.arc(ex - 18, ey - 2, 10, 0, Math.PI * 2); ctx.fill();

  // big round Mickey ears
  ctx.fillStyle = RT_EAR_OUT;
  ctx.beginPath(); ctx.arc(ex - 22, ey - 12, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ex - 14, ey - 12, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = RT_EAR_IN;
  ctx.beginPath(); ctx.arc(ex - 22, ey - 12, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ex - 14, ey - 12, 3.5, 0, Math.PI * 2); ctx.fill();

  // eyes (small red, double highlight)
  ctx.fillStyle = RT_EYE;
  ctx.beginPath(); ctx.arc(ex - 20, ey - 3, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ex - 16, ey - 3, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = WARM_WHITE;
  ctx.beginPath(); ctx.arc(ex - 21, ey - 4, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ex - 17, ey - 4, 1.2, 0, Math.PI * 2); ctx.fill();

  // nose (big pink)
  ctx.fillStyle = RT_NOSE;
  ctx.beginPath(); ctx.arc(ex - 29, ey, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = WARM_WHITE;
  ctx.beginPath(); ctx.arc(ex - 30, ey - 1, 1.2, 0, Math.PI * 2); ctx.fill();

  // 5 whiskers each side
  ctx.strokeStyle = BROW_COLOR; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.6;
  for (let i = 0; i < 5; i++) {
    const dy = -5 + i * 2.5;
    ctx.beginPath(); ctx.moveTo(ex - 26, ey + 1); ctx.lineTo(ex - 36, ey - 3 + dy); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // tiny mouth
  ctx.strokeStyle = BROW_COLOR; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(ex - 26, ey + 4, 2.5, 0, Math.PI); ctx.stroke();

  renderHealthBar(ctx, ex, ey - 22, 32, 5, e.health / e.maxHealth);
}

// ═══════════════════════════════════════════
// Health bar / 血条 (warm palette)
// ═══════════════════════════════════════════

function renderHealthBar(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  pct: number,
): void {
  // rounded background
  ctx.fillStyle = HP_BG;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y, w, h, 2.5); ctx.fill();
  // health fill
  if (pct > 0) {
    ctx.fillStyle = HP_FILL;
    ctx.beginPath(); ctx.roundRect(x - w / 2, y, w * pct, h, 2.5); ctx.fill();
  }
}

export default { renderEnemies };
