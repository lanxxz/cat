/**
 * TowerUpgradePopup - 防御塔升级弹出框组件
 * 
 * Floating popup that appears when a tower is selected in upgrade mode.
 * 在升级模式下选中防御塔时显示的浮动弹出框。
 * 
 * Features:
 * - Shows tower name, level, and stats
 * - Unlock / Upgrade / Sell actions
 * - Clamped positioning within canvas bounds
 * - Stats comparison (current → next level)
 * 
 * 功能：
 * - 显示防御塔名称、等级和属性
 * - 解锁 / 升级 / 出售操作
 * - 在画布范围内钳制定位
 * - 属性对比（当前 → 下一级）
 */

import type { Language, GameStateRef } from '../types';
import { TEXT } from '../i18n';
import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, TOWER_TYPES, getUpgradeCost, getUnlockCost, getSellValue, getTowerStats } from '../constants';
import {
  upgradePopupContainerStyle,
  upgradePopupButtonStyle,
  upgradePopupCloseStyle,
} from '../styles';

interface TowerUpgradePopupProps {
  /** Index of selected tower in towers array / 选中防御塔在数组中的索引 */
  towerIndex: number;
  /** Mutable game state ref / 可变游戏状态引用 */
  gameRef: React.MutableRefObject<GameStateRef>;
  /** Current gold / 当前金币 */
  gold: number;
  /** Current language / 当前语言 */
  lang: Language;
  /** Canvas ref for coordinate scaling / 画布引用，用于坐标缩放 */
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** Callback to close the popup / 关闭弹出框的回调 */
  onClose: () => void;
  /** Upgrade handler ref / 升级处理器引用 */
  handleUpgradeRef: React.MutableRefObject<(index: number) => void>;
  /** Sell handler ref / 出售处理器引用 */
  handleSellRef: React.MutableRefObject<(index: number) => void>;
}

/**
 * TowerUpgradePopup component / 防御塔升级弹出框组件
 * 
 * Renders a floating action panel above the selected tower
 * with upgrade/sell options and stat comparison.
 * 在选中防御塔上方渲染悬浮操作面板，包含升级/出售选项和属性对比。
 */
export function TowerUpgradePopup({
  towerIndex, gameRef, gold, lang, canvasRef,
  onClose, handleUpgradeRef, handleSellRef,
}: TowerUpgradePopupProps) {
  const tower = gameRef.current.towers[towerIndex];
  if (!tower) return null;

  const t = TEXT(lang);

  // Calculate CSS-to-canvas scale for positioning / 计算画布缩放比例
  const canvasEl = canvasRef.current;
  const scaleX = canvasEl ? canvasEl.width / canvasEl.clientWidth : 1;
  const scaleY = canvasEl ? canvasEl.height / canvasEl.clientHeight : 1;

  const towerType = TOWER_TYPES[tower.type];
  const isUnlocked = gameRef.current.upgradeUnlocked[tower.type];
  const upgradeCost = getUpgradeCost(tower.type, tower.level);
  const unlockCost = getUnlockCost(gameRef.current.towers.length);
  const sellValue = getSellValue(tower);
  const stats = getTowerStats(tower.type, tower.level);
  const nextStats = tower.level < 5 ? getTowerStats(tower.type, tower.level + 1) : null;

  // Popup position: centered above tower, clamped to canvas bounds
  // 弹出框位置：在防御塔上方居中，钳制在画布范围内
  const popupX = Math.min(
    Math.max(tower.x / scaleX - 80, 0),
    (GRID_WIDTH * TILE_SIZE) / scaleX - 180,
  );
  const popupY = Math.min(
    Math.max(tower.y / scaleY - 130, 0),
    (GRID_HEIGHT * TILE_SIZE) / scaleY - 160,
  );

  return (
    <div style={{ ...upgradePopupContainerStyle, left: popupX, top: popupY }}>
      {/* Close button / 关闭按钮 */}
      <button style={upgradePopupCloseStyle} onClick={onClose}>✕</button>

      {/* Tower name and level / 防御塔名称和等级 */}
      <div style={{ fontWeight: 700, fontSize: '14px' }}>
        {t.towerNames?.[tower.type] || towerType.name} Lv.{tower.level}
      </div>

      {!isUnlocked ? (
        /* Locked state: show unlock cost and button / 锁定状态：显示解锁费用和按钮 */
        <>
          <div style={{ marginTop: '4px', fontSize: '12px' }}>
            🔒 {t.unlock}: {unlockCost}🪙
          </div>
          <button
            style={{ ...upgradePopupButtonStyle, opacity: gold < unlockCost ? 0.5 : 1 }}
            onClick={() => handleUpgradeRef.current(towerIndex)}
            disabled={gold < unlockCost}
          >
            {t.unlock} ({unlockCost}🪙)
          </button>
        </>
      ) : upgradeCost !== null ? (
        /* Unlocked and upgradable: show stats comparison / 已解锁且可升级：显示属性对比 */
        <>
          <div style={{ marginTop: '4px', fontSize: '12px' }}>
            {t.damage}: {stats.damage} → {nextStats!.damage}
          </div>
          <div style={{ fontSize: '12px' }}>
            {t.range}: {stats.range} → {nextStats!.range}
          </div>
          <button
            style={{ ...upgradePopupButtonStyle, opacity: gold < upgradeCost ? 0.5 : 1 }}
            onClick={() => handleUpgradeRef.current(towerIndex)}
            disabled={gold < upgradeCost}
          >
            {t.upgrade} ({upgradeCost}🪙)
          </button>
        </>
      ) : (
        /* Max level: show MAX badge / 已满级：显示 MAX 标签 */
        <div style={{ marginTop: '6px', fontWeight: 700, color: '#FFD700' }}>
          ⭐ {t.maxLevel}
        </div>
      )}

      {/* Sell button (always visible) / 出售按钮（始终显示） */}
      <button
        style={{
          ...upgradePopupButtonStyle,
          background: 'linear-gradient(180deg, #8D6E63 0%, #5D4037 100%)',
        }}
        onClick={() => handleSellRef.current(towerIndex)}
      >
        💰 {t.sell} ({sellValue}🪙)
      </button>
    </div>
  );
}

export default TowerUpgradePopup;
