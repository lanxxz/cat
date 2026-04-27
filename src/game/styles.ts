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
  gap: '10px',
  width: '100%',
  maxWidth: '768px',
  padding: '0 4px'
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
  position: 'relative',
  maxWidth: '768px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export const canvasStyle: React.CSSProperties = {
  border: '6px solid #FFB6C1',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(255, 107, 157, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.5)',
  cursor: 'crosshair',
  background: '#FFF8E7',
  display: 'block',
  width: '100%',
  height: 'auto',
  touchAction: 'none'
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
  width: '100%',
  maxWidth: '768px',
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

export const pauseButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  background: '#FF9800',
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
  width: '100%',
  maxWidth: '768px'
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

/** 升级模式按钮样式 / Upgrade mode button style - golden gradient when active */
export const upgradeModeButtonStyle = (active: boolean, disabled: boolean): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '12px 16px',
  background: active
    ? 'linear-gradient(180deg, #FFB300 0%, #FF8F00 100%)'
    : disabled
    ? 'linear-gradient(180deg, #E0E0E0 0%, #BDBDBD 100%)'
    : 'linear-gradient(180deg, #FFF8E1 0%, #FFE082 100%)',
  border: `3px solid ${active ? '#FF6F00' : disabled ? '#9E9E9E' : '#FFB300'}`,
  borderRadius: '15px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  minWidth: '100px',
  transition: 'all 0.2s ease',
  fontFamily: 'Nunito, sans-serif'
});

/** 升级模式按钮手机端紧凑样式 / Compact upgrade mode button for phone */
export const upgradeModeButtonPhoneStyle = (active: boolean, disabled: boolean): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '6px 10px',
  background: active
    ? 'linear-gradient(180deg, #FFB300 0%, #FF8F00 100%)'
    : disabled
    ? 'linear-gradient(180deg, #E0E0E0 0%, #BDBDBD 100%)'
    : 'linear-gradient(180deg, #FFF8E1 0%, #FFE082 100%)',
  border: `2px solid ${active ? '#FF6F00' : disabled ? '#9E9E9E' : '#FFB300'}`,
  borderRadius: '12px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  minWidth: '60px',
  transition: 'all 0.2s ease'
});

/**
 * ============================================
 * OVERLAY STYLES / 覆盖层样式
 * ============================================
 */

export const overlayContainerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
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

export const pauseOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(255, 248, 231, 0.9)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '14px',
  zIndex: 100
};

/**
 * ============================================
 * PHONE-SPECIFIC STYLES / 手机专用样式
 * ============================================
 */

/** Tower panel as floating bottom overlay on phone / 手机端浮动底部工具栏 */
export const towerPanelPhoneStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  gap: '8px',
  padding: '8px 6px',
  paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(252,228,236,0.95) 100%)',
  borderTop: '3px solid #FFB6C1',
  borderTopLeftRadius: '14px',
  borderTopRightRadius: '14px',
  zIndex: 200,
  backdropFilter: 'blur(8px)'
};

/** Compact tower button for phone / 手机端紧凑按钮 */
export const towerButtonPhoneStyle = ({ selected, disabled }: ButtonStyleParams): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '6px 12px',
  background: selected
    ? 'linear-gradient(180deg, #FF80AB 0%, #FF4081 100%)'
    : 'linear-gradient(180deg, #FFF 0%, #F8BBD9 100%)',
  border: `2px solid ${selected ? '#C51162' : '#FF80AB'}`,
  borderRadius: '12px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  minWidth: '80px',
  transition: 'all 0.2s ease',
  fontFamily: 'Nunito, sans-serif'
});

/** Compact HUD for phone (flex-wrap: 2 rows) / 手机端紧凑HUD */
export const hudPhoneStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  maxWidth: '768px',
  padding: '6px 8px',
  background: 'linear-gradient(90deg, #FFE4EC, #FFF, #FFE4EC)',
  borderRadius: '12px',
  border: '2px solid #FFB6C1',
  fontFamily: 'Nunito, sans-serif',
  fontSize: '11px',
  color: '#5D4037',
  gap: '4px',
  rowGap: '4px'
};

/** Compact stat box for phone / 手机端紧凑状态框 */
export const hudStatBoxPhoneStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  padding: '4px 6px',
  background: 'rgba(255,255,255,0.8)',
  borderRadius: '8px',
  whiteSpace: 'nowrap',
  fontSize: '11px'
};

/** Compact tower count box for phone / 手机端紧凑猫咪计数 */
export const hudTowerCountPhoneStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  padding: '4px 5px',
  background: 'rgba(255,182,193,0.5)',
  borderRadius: '8px',
  whiteSpace: 'nowrap',
  fontSize: '11px'
};

/** Compact speed box for phone / 手机端紧凑速度 */
export const hudSpeedPhoneStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  padding: '4px 5px',
  background: 'rgba(255,152,0,0.3)',
  borderRadius: '8px',
  whiteSpace: 'nowrap',
  fontSize: '11px'
};

/**
 * ============================================
 * TUTORIAL & ANNOUNCEMENT STYLES / 教程和公告样式
 * ============================================
 */

/** Tutorial overlay container - semi-transparent canvas overlay */
export const tutorialOverlayContainer: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.15)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '14px',
  zIndex: 90,
  pointerEvents: 'none'
};

/** Tutorial text box - positioned instruction with pulsing animation */
export const tutorialTextBox: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.95)',
  padding: '16px 28px',
  borderRadius: '16px',
  border: '3px solid #FFB6C1',
  fontFamily: 'Nunito, sans-serif',
  fontSize: '18px',
  fontWeight: 700,
  color: '#5D4037',
  boxShadow: '0 6px 24px rgba(255, 107, 157, 0.3)',
  textAlign: 'center',
  animation: 'tutorialBounce 1s ease-in-out infinite',
  maxWidth: '400px',
  pointerEvents: 'none'
};

/** Tutorial arrow - pointing indicator */
export const tutorialArrow: React.CSSProperties = {
  fontSize: '32px',
  animation: 'tutorialBounce 0.8s ease-in-out infinite',
  marginTop: '8px'
};

/** Level announcement overlay - centered big text */
export const levelAnnouncementOverlay: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFB6C1',
  color: 'white',
  padding: '20px 40px',
  borderRadius: '16px',
  fontSize: '28px',
  fontWeight: 'bold',
  fontFamily: 'Fredoka One, cursive',
  boxShadow: '0 6px 30px rgba(255, 107, 157, 0.4)',
  textAlign: 'center',
  animation: 'tutorialBounce 0.6s ease-out',
  zIndex: 100,
  pointerEvents: 'none'
};

/** Level announcement subtitle */
export const levelAnnouncementSubtitle: React.CSSProperties = {
  fontSize: '18px',
  fontFamily: 'Nunito, sans-serif',
  fontWeight: 600,
  marginTop: '8px',
  color: '#FFF8E7'
};

/**
 * ============================================
 * UPGRADE POPUP STYLES / 升级弹出框样式
 * ============================================
 */

/** Upgrade popup container - pink kawaii floating panel / 升级弹出框容器 - 粉色可爱浮动面板 */
export const upgradePopupContainerStyle: React.CSSProperties = {
  position: 'absolute',
  background: 'linear-gradient(180deg, #FFF 0%, #FFE4EC 100%)',
  border: '3px solid #FFB6C1',
  borderRadius: '12px',
  padding: '12px 16px',
  fontFamily: 'Nunito, sans-serif',
  fontSize: '13px',
  color: '#5D4037',
  boxShadow: '0 4px 16px rgba(255,107,157,0.3)',
  zIndex: 95,
  minWidth: '160px',
  pointerEvents: 'auto'
};

/** Upgrade popup action button - pink gradient / 升级弹出框操作按钮 - 粉色渐变 */
export const upgradePopupButtonStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '6px 12px',
  marginTop: '6px',
  border: 'none',
  borderRadius: '8px',
  fontFamily: 'Fredoka One, cursive',
  fontSize: '14px',
  cursor: 'pointer',
  background: 'linear-gradient(180deg, #FF80AB 0%, #FF4081 100%)',
  color: 'white'
};

/** Upgrade popup close (X) button / 升级弹出框关闭按钮 */
export const upgradePopupCloseStyle: React.CSSProperties = {
  position: 'absolute',
  top: '4px',
  right: '8px',
  background: 'none',
  border: 'none',
  fontSize: '18px',
  cursor: 'pointer',
  color: '#C51162',
  fontFamily: 'sans-serif'
};