/**
 * Tower Panel Component / 防御塔选择面板组件
 * 
 * Displays available towers with selection state and optional upgrade mode toggle.
 * 显示可选防御塔、选择状态以及可选的升级模式切换按钮。
 */

import type { Language } from '../types';
import { TEXT } from '../i18n';
import { TOWER_TYPES } from '../constants';
import {
  towerPanelStyle, towerPanelPhoneStyle,
  towerButtonStyle, towerButtonPhoneStyle,
  towerEmojiStyle, towerNameStyle, towerCostStyle,
  upgradeModeButtonStyle, upgradeModeButtonPhoneStyle,
} from '../styles';

interface TowerPanelProps {
  selectedTowerType: number;
  gold: number;
  onSelectTower: (type: number) => void;
  lang: Language;

  // Upgrade mode props (optional) / 升级模式属性（可选）
  /** Whether upgrade mode is active / 升级模式是否激活 */
  upgradeMode?: boolean;
  /** Toggle upgrade mode callback / 切换升级模式回调 */
  onToggleUpgradeMode?: () => void;
  /** Show upgrade mode button / 是否显示升级模式按钮 */
  showUpgradeButton?: boolean;
  /** Whether device is a phone / 是否为手机端 */
  isPhone?: boolean;
  /** Is the tower panel enabled / 面板是否可用 */
  disabled?: boolean;
}

export function TowerPanel({
  selectedTowerType, gold, onSelectTower, lang,
  upgradeMode = false, onToggleUpgradeMode,
  showUpgradeButton = false, isPhone = false,
  disabled = false,
}: TowerPanelProps) {
  const t = TEXT(lang);

  const panelStyle = isPhone ? towerPanelPhoneStyle : towerPanelStyle;
  const btnStyle = isPhone ? towerButtonPhoneStyle : towerButtonStyle;
  const upgBtnStyle = isPhone ? upgradeModeButtonPhoneStyle : upgradeModeButtonStyle;
  const emojiSize = isPhone ? '28px' : '36px';
  const emojiMb = isPhone ? '2px' : '5px';
  const costSize = isPhone ? '14px' : '16px';

  return (
    <div style={panelStyle}>
      {/* Tower type buttons / 防御塔类型按钮 */}
      {TOWER_TYPES.map((tower, index) => (
        <button
          key={tower.name}
          onClick={() => onSelectTower(index)}
          disabled={gold < tower.cost}
          style={btnStyle({ selected: selectedTowerType === index, disabled: gold < tower.cost })}
        >
          <span style={{ ...towerEmojiStyle, fontSize: emojiSize, marginBottom: emojiMb }}>
            {index === 0 ? '😸' : index === 1 ? '😺' : '😻'}
          </span>
          {!isPhone && (
            <span style={towerNameStyle(selectedTowerType === index)}>
              {t.towerNames[index]}
            </span>
          )}
          <span style={{ ...towerCostStyle(selectedTowerType === index), fontSize: costSize }}>
            🪙 {tower.cost}
          </span>
        </button>
      ))}

      {/* Upgrade mode button / 升级模式按钮 */}
      {showUpgradeButton && onToggleUpgradeMode && (
        <button
          onClick={onToggleUpgradeMode}
          disabled={disabled}
          style={upgBtnStyle(upgradeMode, disabled)}
        >
          <span style={{ fontSize: isPhone ? '22px' : '28px' }}>
            {upgradeMode ? '✅' : '⬆️'}
          </span>
          {!isPhone && (
            <span style={{
              fontFamily: 'Fredoka One, cursive', fontSize: '13px',
              color: upgradeMode ? '#FFF' : '#5D4037',
            }}>
              {t.upgradeMode}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

export default TowerPanel;
