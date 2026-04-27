/**
 * Overlay Components / 覆盖层组件
 * 
 * Game overlays for start, game over, and victory screens.
 * 游戏覆盖层，用于开始、游戏结束和胜利画面。
 */

import type { Language } from '../types';
import { TEXT } from '../i18n';
import {
  overlayContainerStyle,
  overlayTitleStyle,
  overlaySubtitleStyle,
  overlayScoreStyle,
  instructionsBoxStyle,
  instructionTextStyle,
  primaryButtonStyle
} from '../styles';

// ============================================
// Start Overlay / 开始界面
// ============================================

interface StartOverlayProps {
  onStart: () => void;
  lang: Language;
}

/**
 * 游戏开始界面 / Game Start Screen
 * 
 * @deprecated 未使用 - GameOverlays.tsx 组件替代了此功能，处理所有 overlay 状态。
 * Unused - GameOverlays.tsx handles all overlay states instead.
 * 
 * Shows game title, instructions, and start button.
 * 显示游戏标题、说明和开始按钮。
 */
export function StartOverlay({ onStart, lang }: StartOverlayProps) {
  const t = TEXT(lang);
  
  return (
    <div style={overlayContainerStyle}>
      {/* 游戏标题 / Game Title */}
      <div style={overlayTitleStyle}>
        {t.startTitle}
      </div>
      
      {/* 游戏说明 / Game Instructions */}
      <div style={instructionsBoxStyle}>
        {t.instructions.map((text, i) => (
          <p key={i} style={instructionTextStyle}>
            {text}
          </p>
        ))}
      </div>
      
      {/* 开始按钮 / Start Button */}
      <button 
        onClick={onStart} 
        style={primaryButtonStyle}
      >
        {t.startButton}
      </button>
    </div>
  );
}

// ============================================
// Game Over Overlay / 游戏结束界面
// ============================================

interface OverlayProps {
  title: string;
  subtitle?: string;
  score?: number;
  buttonText: string;
  onButtonClick: () => void;
  lang: Language;
}

/**
 * 游戏结束/胜利覆盖层 / Game Over/Victory Overlay
 * 
 * @deprecated 未使用 - GameOverlays.tsx 组件替代了此功能，处理所有 overlay 状态。
 * Unused - GameOverlays.tsx handles all overlay states instead.
 * 
 * Shows final score and replay button.
 * 显示最终得分和重玩按钮。
 */
export function Overlay({ title, subtitle, score, buttonText, onButtonClick, lang }: OverlayProps) {
  const t = TEXT(lang);
  
  return (
    <div style={overlayContainerStyle}>
      {/* 标题 / Title */}
      <div style={overlayTitleStyle}>
        {title}
      </div>
      
      {/* 副标题 / Subtitle */}
      {subtitle && (
        <div style={overlaySubtitleStyle}>
          {subtitle}
        </div>
      )}
      
      {/* 最终分数 / Final Score */}
      {score !== undefined && (
        <div style={overlayScoreStyle}>
          {t.finalScore}: {score}
        </div>
      )}
      
      {/* 按钮 / Button */}
      <button 
        onClick={onButtonClick} 
        style={primaryButtonStyle}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default { StartOverlay, Overlay };