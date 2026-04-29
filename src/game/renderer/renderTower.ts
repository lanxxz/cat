/**
 * Tower Renderer / 防御塔渲染器
 * 
 * Renders all 3 tower types with animal-island-ui inspired palette.
 * 渲染所有 3 种防御塔，采用动物森友会风格的温暖配色。
 * 
 * Design principles / 设计原则:
 * - Warm earthy tones for fur (sandy orange, warm taupe, golden sand)
 * - Cream/peach highlights (inner ears, blush)
 * - Warm brown shadows instead of black
 * - Soft, round chibi shapes
 * - 暖色系毛色（沙橙、暖灰褐、金砂）
 * - 奶油/蜜桃色高光（内耳、腮红）
 * - 暖棕阴影替代纯黑
 * - 柔和的 Q 版圆润造型
 */

import type { Tower } from '../types';
import { getLevelDisplayConfig, LEVEL_BADGE_FONT, LEVEL_BADGE_OFFSET } from '../constants';

// ============================================
// DESIGN TOKENS / 设计 token (animal-island 暖色系)
// ============================================

/** 暖棕阴影 / Warm brown shadow */
const SHADOW_COLOR = 'rgba(61, 52, 40, 0.18)';

/** 暖棕（眼睛/线条）/ Warm brown for eyes and strokes */
const EYE_BROWN = '#6D4C41';

/** 柔和粉色（鼻子）/ Soft pink for nose */
const NOSE_PINK = '#F08A7E';

/** 暖蜜桃色（腮红/内耳）/ Warm peach for blush and inner ears */
const BLUSH_PEACH = '#F0C8A0';

// Tabby (type 0) / 虎斑猫 — 温暖沙橙
const TABBY_FUR     = '#E8985E';  // 沙橙色身体 / Sandy orange body
const TABBY_STRIPE  = '#C48450';  // 暖棕条纹 / Warm brown stripes
const TABBY_HIGHLIGHT = '#F4C89A'; // 奶油色高光 / Cream highlight

// Siamese (type 1) / 暹罗猫 — 暖灰褐
const SIAMESE_FUR   = '#BCAAA4';  // 暖灰褐身体 / Warm taupe body
const SIAMESE_EYE   = '#5C9CE6';  // 柔和蓝眼睛 / Soft blue eyes
const SIAMESE_EYE_SHINE = '#B3D4F7'; // 柔蓝高光 / Soft blue highlight

// Orange Bread (type 2) / 胖橘猫 — 金砂色
const ORANGE_FUR    = '#F4A460';  // 金砂色身体 / Golden sand body
const ORANGE_BELLY  = '#FFD29A';  // 奶油橘肚皮 / Cream-orange belly
const ORANGE_BREAD  = '#D7CCC8';  // 面包 — 暖灰 / Bread — warm grey
const ORANGE_BREAD_STROKE = '#A08870'; // 面包描边 — 暖棕 / Bread stroke — warm brown

// Level glow / 等级光环 — 保留原有映射
const BADGE_BG = 'rgba(61, 52, 40, 0.55)'; // 暖棕半透明徽章背景

/**
 * 渲染所有防御塔 / Render all towers
 */
export function renderTowers(ctx: CanvasRenderingContext2D, towers: Tower[]): void {
  for (const tower of towers) {
    renderTower(ctx, tower);
  }
}

/**
 * 渲染单个防御塔 / Render single tower
 */
function renderTower(ctx: CanvasRenderingContext2D, tower: Tower): void {
  const tx = tower.x;
  const ty = tower.y;
  
  // 暖色阴影 / Warm shadow
  ctx.fillStyle = SHADOW_COLOR;
  ctx.beginPath();
  ctx.ellipse(tx, ty + 22, 24, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 等级显示配置 / Level display configuration
  const level = tower.level || 1;
  const display = getLevelDisplayConfig(level);
  
  // 等级光环（Lv2+ 有颜色光晕）/ Level glow ring (Lv2+ has colored glow)
  if (display.glowColor) {
    ctx.save();
    ctx.shadowColor = display.glowColor;
    ctx.shadowBlur = 6 + level * 2;
    ctx.beginPath();
    ctx.arc(tx, ty, 20, 0, Math.PI * 2);
    ctx.fillStyle = display.glowColor;
    ctx.globalAlpha = 0.12;
    ctx.fill();
    ctx.restore();
  }
  
  // 根据类型渲染不同猫咪 / Render different cats based on type
  if (tower.type === 0) {
    renderSpittingTabby(ctx, tx, ty);
  } else if (tower.type === 1) {
    renderSiameseSniper(ctx, tx, ty);
  } else {
    renderOrangeBreadCat(ctx, tx, ty);
  }
  
  // 等级徽章 / Level badge
  const badgeX = tx + LEVEL_BADGE_OFFSET.x;
  const badgeY = ty + LEVEL_BADGE_OFFSET.y;
  
  // 徽章背景 — 暖棕半透明 / Badge background — warm brown
  ctx.fillStyle = BADGE_BG;
  const textWidth = ctx.measureText(display.badgeText).width;
  const badgeW = textWidth + 8;
  const badgeH = 16;
  ctx.beginPath();
  ctx.roundRect(badgeX - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 4);
  ctx.fill();
  
  // 徽章文字 / Badge text
  ctx.font = LEVEL_BADGE_FONT;
  ctx.fillStyle = display.badgeColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeStyle = 'rgba(61, 52, 40, 0.6)'; // 暖色描边替代纯黑
  ctx.lineWidth = 2;
  ctx.strokeText(display.badgeText, badgeX, badgeY);
  ctx.fillText(display.badgeText, badgeX, badgeY);
}

/**
 * 渲染随地吐痰的虎斑猫 (暖沙橙色) / Render Spitting Tabby — warm sandy orange
 */
function renderSpittingTabby(ctx: CanvasRenderingContext2D, tx: number, ty: number): void {
  // 身体 (chibi 风格) / Body (chibi style)
  ctx.fillStyle = TABBY_FUR;
  ctx.beginPath();
  ctx.ellipse(tx, ty + 10, 24, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 条纹 / Stripes — warm brown
  ctx.strokeStyle = TABBY_STRIPE;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(tx - 12, ty); ctx.lineTo(tx - 6, ty + 12);
  ctx.moveTo(tx + 12, ty); ctx.lineTo(tx + 6, ty + 12);
  ctx.moveTo(tx, ty - 4); ctx.lineTo(tx, ty + 10);
  ctx.stroke();
  
  // 头部 (圆形) / Head (round)
  ctx.fillStyle = TABBY_FUR;
  ctx.beginPath();
  ctx.arc(tx, ty - 8, 20, 0, Math.PI * 2);
  ctx.fill();
  
  // 耳朵 (小三角形) / Ears (small triangles)
  ctx.fillStyle = TABBY_FUR;
  ctx.beginPath();
  ctx.moveTo(tx - 14, ty - 20); ctx.lineTo(tx - 10, ty - 32); ctx.lineTo(tx - 4, ty - 22);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(tx + 14, ty - 20); ctx.lineTo(tx + 10, ty - 32); ctx.lineTo(tx + 4, ty - 22);
  ctx.fill();
  
  // 内耳 (暖蜜桃色) / Inner ears — warm peach
  ctx.fillStyle = BLUSH_PEACH;
  ctx.beginPath();
  ctx.moveTo(tx - 12, ty - 22); ctx.lineTo(tx - 10, ty - 28); ctx.lineTo(tx - 6, ty - 22);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(tx + 12, ty - 22); ctx.lineTo(tx + 10, ty - 28); ctx.lineTo(tx + 6, ty - 22);
  ctx.fill();
  
  // 眼睛 (大而有神) / Eyes — big kawaii
  ctx.fillStyle = EYE_BROWN;
  ctx.beginPath();
  ctx.ellipse(tx - 7, ty - 10, 4, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(tx + 7, ty - 10, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 奶油高光 / Cream highlight — warm cream
  ctx.fillStyle = TABBY_HIGHLIGHT;
  ctx.beginPath();
  ctx.arc(tx - 8, ty - 12, 2, 0, Math.PI * 2);
  ctx.arc(tx + 6, ty - 12, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // 腮红 — 暖蜜桃色 / Blush — warm peach
  ctx.fillStyle = BLUSH_PEACH;
  ctx.beginPath();
  ctx.ellipse(tx - 14, ty - 2, 5, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(tx + 14, ty - 2, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 鼻子 / Nose — soft pink
  ctx.fillStyle = NOSE_PINK;
  ctx.beginPath();
  ctx.arc(tx, ty - 4, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // 嘴巴 (微笑) / Mouth — small smile
  ctx.strokeStyle = EYE_BROWN;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(tx, ty, 4, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();
}

/**
 * 渲染狙击手暹罗猫 (暖灰褐 + 柔和蓝眼) / Render Siamese Sniper — warm taupe + soft blue eyes
 */
function renderSiameseSniper(ctx: CanvasRenderingContext2D, tx: number, ty: number): void {
  // 身体 / Body — warm taupe
  ctx.fillStyle = SIAMESE_FUR;
  ctx.beginPath();
  ctx.ellipse(tx, ty + 10, 24, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 头部 / Head
  ctx.beginPath();
  ctx.arc(tx, ty - 8, 20, 0, Math.PI * 2);
  ctx.fill();
  
  // 尖耳朵 / Pointed ears
  ctx.fillStyle = SIAMESE_FUR;
  ctx.beginPath();
  ctx.moveTo(tx - 14, ty - 20); ctx.lineTo(tx - 8, ty - 34); ctx.lineTo(tx - 2, ty - 22);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(tx + 14, ty - 20); ctx.lineTo(tx + 8, ty - 34); ctx.lineTo(tx + 2, ty - 22);
  ctx.fill();
  
  // 内耳 — 暖奶油色 / Inner ears — warm cream
  ctx.fillStyle = '#FAE8C8';
  ctx.beginPath();
  ctx.moveTo(tx - 12, ty - 22); ctx.lineTo(tx - 8, ty - 30); ctx.lineTo(tx - 4, ty - 22);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(tx + 12, ty - 22); ctx.lineTo(tx + 8, ty - 30); ctx.lineTo(tx + 4, ty - 22);
  ctx.fill();
  
  // 蓝色眼睛 (狙击手眼神) / Blue eyes — soft blue (sniper focus)
  ctx.fillStyle = SIAMESE_EYE;
  ctx.beginPath();
  ctx.ellipse(tx - 7, ty - 10, 5, 6, 0, 0, Math.PI * 2);
  ctx.ellipse(tx + 7, ty - 10, 5, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 瞳孔 / Pupil — warm dark brown instead of pure black
  ctx.fillStyle = EYE_BROWN;
  ctx.beginPath();
  ctx.arc(tx - 7, ty - 10, 2, 0, Math.PI * 2);
  ctx.arc(tx + 7, ty - 10, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // 眼神光 / Eye shine — soft blue highlight
  ctx.fillStyle = SIAMESE_EYE_SHINE;
  ctx.beginPath();
  ctx.arc(tx - 9, ty - 12, 2, 0, Math.PI * 2);
  ctx.arc(tx + 5, ty - 12, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // 腮红 — 暖蜜桃色 / Blush — warm peach
  ctx.fillStyle = BLUSH_PEACH;
  ctx.beginPath();
  ctx.ellipse(tx - 14, ty - 2, 5, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(tx + 14, ty - 2, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 三角形鼻子 / Triangle nose — soft pink
  ctx.fillStyle = NOSE_PINK;
  ctx.beginPath();
  ctx.moveTo(tx, ty - 3);
  ctx.lineTo(tx - 3, ty);
  ctx.lineTo(tx + 3, ty);
  ctx.fill();
  
  // 严肃嘴巴 / Serious mouth
  ctx.strokeStyle = EYE_BROWN;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(tx - 3, ty + 4);
  ctx.lineTo(tx, ty + 3);
  ctx.lineTo(tx + 3, ty + 4);
  ctx.stroke();
}

/**
 * 渲染胖橘猫 (金砂色 + 面包) / Render Orange Bread Fat Cat — golden sand + bread
 */
function renderOrangeBreadCat(ctx: CanvasRenderingContext2D, tx: number, ty: number): void {
  // 胖身体 (非常圆) / FAT body — really round
  ctx.fillStyle = ORANGE_FUR;
  ctx.beginPath();
  ctx.ellipse(tx, ty + 12, 28, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 肚子 (较浅奶油橘) / Belly — lighter cream-orange
  ctx.fillStyle = ORANGE_BELLY;
  ctx.beginPath();
  ctx.ellipse(tx, ty + 14, 18, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 头部 (也圆) / Head — also round
  ctx.fillStyle = ORANGE_FUR;
  ctx.beginPath();
  ctx.arc(tx, ty - 6, 22, 0, Math.PI * 2);
  ctx.fill();
  
  // 小耳朵 / Tiny ears
  ctx.beginPath();
  ctx.moveTo(tx - 12, ty - 20); ctx.lineTo(tx - 6, ty - 28); ctx.lineTo(tx, ty - 22);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(tx + 12, ty - 20); ctx.lineTo(tx + 6, ty - 28); ctx.lineTo(tx, ty - 22);
  ctx.fill();
  
  // 内耳 — 暖蜜桃色 / Inner ears — warm peach
  ctx.fillStyle = BLUSH_PEACH;
  ctx.beginPath();
  ctx.moveTo(tx - 10, ty - 22); ctx.lineTo(tx - 6, ty - 26); ctx.lineTo(tx - 2, ty - 22);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(tx + 10, ty - 22); ctx.lineTo(tx + 6, ty - 26); ctx.lineTo(tx + 2, ty - 22);
  ctx.fill();
  
  // 开心闭眼 ^_^ / Happy closed eyes ^_^
  ctx.strokeStyle = EYE_BROWN;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(tx - 8, ty - 8, 6, Math.PI, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(tx + 8, ty - 8, 6, Math.PI, 0);
  ctx.stroke();
  
  // 大腮红 — 暖蜜桃色 / Big blush — warm peach
  ctx.fillStyle = BLUSH_PEACH;
  ctx.beginPath();
  ctx.ellipse(tx - 14, ty, 8, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(tx + 14, ty, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 开心鼻子 — 柔和粉色 / Happy nose — soft pink
  ctx.fillStyle = NOSE_PINK;
  ctx.beginPath();
  ctx.arc(tx, ty, 4, 0, Math.PI * 2);
  ctx.fill();
  
  // 开心嘴巴 / Happy mouth
  ctx.strokeStyle = EYE_BROWN;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(tx, ty + 2, 6, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();
  
  // 爪子里拿着面包 / Bread in paw — warm color
  ctx.fillStyle = ORANGE_BREAD;
  ctx.beginPath();
  ctx.ellipse(tx + 18, ty + 12, 14, 10, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = ORANGE_BREAD_STROKE;
  ctx.lineWidth = 2;
  ctx.stroke();
}

export default {
  renderTowers
};
