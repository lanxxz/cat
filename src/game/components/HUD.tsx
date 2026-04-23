/**
 * HUD Component / HUD 组件
 * 
 * Heads-Up Display - shows game stats at top of screen.
 * 平视显示器 - 显示屏幕顶部的游戏状态。
 */

import type { Language } from '../types';
import { TEXT } from '../i18n';

interface HUDProps {
  wave: number;
  gold: number;
  lives: number;
  score: number;
  towerCount: number;
  enemySpeedMultiplier: number;
  lang: Language;
  onToggleLang: () => void;
}

/**
 * HUD 组件 / HUD Component
 * 
 * Displays: Wave, Gold, Lives, Score, Tower Count, Enemy Speed, Language Toggle
 * 显示: 波次、金币、生命、分数、猫咪数量、敌人速度、语言切换
 */
export function HUD({ wave, gold, lives, score, towerCount, enemySpeedMultiplier, lang, onToggleLang }: HUDProps) {
  const t = TEXT(lang);
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      width: '768px', 
      padding: '10px 16px', 
      background: 'linear-gradient(90deg, #FFE4EC, #FFF, #FFE4EC)', 
      borderRadius: '16px', 
      border: '3px solid #FFB6C1', 
      fontFamily: 'Nunito, sans-serif', 
      fontSize: '14px', 
      color: '#5D4037', 
      gap: '8px' 
    }}>
      {/* 左侧状态 / Left side stats */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {/* 波次 / Wave */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', background: 'rgba(255,255,255,0.8)', borderRadius: '10px', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '16px' }}>🌊</span>
          <span>{t.wave}</span>
          <span style={{ color: '#FF6B9D', fontFamily: 'Fredoka One, cursive', minWidth: '32px' }}>{wave}/15</span>
        </div>
        
        {/* 金币 / Gold */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', background: 'rgba(255,255,255,0.8)', borderRadius: '10px', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '16px' }}>🪙</span>
          <span style={{ color: '#FF6B9D', fontFamily: 'Fredoka One, cursive' }}>{gold}</span>
        </div>
        
        {/* 生命 / Lives */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', background: 'rgba(255,255,255,0.8)', borderRadius: '10px', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '16px' }}>❤️</span>
          <span style={{ color: '#FF6B9D', fontFamily: 'Fredoka One, cursive' }}>{lives}</span>
        </div>
        
        {/* 分数 / Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', background: 'rgba(255,255,255,0.8)', borderRadius: '10px', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '16px' }}>⭐</span>
          <span style={{ color: '#FF6B9D', fontFamily: 'Fredoka One, cursive' }}>{score}</span>
        </div>
      </div>
      
      {/* 右侧状态 / Right side stats */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {/* 猫咪数量 / Tower Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 8px', background: 'rgba(255,182,193,0.5)', borderRadius: '10px', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '14px' }}>🐱</span>
          <span>{t.towerCount}</span>
          <span style={{ color: '#FF6B9D', fontFamily: 'Fredoka One, cursive' }}>{towerCount}</span>
        </div>
        
        {/* 敌人速度 / Enemy Speed */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 8px', background: 'rgba(255,152,0,0.3)', borderRadius: '10px', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '14px' }}>⚡</span>
          <span>{t.enemySpeed}</span>
          <span style={{ color: '#FF9800', fontFamily: 'Fredoka One, cursive' }}>{(enemySpeedMultiplier * 100).toFixed(0)}%</span>
        </div>
        
        {/* 语言切换按钮 / Language Toggle Button */}
        <button 
          onClick={onToggleLang} 
          style={{ 
            padding: '6px 12px', 
            background: '#FFB6C1', 
            border: 'none', 
            borderRadius: '10px', 
            cursor: 'pointer', 
            fontFamily: 'Fredoka One, cursive', 
            fontSize: '12px', 
            color: '#FFF', 
            whiteSpace: 'nowrap' 
          }}
        >
          {lang === 'zh' ? 'EN' : '中'}
        </button>
      </div>
    </div>
  );
}

export default HUD;