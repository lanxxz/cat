/**
 * Game Styles / 游戏样式
 * 
 * Centralized style objects for the game UI.
 * 集中管理的游戏 UI 样式对象。
 * 
 * Design system: animal-island-ui
 * 设计系统：动物森友会风格
 * - Colors: warm earthy browns + mint green accents
 * - Buttons: 50px pill shape + 3D game-key shadows
 * - Typography: Nunito (Latin) + Noto Sans SC (Chinese) + Zen Maru Gothic
 * - Motion: cubic-bezier(0.4, 0, 0.2, 1) transitions
 * - 色调：温暖大地棕 + 薄荷绿点缀
 * - 按钮：50px pill 形 + 3D 游戏按键阴影
 * - 字体：Nunito（拉丁）+ Noto Sans SC（中文）+ Zen Maru Gothic
 * - 动效：cubic-bezier(0.4, 0, 0.2, 1) 过渡
 */

// ============================================
// DESIGN TOKENS / 设计 token
// ============================================

const TOKENS = {
  // Primary / 主色
  primary:         '#19c8b9',
  primaryHover:    '#3dd4c6',
  primaryActive:   '#11a89b',
  primaryBg:       '#e6f9f6',

  // Text / 文字
  text:            '#794f27',
  textBody:        '#725d42',
  textSecondary:   '#9f927d',
  textMuted:       '#8a7b66',
  textDisabled:    '#c4b89e',

  // Background / 背景
  bg:              '#f8f8f0',
  bgContent:       'rgb(247, 243, 223)',
  bgDisabled:      '#f0ece2',

  // Border / 边框
  border:          '#c4b89e',
  borderHover:     '#a89878',
  borderStrong:    '#9f927d',

  // 3D Shadows / 3D 游戏按键阴影
  shadowBtn:       '#bdaea0',
  shadowInput:     '#d4c9b4',

  // Status / 状态
  focusYellow:     '#ffcc00',
  focusYellowDark: '#e0b800',
  success:         '#6fba2c',
  successActive:   '#5a9e1e',
  warning:         '#f5c31c',
  error:           '#e05a5a',
  gold:            '#e8a000',

  // Radii / 圆角
  radiusSm:        '12px',
  radius:          '18px',
  radiusLg:        '24px',
  radiusPill:      '50px',

  // Shadows / 卡片阴影
  cardShadow:      '0 3px 10px 0 rgba(61, 52, 40, 0.10)',
  cardShadowLg:    '0 8px 24px 0 rgba(61, 52, 40, 0.14)',

  // Easing / 缓动
  ease:            'cubic-bezier(0.4, 0, 0.2, 1)',
  durationFast:    '0.15s',
  duration:        '0.25s',
  durationSlow:    '0.35s',

  // Fonts / 字体
  fontDisplay:     'Nunito, \'Noto Sans SC\', \'Zen Maru Gothic\', sans-serif',
  fontBody:        'Nunito, \'Noto Sans SC\', \'Zen Maru Gothic\', sans-serif',
} as const;

// ============================================
// CONTAINER STYLES / 容器样式
// ============================================

export const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  maxWidth: '768px',
  padding: '0 4px',
};

// ============================================
// TITLE STYLES / 标题样式
// ============================================

/** Main game title — warm brown with subtle shadow / 主游戏标题 — 暖棕 + 柔和阴影 */
export const titleStyle: React.CSSProperties = {
  fontFamily: TOKENS.fontDisplay,
  fontSize: '48px',
  fontWeight: 700,
  color: TOKENS.text,
  textShadow: '2px 2px 0 rgba(255, 255, 255, 0.8), 4px 4px 0 rgba(121, 79, 39, 0.12)',
  letterSpacing: '2px',
  animation: 'float 3s ease-in-out infinite',
};

// ============================================
// CANVAS STYLES / 画布样式
// ============================================

export const canvasWrapperStyle: React.CSSProperties = {
  position: 'relative',
  maxWidth: '768px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/** Game canvas — mint border with warm shadow / 游戏画布 — 薄荷边框 + 暖色阴影 */
export const canvasStyle: React.CSSProperties = {
  border: '6px solid ' + TOKENS.primary,
  borderRadius: TOKENS.radiusLg,
  boxShadow: TOKENS.cardShadowLg + ', inset 0 0 50px rgba(255, 255, 255, 0.3)',
  cursor: 'crosshair',
  background: TOKENS.bgContent,
  display: 'block',
  width: '100%',
  height: 'auto',
  touchAction: 'none',
};

// ============================================
// BUTTON STYLES / 按钮样式
// ============================================

interface ButtonStyleParams {
  selected?: boolean;
  disabled?: boolean;
}

/**
 * Tower selection button — pill shape with 3D game-key shadow
 * 防御塔选择按钮 — pill 形 + 3D 游戏按键阴影
 * 
 * Unselected: cream bg, brown text, warm 3D shadow
 * Selected: mint green bg, white text, darker 3D shadow
 * 未选中：奶油底 + 棕色文字 + 暖色 3D 阴影
 * 选中：薄荷绿底 + 白色文字 + 深色 3D 阴影
 */
export const towerButtonStyle = ({ selected, disabled }: ButtonStyleParams): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '10px 24px',
  background: selected
    ? 'linear-gradient(180deg, ' + TOKENS.primaryHover + ' 0%, ' + TOKENS.primary + ' 100%)'
    : 'linear-gradient(180deg, #fff 0%, ' + TOKENS.bgContent + ' 100%)',
  border: '3px solid ' + (selected ? TOKENS.primaryActive : TOKENS.border),
  borderRadius: TOKENS.radiusPill,
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  minWidth: '140px',
  transition: 'all ' + TOKENS.duration + ' ' + TOKENS.ease,
  fontFamily: TOKENS.fontBody,
  boxShadow: '0 5px 0 0 ' + (selected ? TOKENS.primaryActive : TOKENS.shadowBtn),
  color: selected ? '#fff' : TOKENS.textBody,
  fontWeight: selected ? 700 : 600,
});

export const primaryButtonStyle: React.CSSProperties = {
  fontFamily: TOKENS.fontDisplay,
  fontSize: '28px',
  fontWeight: 700,
  padding: '14px 56px',
  background: 'linear-gradient(180deg, ' + TOKENS.primary + ' 0%, ' + TOKENS.primaryActive + ' 100%)',
  color: '#fff',
  border: '3px solid ' + TOKENS.primaryActive,
  borderRadius: TOKENS.radiusPill,
  cursor: 'pointer',
  boxShadow: '0 5px 0 0 ' + TOKENS.primaryActive,
  transition: 'all ' + TOKENS.duration + ' ' + TOKENS.ease,
  letterSpacing: '0.02em',
};

/** Language toggle — compact pill / 语言切换 — 紧凑 pill */
export const langToggleStyle: React.CSSProperties = {
  padding: '5px 14px',
  background: TOKENS.primaryBg,
  border: '2px solid ' + TOKENS.primary,
  borderRadius: TOKENS.radiusPill,
  cursor: 'pointer',
  fontFamily: TOKENS.fontDisplay,
  fontSize: '12px',
  fontWeight: 700,
  color: TOKENS.primary,
  whiteSpace: 'nowrap',
  transition: 'all ' + TOKENS.durationFast + ' ' + TOKENS.ease,
};

// ============================================
// HUD STYLES / HUD 样式
// ============================================

export const hudContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  maxWidth: '768px',
  padding: '8px 16px',
  background: 'linear-gradient(90deg, ' + TOKENS.bgContent + ', #fff, ' + TOKENS.bgContent + ')',
  borderRadius: TOKENS.radius,
  border: '2.5px solid ' + TOKENS.border,
  fontFamily: TOKENS.fontBody,
  fontSize: '14px',
  fontWeight: 600,
  color: TOKENS.textBody,
  gap: '8px',
  boxShadow: TOKENS.cardShadow,
};

export const hudStatBoxStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '5px 10px',
  background: 'rgba(255,255,255,0.85)',
  borderRadius: TOKENS.radiusSm,
  whiteSpace: 'nowrap',
  border: '1.5px solid ' + TOKENS.border,
};

export const hudTowerCountStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '5px 10px',
  background: 'rgba(25, 200, 185, 0.12)',
  borderRadius: TOKENS.radiusSm,
  whiteSpace: 'nowrap',
  border: '1.5px solid ' + TOKENS.primary,
};

export const hudSpeedStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '5px 10px',
  background: 'rgba(245, 195, 28, 0.15)',
  borderRadius: TOKENS.radiusSm,
  whiteSpace: 'nowrap',
  border: '1.5px solid ' + TOKENS.warning,
};

/** Highlighted HUD value — warm brown emphasis / HUD 高亮数值 — 暖棕强调 */
export const hudValueStyle: React.CSSProperties = {
  color: TOKENS.text,
  fontWeight: 800,
};

/** Speed display in HUD — golden emphasis / 速度显示 — 金色强调 */
export const hudSpeedValueStyle: React.CSSProperties = {
  color: '#c48a00',
  fontWeight: 800,
};

/** Pause button — warm amber pill / 暂停按钮 — 暖琥珀色 pill */
export const pauseButtonStyle: React.CSSProperties = {
  padding: '5px 14px',
  background: TOKENS.warning,
  border: '2px solid #dba90e',
  borderRadius: TOKENS.radiusPill,
  cursor: 'pointer',
  fontFamily: TOKENS.fontDisplay,
  fontSize: '12px',
  fontWeight: 700,
  color: TOKENS.text,
  whiteSpace: 'nowrap',
  boxShadow: '0 3px 0 0 #dba90e',
  transition: 'all ' + TOKENS.durationFast + ' ' + TOKENS.ease,
};

// ============================================
// TOWER PANEL STYLES / 防御塔面板样式
// ============================================

export const towerPanelStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '14px',
  padding: '14px 18px',
  background: 'linear-gradient(180deg, #fff 0%, ' + TOKENS.bgContent + ' 100%)',
  borderRadius: TOKENS.radiusLg,
  border: '3px solid ' + TOKENS.borderStrong,
  width: '100%',
  maxWidth: '768px',
  boxShadow: TOKENS.cardShadow,
};

export const towerNameStyle = (selected: boolean): React.CSSProperties => ({
  fontFamily: TOKENS.fontDisplay,
  fontSize: '14px',
  fontWeight: 700,
  color: selected ? '#fff' : TOKENS.textBody,
});

/** Tower cost display — golden, same color regardless of selection / 塔费用显示 — 金色，选中状态不变色 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export const towerCostStyle = (_selected?: boolean): React.CSSProperties => ({
  fontSize: '15px',
  fontWeight: 800,
  color: TOKENS.gold,
});

export const towerEmojiStyle: React.CSSProperties = {
  fontSize: '36px',
  marginBottom: '4px',
};

/**
 * Upgrade mode button — golden gradient pill with 3D shadow
 * 升级模式按钮 — 金色渐变 pill + 3D 阴影
 */
export const upgradeModeButtonStyle = (active: boolean, disabled: boolean): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '10px 18px',
  background: active
    ? 'linear-gradient(180deg, #ffb300 0%, #ff8f00 100%)'
    : disabled
    ? 'linear-gradient(180deg, #e0e0e0 0%, #bdbdbd 100%)'
    : 'linear-gradient(180deg, #fff8e1 0%, #ffe082 100%)',
  border: '3px solid ' + (active ? '#e65100' : disabled ? '#9e9e9e' : '#ffb300'),
  borderRadius: TOKENS.radiusPill,
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  minWidth: '100px',
  transition: 'all ' + TOKENS.duration + ' ' + TOKENS.ease,
  fontFamily: TOKENS.fontBody,
  boxShadow: '0 4px 0 0 ' + (active ? '#e65100' : disabled ? '#9e9e9e' : '#dba90e'),
  color: active ? '#fff' : disabled ? '#9e9e9e' : TOKENS.textBody,
});

/**
 * Upgrade mode button phone variant / 升级模式按钮手机端紧凑版
 */
export const upgradeModeButtonPhoneStyle = (active: boolean, disabled: boolean): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '6px 10px',
  background: active
    ? 'linear-gradient(180deg, #ffb300 0%, #ff8f00 100%)'
    : disabled
    ? 'linear-gradient(180deg, #e0e0e0 0%, #bdbdbd 100%)'
    : 'linear-gradient(180deg, #fff8e1 0%, #ffe082 100%)',
  border: '2px solid ' + (active ? '#e65100' : disabled ? '#9e9e9e' : '#ffb300'),
  borderRadius: TOKENS.radiusPill,
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  minWidth: '60px',
  transition: 'all ' + TOKENS.duration + ' ' + TOKENS.ease,
  boxShadow: '0 3px 0 0 ' + (active ? '#e65100' : disabled ? '#9e9e9e' : '#dba90e'),
  color: active ? '#fff' : disabled ? '#9e9e9e' : TOKENS.textBody,
});

// ============================================
// OVERLAY STYLES / 覆盖层样式
// ============================================

/** Full-screen overlay — warm cream with blur / 全屏覆盖层 — 奶油色 + 模糊 */
export const overlayContainerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(247, 243, 223, 0.96)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: TOKENS.radius,
  zIndex: 100,
};

/** Overlay title — warm brown, large / 覆盖层标题 — 暖棕，大号 */
export const overlayTitleStyle: React.CSSProperties = {
  fontFamily: TOKENS.fontDisplay,
  fontSize: '56px',
  fontWeight: 700,
  color: TOKENS.text,
  textShadow: '2px 2px 0 rgba(255,255,255,0.9), 4px 4px 0 rgba(121,79,39,0.1)',
  marginBottom: '20px',
  letterSpacing: '2px',
};

export const overlaySubtitleStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 600,
  color: TOKENS.textMuted,
  marginBottom: '30px',
};

export const overlayScoreStyle: React.CSSProperties = {
  fontFamily: TOKENS.fontDisplay,
  fontSize: '36px',
  fontWeight: 800,
  color: TOKENS.gold,
  margin: '20px 0',
};

export const instructionsBoxStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.95)',
  padding: '20px 28px',
  borderRadius: TOKENS.radius,
  marginBottom: '30px',
  textAlign: 'center',
  maxWidth: '500px',
  border: '2px solid ' + TOKENS.border,
  boxShadow: TOKENS.cardShadow,
};

export const instructionTextStyle: React.CSSProperties = {
  color: TOKENS.textBody,
  fontSize: '16px',
  fontWeight: 500,
  margin: '8px 0',
  lineHeight: 1.6,
};

export const pauseOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(247, 243, 223, 0.92)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: TOKENS.radius,
  zIndex: 100,
};

// ============================================
// PHONE-SPECIFIC STYLES / 手机专用样式
// ============================================

/** Tower panel as floating bottom overlay on phone / 手机端浮动底部工具栏 */
export const towerPanelPhoneStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  gap: '6px',
  padding: '8px 6px',
  paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(247,243,223,0.97) 100%)',
  borderTop: '2.5px solid ' + TOKENS.border,
  borderTopLeftRadius: TOKENS.radius,
  borderTopRightRadius: TOKENS.radius,
  zIndex: 200,
  backdropFilter: 'blur(8px)',
};

/** Compact tower button for phone / 手机端紧凑按钮 */
export const towerButtonPhoneStyle = ({ selected, disabled }: ButtonStyleParams): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '6px 10px',
  background: selected
    ? 'linear-gradient(180deg, ' + TOKENS.primaryHover + ' 0%, ' + TOKENS.primary + ' 100%)'
    : 'linear-gradient(180deg, #fff 0%, ' + TOKENS.bgContent + ' 100%)',
  border: '2px solid ' + (selected ? TOKENS.primaryActive : TOKENS.border),
  borderRadius: TOKENS.radiusPill,
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  minWidth: '70px',
  transition: 'all ' + TOKENS.duration + ' ' + TOKENS.ease,
  fontFamily: TOKENS.fontBody,
  boxShadow: '0 4px 0 0 ' + (selected ? TOKENS.primaryActive : TOKENS.shadowBtn),
  color: selected ? '#fff' : TOKENS.textBody,
  fontWeight: selected ? 700 : 600,
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
  background: 'linear-gradient(90deg, ' + TOKENS.bgContent + ', #fff, ' + TOKENS.bgContent + ')',
  borderRadius: TOKENS.radiusSm,
  border: '2px solid ' + TOKENS.border,
  fontFamily: TOKENS.fontBody,
  fontSize: '11px',
  fontWeight: 600,
  color: TOKENS.textBody,
  gap: '4px',
  rowGap: '4px',
};

export const hudStatBoxPhoneStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  padding: '3px 6px',
  background: 'rgba(255,255,255,0.85)',
  borderRadius: '8px',
  whiteSpace: 'nowrap',
  fontSize: '11px',
  border: '1px solid ' + TOKENS.border,
};

export const hudTowerCountPhoneStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  padding: '3px 6px',
  background: 'rgba(25, 200, 185, 0.12)',
  borderRadius: '8px',
  whiteSpace: 'nowrap',
  fontSize: '11px',
  border: '1px solid ' + TOKENS.primary,
};

export const hudSpeedPhoneStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  padding: '3px 6px',
  background: 'rgba(245, 195, 28, 0.15)',
  borderRadius: '8px',
  whiteSpace: 'nowrap',
  fontSize: '11px',
  border: '1px solid ' + TOKENS.warning,
};

// ============================================
// TUTORIAL & ANNOUNCEMENT STYLES / 教程和公告样式
// ============================================

/** Tutorial overlay container — semi-transparent canvas overlay / 教程覆盖层容器 */
export const tutorialOverlayContainer: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: TOKENS.radius,
  zIndex: 90,
  pointerEvents: 'none',
};

/** Tutorial text box — warm white with mint border / 教程文本框 — 暖白底 + 薄荷边框 */
export const tutorialTextBox: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.97)',
  padding: '16px 28px',
  borderRadius: TOKENS.radius,
  border: '2.5px solid ' + TOKENS.primary,
  fontFamily: TOKENS.fontBody,
  fontSize: '18px',
  fontWeight: 700,
  color: TOKENS.textBody,
  boxShadow: '0 6px 24px rgba(25, 200, 185, 0.2)',
  textAlign: 'center',
  animation: 'tutorialBounce 1s ease-in-out infinite',
  maxWidth: '400px',
  pointerEvents: 'none',
};

export const tutorialArrow: React.CSSProperties = {
  fontSize: '32px',
  animation: 'tutorialBounce 0.8s ease-in-out infinite',
  marginTop: '8px',
};

/** Level announcement overlay — mint green badge / 关卡公告 — 薄荷绿徽章 */
export const levelAnnouncementOverlay: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: TOKENS.primary,
  color: '#fff',
  padding: '20px 44px',
  borderRadius: TOKENS.radiusPill,
  fontSize: '28px',
  fontWeight: 700,
  fontFamily: TOKENS.fontDisplay,
  boxShadow: '0 6px 30px rgba(25, 200, 185, 0.35)',
  textAlign: 'center',
  animation: 'tutorialBounce 0.6s ease-out',
  zIndex: 100,
  pointerEvents: 'none',
};

export const levelAnnouncementSubtitle: React.CSSProperties = {
  fontSize: '18px',
  fontFamily: TOKENS.fontBody,
  fontWeight: 600,
  marginTop: '8px',
  color: 'rgba(255, 255, 255, 0.9)',
};

// ============================================
// UPGRADE POPUP STYLES / 升级弹出框样式
// ============================================

/** Upgrade popup container — warm cream floating panel / 升级弹出框容器 — 暖奶油色浮动面板 */
export const upgradePopupContainerStyle: React.CSSProperties = {
  position: 'absolute',
  background: 'linear-gradient(180deg, #fff 0%, ' + TOKENS.bgContent + ' 100%)',
  border: '2.5px solid ' + TOKENS.border,
  borderRadius: TOKENS.radius,
  padding: '14px 18px',
  fontFamily: TOKENS.fontBody,
  fontSize: '13px',
  fontWeight: 500,
  color: TOKENS.textBody,
  boxShadow: '0 4px 16px rgba(61, 52, 40, 0.12)',
  zIndex: 95,
  minWidth: '170px',
  pointerEvents: 'auto',
};

/** Upgrade popup action button — mint pill with 3D shadow / 升级弹出框操作按钮 — 薄荷 pill + 3D 阴影 */
export const upgradePopupButtonStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px 14px',
  marginTop: '6px',
  border: 'none',
  borderRadius: TOKENS.radiusPill,
  fontFamily: TOKENS.fontDisplay,
  fontSize: '14px',
  fontWeight: 700,
  cursor: 'pointer',
  background: 'linear-gradient(180deg, ' + TOKENS.primary + ' 0%, ' + TOKENS.primaryActive + ' 100%)',
  color: '#fff',
  boxShadow: '0 3px 0 0 ' + TOKENS.primaryActive,
  transition: 'all ' + TOKENS.durationFast + ' ' + TOKENS.ease,
};

/** Upgrade popup close (X) button / 升级弹出框关闭按钮 */
export const upgradePopupCloseStyle: React.CSSProperties = {
  position: 'absolute',
  top: '4px',
  right: '8px',
  background: 'none',
  border: 'none',
  fontSize: '18px',
  fontWeight: 700,
  cursor: 'pointer',
  color: TOKENS.textSecondary,
  fontFamily: TOKENS.fontBody,
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all ' + TOKENS.durationFast + ' ' + TOKENS.ease,
};
