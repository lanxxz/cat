/**
 * Tower Panel Component / 防御塔选择面板组件
 * 
 * Displays available towers for player to select.
 * 显示可供玩家选择的防御塔。
 */

import type { Language } from '../types';
import { TEXT } from '../i18n';
import { TOWER_TYPES } from '../constants';
import {
  towerPanelStyle,
  towerButtonStyle,
  towerEmojiStyle,
  towerNameStyle,
  towerCostStyle
} from '../styles';

interface TowerPanelProps {
  selectedTowerType: number;
  gold: number;
  onSelectTower: (type: number) => void;
  lang: Language;
}

/**
 * 防御塔选择面板 / Tower Selection Panel
 * 
 * Shows 3 tower types with cost and selection state.
 * 显示 3 种防御塔类型、费用和选择状态。
 */
export function TowerPanel({ selectedTowerType, gold, onSelectTower, lang }: TowerPanelProps) {
  const t = TEXT(lang);
  
  return (
    <div style={towerPanelStyle}>
      {TOWER_TYPES.map((tower, index) => (
        <button
          key={tower.name}
          onClick={() => onSelectTower(index)}
          disabled={gold < tower.cost}
          style={towerButtonStyle({ selected: selectedTowerType === index, disabled: gold < tower.cost })}
        >
          {/* 猫咪 Emoji / Cat Emoji */}
          <span style={towerEmojiStyle}>
            {index === 0 ? '😸' : index === 1 ? '😺' : '😻'}
          </span>
          
          {/* 防御塔名称 / Tower Name */}
          <span style={towerNameStyle(selectedTowerType === index)}>
            {t.towerNames[index]}
          </span>
          
          {/* 费用 / Cost */}
          <span style={towerCostStyle(selectedTowerType === index)}>
            🪙 {tower.cost}
          </span>
        </button>
      ))}
    </div>
  );
}

export default TowerPanel;