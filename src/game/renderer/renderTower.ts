/**
 * Tower Renderer / 防御塔渲染器
 * 
 * Renders 3 cat tower types in refined illustration style.
 * 以精致插画风格渲染 3 种猫咪防御塔。
 * 
 * Design: picture-book illustration — natural rounded proportions,
 * gradient-like shading, warm earthy palette (animal-island).
 * 设计：绘本插画风 — 自然圆润比例、渐变层次、温暖大地色。
 */

import type { Tower } from '../types';
import { getLevelDisplayConfig, LEVEL_BADGE_FONT, LEVEL_BADGE_OFFSET } from '../constants';

// ── Shared palette / 共享调色板 ──
const SHD = 'rgba(61,52,40,0.2)';   // warm shadow
const EYE_DARK  = '#5D3A28';         // eye pupil
const NOSE_PINK = '#F08A7E';         // nose
const BLUSH     = '#F0C8A0';         // blush / inner ear
const WARM_WHITE = '#FEFAE0';        // highlight white

/* ── Tabby tokens / 虎斑猫 ── */
const TB_FUR     = '#E8985E';
const TB_STRIPE  = '#C47D48';
const TB_BELLY   = '#FCE4C8';

/* ── Siamese tokens / 暹罗猫 ── */
const SM_FUR     = '#F0EBE5';        // light body
const SM_POINT   = '#A08870';        // seal point (face, ears, paws, tail)
const SM_EYE     = '#4896D8';        // blue eyes
const SM_EYE_HL  = '#B8D8F0';        // eye highlight
const SM_BOW     = '#E05050';        // red bow
const SM_BELL    = '#FFD700';        // gold bell

/* ── Orange tokens / 胖橘猫 ── */
const OR_FUR     = '#F4A460';
const OR_BELLY   = '#FFD29A';
const OR_BREAD   = '#DEC4A0';
const OR_BREAD_S = '#B8956E';

// ═══════════════════════════════════════════
// Public API
// ═══════════════════════════════════════════

export function renderTowers(ctx: CanvasRenderingContext2D, towers: Tower[]): void {
  for (const t of towers) renderTower(ctx, t);
}

function renderTower(ctx: CanvasRenderingContext2D, t: Tower): void {
  const tx = t.x, ty = t.y;
  const lv = t.level || 1;
  const cfg = getLevelDisplayConfig(lv);

  // ── shadow ──
  ctx.fillStyle = SHD;
  ctx.beginPath();
  ctx.ellipse(tx, ty + 22, 26, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── level glow ──
  if (cfg.glowColor) {
    ctx.save();
    ctx.shadowColor = cfg.glowColor;
    ctx.shadowBlur = 5 + lv * 2;
    ctx.beginPath(); ctx.arc(tx, ty, 22, 0, Math.PI * 2);
    ctx.fillStyle = cfg.glowColor;
    ctx.globalAlpha = 0.1; ctx.fill(); ctx.restore();
  }

  // ── cat body ──
  if (t.type === 0) drawTabby(ctx, tx, ty);
  else if (t.type === 1) drawSiamese(ctx, tx, ty);
  else drawOrange(ctx, tx, ty);

  // ── badge ──
  const bx = tx + LEVEL_BADGE_OFFSET.x, by = ty + LEVEL_BADGE_OFFSET.y;
  ctx.fillStyle = 'rgba(61,52,40,0.55)';
  const tw = ctx.measureText(cfg.badgeText).width + 8;
  ctx.beginPath(); ctx.roundRect(bx - tw / 2, by - 8, tw, 16, 4); ctx.fill();
  ctx.font = LEVEL_BADGE_FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.strokeStyle = 'rgba(61,52,40,0.5)'; ctx.lineWidth = 2;
  ctx.strokeText(cfg.badgeText, bx, by);
  ctx.fillStyle = cfg.badgeColor; ctx.fillText(cfg.badgeText, bx, by);
}

// ═══════════════════════════════════════════
// TABBY — 虎斑猫 (sitting, striped tail, fang)
// ═══════════════════════════════════════════

function drawTabby(ctx: CanvasRenderingContext2D, tx: number, ty: number): void {
  // ── tail (behind body) ──
  ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.strokeStyle = TB_FUR;
  ctx.beginPath();
  ctx.moveTo(tx + 14, ty + 6);
  ctx.quadraticCurveTo(tx + 30, ty - 2, tx + 28, ty + 16);
  ctx.quadraticCurveTo(tx + 26, ty + 24, tx + 20, ty + 18);
  ctx.stroke();
  // tail stripes
  ctx.strokeStyle = TB_STRIPE; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(tx + 24, ty + 6); ctx.lineTo(tx + 26, ty + 10);
  ctx.moveTo(tx + 27, ty + 12); ctx.lineTo(tx + 29, ty + 6);
  ctx.stroke();

  // ── body ──
  ctx.fillStyle = TB_FUR;
  ctx.beginPath(); ctx.ellipse(tx, ty + 17, 16, 15, 0, 0, Math.PI * 2); ctx.fill();
  // chest V
  ctx.fillStyle = TB_BELLY;
  ctx.beginPath();
  ctx.moveTo(tx, ty + 2); ctx.lineTo(tx - 8, ty + 22); ctx.lineTo(tx + 8, ty + 22); ctx.closePath();
  ctx.fill();

  // ── paws ──
  drawPaws(ctx, tx, ty + 24, 4);

  // ── head ──
  ctx.fillStyle = TB_FUR;
  ctx.beginPath(); ctx.arc(tx, ty - 4, 20, 0, Math.PI * 2); ctx.fill();

  // ── ears ──
  drawEar(ctx, tx - 12, ty - 17, -0.2, TB_FUR, BLUSH);
  drawEar(ctx, tx + 12, ty - 17, 0.2, TB_FUR, BLUSH);

  // ── M stripe ──
  ctx.strokeStyle = TB_STRIPE; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(tx - 8, ty - 18); ctx.lineTo(tx - 3, ty - 12);
  ctx.moveTo(tx + 8, ty - 18); ctx.lineTo(tx + 3, ty - 12);
  ctx.moveTo(tx - 7, ty - 15); ctx.lineTo(tx, ty - 10); ctx.lineTo(tx + 7, ty - 15);
  ctx.stroke();
  // cheek stripes
  ctx.beginPath();
  ctx.moveTo(tx - 8, ty + 0); ctx.lineTo(tx - 13, ty + 5);
  ctx.moveTo(tx + 8, ty + 0); ctx.lineTo(tx + 13, ty + 5);
  ctx.stroke();

  // ── eyes (sparkly) ──
  drawSparkleEye(ctx, tx - 7, ty - 6, 6, 5, EYE_DARK, WARM_WHITE);
  drawSparkleEye(ctx, tx + 7, ty - 6, 6, 5, EYE_DARK, WARM_WHITE);

  // ── nose ──
  ctx.fillStyle = NOSE_PINK;
  ctx.beginPath(); ctx.moveTo(tx, ty + 0); ctx.lineTo(tx - 3, ty + 4); ctx.lineTo(tx + 3, ty + 4); ctx.fill();

  // ── mouth + fang ──
  ctx.strokeStyle = EYE_DARK; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(tx - 3, ty + 4); ctx.lineTo(tx, ty + 7); ctx.lineTo(tx + 3, ty + 4);
  ctx.stroke();
  ctx.fillStyle = WARM_WHITE;
  ctx.beginPath(); ctx.moveTo(tx + 1, ty + 6); ctx.lineTo(tx + 3, ty + 10); ctx.lineTo(tx + 4, ty + 6); ctx.fill();

  // ── blush ──
  ctx.fillStyle = BLUSH;
  ctx.beginPath(); ctx.ellipse(tx - 14, ty + 1, 5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(tx + 14, ty + 1, 5, 3.5, 0, 0, Math.PI * 2); ctx.fill();

  // ── whiskers ──
  drawWhiskers(ctx, tx, ty + 2, 3);
}

// ═══════════════════════════════════════════
// SIAMESE — 暹罗猫 (elegant, seal-point, bow)
// ═══════════════════════════════════════════

function drawSiamese(ctx: CanvasRenderingContext2D, tx: number, ty: number): void {
  // ── tail (dark, behind body) ──
  ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.strokeStyle = SM_POINT;
  ctx.beginPath();
  ctx.moveTo(tx + 12, ty + 10);
  ctx.quadraticCurveTo(tx + 24, ty - 4, tx + 20, ty + 20);
  ctx.stroke();

  // ── body (slim) ──
  ctx.fillStyle = SM_FUR;
  ctx.beginPath(); ctx.ellipse(tx, ty + 16, 13, 16, 0, 0, Math.PI * 2); ctx.fill();

  // ── dark paws ──
  ctx.fillStyle = SM_POINT;
  ctx.beginPath(); ctx.ellipse(tx - 6, ty + 27, 4, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(tx + 6, ty + 27, 4, 4, 0, 0, Math.PI * 2); ctx.fill();

  // ── head ──
  ctx.fillStyle = SM_FUR;
  ctx.beginPath(); ctx.arc(tx, ty - 5, 19, 0, Math.PI * 2); ctx.fill();
  // face mask (seal point)
  ctx.fillStyle = SM_POINT;
  ctx.beginPath();
  ctx.moveTo(tx, ty + 4); ctx.lineTo(tx - 10, ty - 8); ctx.lineTo(tx - 4, ty - 16);
  ctx.quadraticCurveTo(tx, ty - 20, tx + 4, ty - 16);
  ctx.lineTo(tx + 10, ty - 8); ctx.closePath();
  ctx.fill();

  // ── ears ──
  drawEar(ctx, tx - 13, ty - 16, -0.15, SM_POINT, SM_FUR);
  drawEar(ctx, tx + 13, ty - 16, 0.15, SM_POINT, SM_FUR);

  // ── eyes (almond blue, sparkly) ──
  drawAlmondEye(ctx, tx - 7, ty - 5, 5, 6, SM_EYE, SM_EYE_HL);
  drawAlmondEye(ctx, tx + 7, ty - 5, 5, 6, SM_EYE, SM_EYE_HL);

  // ── nose ──
  ctx.fillStyle = NOSE_PINK;
  ctx.beginPath(); ctx.arc(tx, ty + 2, 2.5, 0, Math.PI * 2); ctx.fill();

  // ── mouth ──
  ctx.strokeStyle = SM_POINT; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(tx - 3, ty + 5); ctx.lineTo(tx, ty + 8); ctx.lineTo(tx + 3, ty + 5);
  ctx.stroke();

  // ── blush ──
  ctx.fillStyle = BLUSH;
  ctx.beginPath(); ctx.ellipse(tx - 13, ty + 1, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(tx + 13, ty + 1, 4, 3, 0, 0, Math.PI * 2); ctx.fill();

  // ── bow + bell ──
  ctx.fillStyle = SM_BOW;
  ctx.beginPath(); ctx.moveTo(tx, ty + 14); ctx.lineTo(tx - 5, ty + 9); ctx.lineTo(tx - 5, ty + 19); ctx.fill();
  ctx.beginPath(); ctx.moveTo(tx, ty + 14); ctx.lineTo(tx + 5, ty + 9); ctx.lineTo(tx + 5, ty + 19); ctx.fill();
  ctx.fillStyle = SM_BELL; ctx.strokeStyle = '#C8A000'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(tx, ty + 17, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#8A6D00'; ctx.fillRect(tx - 0.5, ty + 20, 1, 2);

  // ── whiskers ──
  drawWhiskers(ctx, tx, ty + 3, 3);
}

// ═══════════════════════════════════════════
// ORANGE — 胖橘猫 (round loaf, bread, ^_^)
// ═══════════════════════════════════════════

function drawOrange(ctx: CanvasRenderingContext2D, tx: number, ty: number): void {
  // ── tiny tail ──
  ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.strokeStyle = OR_FUR;
  ctx.beginPath();
  ctx.moveTo(tx + 16, ty + 10);
  ctx.quadraticCurveTo(tx + 24, ty + 4, tx + 20, ty + 6);
  ctx.stroke();

  // ── body (very round loaf) ──
  ctx.fillStyle = OR_FUR;
  ctx.beginPath(); ctx.ellipse(tx, ty + 17, 22, 17, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = OR_BELLY;
  ctx.beginPath(); ctx.ellipse(tx, ty + 18, 15, 11, 0, 0, Math.PI * 2); ctx.fill();

  // ── head (huge round) ──
  ctx.fillStyle = OR_FUR;
  ctx.beginPath(); ctx.arc(tx, ty - 5, 21, 0, Math.PI * 2); ctx.fill();

  // ── tiny ears ──
  drawEar(ctx, tx - 10, ty - 20, -0.1, OR_FUR, BLUSH);
  drawEar(ctx, tx + 10, ty - 20, 0.1, OR_FUR, BLUSH);

  // ── eyes (happy ^_^) ──
  ctx.strokeStyle = EYE_DARK; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(tx - 8, ty - 7, 7, Math.PI, 0); ctx.stroke();
  ctx.beginPath(); ctx.arc(tx + 8, ty - 7, 7, Math.PI, 0); ctx.stroke();

  // ── nose ──
  ctx.fillStyle = NOSE_PINK;
  ctx.beginPath(); ctx.arc(tx, ty + 0, 3.5, 0, Math.PI * 2); ctx.fill();

  // ── mouth ──
  ctx.strokeStyle = EYE_DARK; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(tx, ty + 3, 6, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();

  // ── big blush ──
  ctx.fillStyle = BLUSH;
  ctx.beginPath(); ctx.ellipse(tx - 15, ty + 1, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(tx + 15, ty + 1, 7, 5, 0, 0, Math.PI * 2); ctx.fill();

  // ── bread ──
  ctx.fillStyle = OR_BREAD;
  ctx.beginPath(); ctx.ellipse(tx + 16, ty + 14, 14, 9, 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = OR_BREAD_S; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(tx + 16, ty + 14, 14, 9, 0.2, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = OR_BREAD_S; ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
  ctx.beginPath(); ctx.moveTo(tx + 8, ty + 12); ctx.lineTo(tx + 16, ty + 18); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(tx + 16, ty + 6); ctx.lineTo(tx + 22, ty + 12); ctx.stroke();
  ctx.globalAlpha = 1;

  // ── paws over bread ──
  ctx.fillStyle = OR_FUR;
  ctx.beginPath(); ctx.ellipse(tx + 11, ty + 12, 5, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(tx + 21, ty + 12, 5, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = BLUSH;
  ctx.beginPath(); ctx.arc(tx + 11, ty + 13, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(tx + 21, ty + 13, 2, 0, Math.PI * 2); ctx.fill();

  // ── whiskers ──
  drawWhiskers(ctx, tx, ty + 1, 2);
}

// ═══════════════════════════════════════════
// Shared helpers / 共享绘图函数
// ═══════════════════════════════════════════

function drawEar(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, tilt: number,
  outer: string, inner: string,
): void {
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt);
  ctx.fillStyle = outer;
  ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(-3, -14); ctx.lineTo(3, -14); ctx.lineTo(9, 0); ctx.fill();
  ctx.fillStyle = inner;
  ctx.beginPath(); ctx.moveTo(-6, -2); ctx.lineTo(-1, -12); ctx.lineTo(3, -12); ctx.lineTo(6, -2); ctx.fill();
  ctx.restore();
}

function drawSparkleEye(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  iris: string, hl: string,
): void {
  ctx.fillStyle = hl;
  ctx.beginPath(); ctx.ellipse(x, y, w + 0.5, h + 0.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = iris;
  ctx.beginPath(); ctx.ellipse(x, y, w - 1, h - 1, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = hl;
  ctx.beginPath(); ctx.arc(x + 2, y - 2, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x - 2, y + 1, 1.2, 0, Math.PI * 2); ctx.fill();
}

function drawAlmondEye(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  iris: string, hl: string,
): void {
  ctx.fillStyle = hl;
  ctx.beginPath(); ctx.ellipse(x, y, w + 0.8, h + 0.8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = iris;
  ctx.beginPath(); ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1A3048';
  ctx.beginPath(); ctx.ellipse(x, y, 1.8, h * 0.7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = hl;
  ctx.beginPath(); ctx.arc(x + 2, y - 2, 2.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x - 1.5, y + 1.5, 1, 0, Math.PI * 2); ctx.fill();
}

function drawWhiskers(ctx: CanvasRenderingContext2D, cx: number, cy: number, count: number): void {
  ctx.strokeStyle = WARM_WHITE; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.7;
  for (let i = 0; i < count; i++) {
    const dy = -3 + i * 4;
    ctx.beginPath(); ctx.moveTo(cx - 8, cy); ctx.lineTo(cx - 20, cy + dy); ctx.stroke();
  }
  for (let i = 0; i < count; i++) {
    const dy = -3 + i * 4;
    ctx.beginPath(); ctx.moveTo(cx + 8, cy); ctx.lineTo(cx + 20, cy + dy); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawPaws(ctx: CanvasRenderingContext2D, cx: number, y: number, size: number): void {
  ctx.fillStyle = TB_FUR;
  ctx.beginPath(); ctx.ellipse(cx - 7, y, size, size + 1, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 7, y, size, size + 1, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = BLUSH;
  ctx.beginPath(); ctx.arc(cx - 7, y + 1, size * 0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 7, y + 1, size * 0.5, 0, Math.PI * 2); ctx.fill();
}

export default { renderTowers };
