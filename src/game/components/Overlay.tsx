/**
 * Overlay Components / 覆盖层组件
 * 
 * Game overlays for start, game over, and victory screens.
 * 游戏覆盖层，用于开始、游戏结束和胜利画面。
 */

import type { Language } from '../types';
import { TEXT } from '../i18n';

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
 * Shows game title, instructions, and start button.
 * 显示游戏标题、说明和开始按钮。
 */
export function StartOverlay({ onStart, lang }: StartOverlayProps) {
  const t = TEXT(lang);
  
  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '768px', 
      height: '512px', 
      background: 'rgba(255, 248, 231, 0.95)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      borderRadius: '14px', 
      zIndex: 100 
    }}>
      {/* 游戏标题 / Game Title */}
      <div style={{ 
        fontFamily: 'Fredoka One, cursive', 
        fontSize: '56px', 
        color: '#FF6B9D', 
        textShadow: '4px 4px 0 #FFD5E5', 
        marginBottom: '20px' 
      }}>
        {t.startTitle}
      </div>
      
      {/* 游戏说明 / Game Instructions */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.9)', 
        padding: '20px', 
        borderRadius: '15px', 
        marginBottom: '30px', 
        textAlign: 'center', 
        maxWidth: '500px' 
      }}>
        {t.instructions.map((text, i) => (
          <p key={i} style={{ color: '#5D4037', fontSize: '16px', margin: '8px 0' }}>
            {text}
          </p>
        ))}
      </div>
      
      {/* 开始按钮 / Start Button */}
      <button 
        onClick={onStart} 
        style={{ 
          fontFamily: 'Fredoka One, cursive', 
          fontSize: '28px', 
          padding: '15px 60px', 
          background: 'linear-gradient(180deg, #4CAF50 0%, #388E3C 100%)', 
          color: 'white', 
          border: '4px solid #2E7D32', 
          borderRadius: '50px', 
          cursor: 'pointer', 
          boxShadow: '0 6px 0 #1B5E20' 
        }}
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
 * Shows final score and replay button.
 * 显示最终分数和重玩按钮。
 */
export function Overlay({ title, subtitle, score, buttonText, onButtonClick, lang }: OverlayProps) {
  const t = TEXT(lang);
  
  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '768px', 
      height: '512px', 
      background: 'rgba(255, 248, 231, 0.95)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      borderRadius: '14px', 
      zIndex: 100 
    }}>
      {/* 标题 / Title */}
      <div style={{ 
        fontFamily: 'Fredoka One, cursive', 
        fontSize: '56px', 
        color: '#FF6B9D', 
        textShadow: '4px 4px 0 #FFD5E5', 
        marginBottom: '20px' 
      }}>
        {title}
      </div>
      
      {/* 副标题 / Subtitle */}
      {subtitle && (
        <div style={{ fontSize: '24px', color: '#8D6E63', marginBottom: '30px' }}>
          {subtitle}
        </div>
      )}
      
      {/* 最终分数 / Final Score */}
      {score !== undefined && (
        <div style={{ 
          fontFamily: 'Fredoka One, cursive', 
          fontSize: '36px', 
          color: '#FFA000', 
          margin: '20px 0' 
        }}>
          {t.finalScore}: {score}
        </div>
      )}
      
      {/* 按钮 / Button */}
      <button 
        onClick={onButtonClick} 
        style={{ 
          fontFamily: 'Fredoka One, cursive', 
          fontSize: '28px', 
          padding: '15px 60px', 
          background: 'linear-gradient(180deg, #4CAF50 0%, #388E3C 100%)', 
          color: 'white', 
          border: '4px solid #2E7D32', 
          borderRadius: '50px', 
          cursor: 'pointer', 
          boxShadow: '0 6px 0 #1B5E20' 
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default { StartOverlay, Overlay };