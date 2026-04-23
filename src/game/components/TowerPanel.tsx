/**
 * Tower Panel Component / 防御塔选择面板组件
 * 
 * Displays available towers for player to select.
 * 显示可供玩家选择的防御塔。
 */

import type { Language } from '../types';
import { TEXT } from '../i18n';
import { TOWER_TYPES } from '../constants';

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
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: '15px', 
      padding: '15px', 
      background: 'linear-gradient(180deg, #FFF 0%, #FCE4EC 100%)', 
      borderRadius: '20px', 
      border: '4px solid #FFB6C1', 
      width: '768px' 
    }}>
      {TOWER_TYPES.map((tower, index) => (
        <button
          key={tower.name}
          onClick={() => onSelectTower(index)}
          disabled={gold < tower.cost}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '12px 20px',
            background: selectedTowerType === index 
              ? 'linear-gradient(180deg, #FF80AB 0%, #FF4081 100%)' 
              : 'linear-gradient(180deg, #FFF 0%, #F8BBD9 100%)',
            border: `3px solid ${selectedTowerType === index ? '#C51162' : '#FF80AB'}`,
            borderRadius: '15px',
            cursor: gold < tower.cost ? 'not-allowed' : 'pointer',
            opacity: gold < tower.cost ? 0.5 : 1,
            minWidth: '140px',
            transition: 'all 0.2s ease',
            fontFamily: 'Nunito, sans-serif'
          }}
        >
          {/* 猫咪 Emoji / Cat Emoji */}
          <span style={{ fontSize: '36px', marginBottom: '5px' }}>
            {index === 0 ? '😸' : index === 1 ? '😺' : '😻'}
          </span>
          
          {/* 防御塔名称 / Tower Name */}
          <span style={{ 
            fontFamily: 'Fredoka One, cursive', 
            fontSize: '14px', 
            color: selectedTowerType === index ? 'white' : '#5D4037' 
          }}>
            {t.towerNames[index]}
          </span>
          
          {/* 费用 / Cost */}
          <span style={{ 
            fontSize: '16px', 
            color: selectedTowerType === index ? 'white' : '#FFA000', 
            fontWeight: 800 
          }}>
            🪙 {tower.cost}
          </span>
        </button>
      ))}
    </div>
  );
}

export default TowerPanel;