/**
 * HUD Component / HUD 组件
 * 
 * Heads-Up Display - shows game stats at top of screen.
 * 平视显示器 - 显示屏幕顶部的游戏状态。
 */

import type { Language } from '../types';
import { TEXT } from '../i18n';
import { TOTAL_WAVES } from '../constants';
import {
  hudContainerStyle,
  hudStatBoxStyle,
  hudTowerCountStyle,
  hudSpeedStyle,
  hudValueStyle,
  hudSpeedValueStyle,
  langToggleStyle,
  pauseButtonStyle,
  hudPhoneStyle,
  hudStatBoxPhoneStyle,
  hudTowerCountPhoneStyle,
  hudSpeedPhoneStyle,
} from '../styles';

interface HUDProps {
  wave: number;
  gold: number;
  lives: number;
  score: number;
  towerCount: number;
  enemySpeedMultiplier: number;
  lang: Language;
  onToggleLang: () => void;
  onTogglePause: () => void;
  isPaused: boolean;
  isPhone?: boolean;
}

/**
 * HUD 组件 / HUD Component
 * 
 * Displays: Wave, Gold, Lives, Score, Tower Count, Enemy Speed, Language Toggle
 * 显示: 波次、金币、生命、分数、猫咪数量、敌人速度、语言切换
 */
export function HUD({ wave, gold, lives, score, towerCount, enemySpeedMultiplier, lang, onToggleLang, onTogglePause, isPaused, isPhone = false }: HUDProps) {
  const t = TEXT(lang);
  
  const containerStyle = isPhone ? hudPhoneStyle : hudContainerStyle;
  const statBoxStyle = isPhone ? hudStatBoxPhoneStyle : hudStatBoxStyle;
  const towerCntStyle = isPhone ? hudTowerCountPhoneStyle : hudTowerCountStyle;
  const spdStyle = isPhone ? hudSpeedPhoneStyle : hudSpeedStyle;
  const emojiSize = isPhone ? '14px' : '16px';
  
  return (
    <div style={containerStyle}>
      {/* 左侧状态 / Left side stats */}
      <div style={{ display: 'flex', gap: isPhone ? '3px' : '6px', flexWrap: 'wrap' }}>
        {/* 波次 / Wave */}
        <div style={statBoxStyle}>
          <span style={{ fontSize: emojiSize }}>🌊</span>
          <span>{t.wave}</span>
          <span style={hudValueStyle}>{wave}/{TOTAL_WAVES}</span>
        </div>
        
        {/* 金币 / Gold */}
        <div style={statBoxStyle}>
          <span style={{ fontSize: emojiSize }}>🪙</span>
          <span style={hudValueStyle}>{gold}</span>
        </div>
        
        {/* 生命 / Lives */}
        <div style={statBoxStyle}>
          <span style={{ fontSize: emojiSize }}>❤️</span>
          <span style={hudValueStyle}>{lives}</span>
        </div>
        
        {/* 分数 / Score */}
        <div style={statBoxStyle}>
          <span style={{ fontSize: emojiSize }}>⭐</span>
          <span style={hudValueStyle}>{score}</span>
        </div>
      </div>
      
      {/* 右侧状态 / Right side stats */}
      <div style={{ display: 'flex', gap: isPhone ? '3px' : '6px', flexWrap: 'wrap' }}>
        {/* 猫咪数量 / Tower Count */}
        <div style={towerCntStyle}>
          <span style={{ fontSize: emojiSize }}>🐱</span>
          {!isPhone && <span>{t.towerCount}</span>}
          <span style={hudValueStyle}>{towerCount}</span>
        </div>
        
        {/* 敌人速度 / Enemy Speed */}
        <div style={spdStyle}>
          <span style={{ fontSize: emojiSize }}>⚡</span>
          {!isPhone && <span>{t.enemySpeed}</span>}
          <span style={hudSpeedValueStyle}>{(enemySpeedMultiplier * 100).toFixed(0)}%</span>
        </div>
        
        {/* 暂停按钮 / Pause Button */}
        <button onClick={onTogglePause} style={pauseButtonStyle}>
          {isPaused ? t.resume : t.pause}
        </button>
        
        {/* 语言切换按钮 / Language Toggle Button */}
        <button onClick={onToggleLang} style={langToggleStyle}>
          {lang === 'zh' ? 'EN' : '中'}
        </button>
      </div>
    </div>
  );
}

export default HUD;