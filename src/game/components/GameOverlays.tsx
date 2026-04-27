/**
 * Game Overlays / 游戏覆盖层
 * 
 * 开始、游戏结束、胜利、暂停界面
 * 恢复与原始样式一致
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

interface OverlayProps {
  state: 'start' | 'gameover' | 'victory' | 'paused';
  lang: Language;
  score: number;
  onStart: () => void;
  onResume: () => void;
  isPhone?: boolean;
}

export default function GameOverlays({ state, lang, score, onStart, onResume, isPhone = false }: OverlayProps) {
  const t = TEXT(lang);
  
  // Responsive font sizes
  const titleFontSize = isPhone ? '32px' : '56px';
  const subtitleFontSize = isPhone ? '16px' : '24px';
  const scoreFontSize = isPhone ? '24px' : '36px';
  const buttonFontSize = isPhone ? '20px' : '28px';
  const buttonPadding = isPhone ? '12px 40px' : '15px 60px';
  const instructionFontSize = isPhone ? '14px' : '16px';
  const instructionsMaxWidth = isPhone ? '260px' : '500px';
  
  // 开始界面 - 显示完整游戏说明
  if (state === 'start') {
    return (
      <div style={overlayContainerStyle}>
        <div style={{ ...overlayTitleStyle, fontSize: titleFontSize }}>{t.startTitle}</div>
        <div style={{ ...instructionsBoxStyle, maxWidth: instructionsMaxWidth }}>
          {t.instructions.map((text, i) => (
            <p key={i} style={{ ...instructionTextStyle, fontSize: instructionFontSize }}>{text}</p>
          ))}
        </div>
        <button onClick={onStart} style={{ ...primaryButtonStyle, fontSize: buttonFontSize, padding: buttonPadding }}>{t.startButton}</button>
      </div>
    );
  }
  
  // 游戏结束
  if (state === 'gameover') {
    return (
      <div style={overlayContainerStyle}>
        <div style={{ ...overlayTitleStyle, color: '#E53935', fontSize: titleFontSize }}>{t.gameOver}</div>
        <div style={{ ...overlayScoreStyle, fontSize: scoreFontSize }}>{t.finalScore}: {score}</div>
        <button onClick={onStart} style={{ ...primaryButtonStyle, fontSize: buttonFontSize, padding: buttonPadding }}>{t.tryAgain}</button>
      </div>
    );
  }
  
  // 胜利
  if (state === 'victory') {
    return (
      <div style={overlayContainerStyle}>
        <div style={{ ...overlayTitleStyle, color: '#FFD700', fontSize: titleFontSize }}>{t.victory}</div>
        {t.victorySubtitle && <div style={{ ...overlaySubtitleStyle, fontSize: subtitleFontSize }}>{t.victorySubtitle}</div>}
        <div style={{ ...overlayScoreStyle, fontSize: scoreFontSize }}>{t.finalScore}: {score}</div>
        <button onClick={onStart} style={{ ...primaryButtonStyle, fontSize: buttonFontSize, padding: buttonPadding }}>{t.playAgain}</button>
      </div>
    );
  }
  
  // 暂停
  if (state === 'paused') {
    return (
      <div style={{ ...overlayContainerStyle, background: 'rgba(255, 248, 231, 0.9)' }}>
        <div style={{ ...overlayTitleStyle, color: '#FF9800', fontSize: titleFontSize }}>{t.pause}</div>
        <button onClick={onResume} style={{ ...primaryButtonStyle, fontSize: buttonFontSize, padding: buttonPadding }}>{t.resume}</button>
      </div>
    );
  }
  
  return null;
}