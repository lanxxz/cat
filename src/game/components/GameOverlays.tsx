/**
 * Game Overlays / 游戏覆盖层
 * 
 * Unified overlay component for all game states:
 * - start: Game start screen with instructions
 * - gameover: Defeat screen with final score
 * - victory: Win screen with celebration
 * - paused: Pause screen with resume option
 * 
 * 统一的游戏状态覆盖层组件:
 * - start: 显示说明的开始界面
 * - gameover: 显示最终得分的失败界面
 * - victory: 显示庆祝的胜利界面
 * - paused: 显示继续选项的暂停界面
 * 
 * @module GameOverlays
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
  /** Current game state / 当前游戏状态 */
  state: 'start' | 'gameover' | 'victory' | 'paused';
  /** Language setting / 语言设置 */
  lang: Language;
  /** Final score (displayed on gameover/victory) / 最终得分 */
  score: number;
  /** Start/restart callback / 开始/重新开始回调 */
  onStart: () => void;
  /** Resume from pause callback / 继续游戏回调 */
  onResume: () => void;
  /** Is current device a phone / 当前设备是否为手机 */
  isPhone?: boolean;
}

/**
 * Main overlay component / 主覆盖层组件
 * Renders different screens based on game state.
 * 根据游戏状态渲染不同的界面。
 */
export default function GameOverlays({ state, lang, score, onStart, onResume, isPhone = false }: OverlayProps) {
  const t = TEXT(lang);
  
  // Responsive font sizes / 响应式字体大小
  const titleFontSize = isPhone ? '32px' : '56px';
  const subtitleFontSize = isPhone ? '16px' : '24px';
  const scoreFontSize = isPhone ? '24px' : '36px';
  const buttonFontSize = isPhone ? '20px' : '28px';
  const buttonPadding = isPhone ? '12px 40px' : '15px 60px';
  const instructionFontSize = isPhone ? '14px' : '16px';
  const instructionsMaxWidth = isPhone ? '260px' : '500px';
  
  // ========== Start Screen / 开始界面 ==========
  // Shows full game instructions and start button
  if (state === 'start') {
    return (
      <div style={overlayContainerStyle}>
        {/* Game title / 游戏标题 */}
        <div style={{ ...overlayTitleStyle, fontSize: titleFontSize }}>{t.startTitle}</div>
        
        {/* Game instructions / 游戏说明 */}
        <div style={{ ...instructionsBoxStyle, maxWidth: instructionsMaxWidth }}>
          {t.instructions.map((text, i) => (
            <p key={i} style={{ ...instructionTextStyle, fontSize: instructionFontSize }}>{text}</p>
          ))}
        </div>
        
        {/* Start button / 开始按钮 */}
        <button onClick={onStart} style={{ ...primaryButtonStyle, fontSize: buttonFontSize, padding: buttonPadding }}>{t.startButton}</button>
      </div>
    );
  }
  
  // ========== Game Over Screen / 游戏结束界面 ==========
  // Shows defeat message and retry option
  if (state === 'gameover') {
    return (
      <div style={overlayContainerStyle}>
        {/* Defeat title / 失败标题 */}
        <div style={{ ...overlayTitleStyle, color: '#E53935', fontSize: titleFontSize }}>{t.gameOver}</div>
        
        {/* Final score / 最终得分 */}
        <div style={{ ...overlayScoreStyle, fontSize: scoreFontSize }}>{t.finalScore}: {score}</div>
        
        {/* Retry button / 重试按钮 */}
        <button onClick={onStart} style={{ ...primaryButtonStyle, fontSize: buttonFontSize, padding: buttonPadding }}>{t.tryAgain}</button>
      </div>
    );
  }
  
  // ========== Victory Screen / 胜利界面 ==========
  // Shows win celebration and replay option
  if (state === 'victory') {
    return (
      <div style={overlayContainerStyle}>
        {/* Victory title / 胜利标题 */}
        <div style={{ ...overlayTitleStyle, color: '#FFD700', fontSize: titleFontSize }}>{t.victory}</div>
        
        {/* Victory subtitle / 胜利副标题 */}
        {t.victorySubtitle && <div style={{ ...overlaySubtitleStyle, fontSize: subtitleFontSize }}>{t.victorySubtitle}</div>}
        
        {/* Final score / 最终得分 */}
        <div style={{ ...overlayScoreStyle, fontSize: scoreFontSize }}>{t.finalScore}: {score}</div>
        
        {/* Play again button / 再玩一次按钮 */}
        <button onClick={onStart} style={{ ...primaryButtonStyle, fontSize: buttonFontSize, padding: buttonPadding }}>{t.playAgain}</button>
      </div>
    );
  }
  
  // ========== Pause Screen / 暂停界面 ==========
  // Shows pause message and resume option
  if (state === 'paused') {
    return (
      <div style={{ ...overlayContainerStyle, background: 'rgba(255, 248, 231, 0.9)' }}>
        {/* Pause title / 暂停标题 */}
        <div style={{ ...overlayTitleStyle, color: '#FF9800', fontSize: titleFontSize }}>{t.pause}</div>
        
        {/* Resume button / 继续按钮 */}
        <button onClick={onResume} style={{ ...primaryButtonStyle, fontSize: buttonFontSize, padding: buttonPadding }}>{t.resume}</button>
      </div>
    );
  }
  
  return null;
}