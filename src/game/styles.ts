/**
 * Game Styles / 游戏样式
 * 
 * Centralized style objects for the game UI.
 * 集中管理的游戏 UI 样式对象。
 */

/**
 * ============================================
 * CONTAINER STYLES / 容器样式
 * ============================================
 */

export const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px'
};

/**
 * ============================================
 * TITLE STYLES / 标题样式
 * ============================================
 */

export const titleStyle: React.CSSProperties = {
  fontFamily: 'Fredoka One, cursive',
  fontSize: '48px',
  color: '#FF6B9D',
  textShadow: '3px 3px 0 #FFF, 5px 5px 0 #FFD5E5',
  letterSpacing: '4px',
  animation: 'float 3s ease-in-out infinite'
};

/**
 * ============================================
 * CANVAS STYLES / 画布样式
 * ============================================
 */

export const canvasWrapperStyle: React.CSSProperties = {
  position: 'relative'
};

export const canvasStyle: React.CSSProperties = {
  border: '6px solid #FFB6C1',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(255, 107, 157, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.5)',
  cursor: 'crosshair',
  background: '#FFF8E7',
  display: 'block'
};

/**
 * ============================================
 * BUTTON STYLES / 按钮样式
 * ============================================
 */

interface ButtonStyleParams {
  selected?: boolean;
  disabled?: boolean;
}

export const towerButtonStyle = ({ selected, disabled }: ButtonStyleParams): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '12px 20px',
  background: selected
    ? 'linear-gradient(180deg, #FF80AB 0%, #FF4081 100%)'
    : 'linear-gradient(180deg, #FFF 0%, #F8BBD9 100%)',
  border: `3px solid ${selected ? '#C51162' : '#FF80AB'}`,
  borderRadius: '15px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  minWidth: '140px',
  transition: 'all 0.2s ease',
  fontFamily: 'Nunito, sans-serif'
});

export const primaryButtonStyle: React.CSSProperties = {
  fontFamily: 'Fredoka One, cursive',
  fontSize: '28px',
  padding: '15px 60px',
  background: 'linear-gradient(180deg, #4CAF50 0%, #388E3C 100%)',
  color: 'white',
  border: '4px solid #2E7D32',
  borderRadius: '50px',
  cursor: 'pointer',
  boxShadow: '0 6px 0 #1B5E20'
};

export const langToggleStyle: React.CSSProperties = {
  padding: '6px 12px',
  background: '#FFB6C1',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontFamily: 'Fredoka One, cursive',
  fontSize: '12px',
  color: '#FFF',
  whiteSpace: 'nowrap'
};

/**
 * ============================================
 * HUD STYLES / HUD 样式
 * ============================================
 */

export const hudContainerStyle: React.CSSProperties = {
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
};

export const hudStatBoxStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 10px',
  background: 'rgba(255,255,255,0.8)',
  borderRadius: '10px',
  whiteSpace: 'nowrap'
};

export const hudTowerCountStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 8px',
  background: 'rgba(255,182,193,0.5)',
  borderRadius: '10px',
  whiteSpace: 'nowrap'
};

export const hudSpeedStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 8px',
  background: 'rgba(255,152,0,0.3)',
  borderRadius: '10px',
  whiteSpace: 'nowrap'
};

export const hudValueStyle: React.CSSProperties = {
  color: '#FF6B9D',
  fontFamily: 'Fredoka One, cursive'
};

export const hudSpeedValueStyle: React.CSSProperties = {
  color: '#FF9800',
  fontFamily: 'Fredoka One, cursive'
};

/**
 * ============================================
 * TOWER PANEL STYLES / 防御塔面板样式
 * ============================================
 */

export const towerPanelStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
  padding: '15px',
  background: 'linear-gradient(180deg, #FFF 0%, #FCE4EC 100%)',
  borderRadius: '20px',
  border: '4px solid #FFB6C1',
  width: '768px'
};

export const towerNameStyle = (selected: boolean): React.CSSProperties => ({
  fontFamily: 'Fredoka One, cursive',
  fontSize: '14px',
  color: selected ? 'white' : '#5D4037'
});

export const towerCostStyle = (selected: boolean): React.CSSProperties => ({
  fontSize: '16px',
  color: selected ? 'white' : '#FFA000',
  fontWeight: 800
});

export const towerEmojiStyle: React.CSSProperties = {
  fontSize: '36px',
  marginBottom: '5px'
};

/**
 * ============================================
 * OVERLAY STYLES / 覆盖层样式
 * ============================================
 */

export const overlayContainerStyle: React.CSSProperties = {
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
};

export const overlayTitleStyle: React.CSSProperties = {
  fontFamily: 'Fredoka One, cursive',
  fontSize: '56px',
  color: '#FF6B9D',
  textShadow: '4px 4px 0 #FFD5E5',
  marginBottom: '20px'
};

export const overlaySubtitleStyle: React.CSSProperties = {
  fontSize: '24px',
  color: '#8D6E63',
  marginBottom: '30px'
};

export const overlayScoreStyle: React.CSSProperties = {
  fontFamily: 'Fredoka One, cursive',
  fontSize: '36px',
  color: '#FFA000',
  margin: '20px 0'
};

export const instructionsBoxStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.9)',
  padding: '20px',
  borderRadius: '15px',
  marginBottom: '30px',
  textAlign: 'center',
  maxWidth: '500px'
};

export const instructionTextStyle: React.CSSProperties = {
  color: '#5D4037',
  fontSize: '16px',
  margin: '8px 0'
};