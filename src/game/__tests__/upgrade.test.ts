/**
 * Tests for getTowerStats pure function / getTowerStats 纯函数测试
 * 
 * Tests upgrade system stats calculation (damage, range, attackSpeed)
 * 验证升级系统属性计算（伤害、范围、攻击速度）
 */

import { describe, it, expect } from 'vitest';
import { getTowerStats, getLevelDisplayConfig, getUpgradeCost, getSellValue, getUnlockCost, LEVEL_BADGE_FONT, LEVEL_BADGE_OFFSET } from '../constants';
import { spawnUpgradeParticles, createUpgradeGlowState, updateUpgradeGlow } from '../gameEngine';

describe('spawnUpgradeParticles', () => {
  it('adds 20 particles to state', () => {
    const mockState: any = { particles: [] };
    spawnUpgradeParticles(mockState, 3, 5);
    expect(mockState.particles.length).toBe(20);
  });

  it('all spawned particles have color #FFD700', () => {
    const mockState: any = { particles: [] };
    spawnUpgradeParticles(mockState, 3, 5);
    expect(mockState.particles.every((p: any) => p.color === '#FFD700')).toBe(true);
  });
});

describe('createUpgradeGlowState', () => {
  it('returns inactive state with zero values', () => {
    const state = createUpgradeGlowState();
    expect(state).toEqual({ active: false, towerX: 0, towerY: 0, frame: 0 });
  });
});

describe('updateUpgradeGlow', () => {
  it('decrements frame counter', () => {
    const state = { active: true, towerX: 100, towerY: 200, frame: 10 };
    updateUpgradeGlow(state as any);
    expect(state.frame).toBe(9);
  });

  it('deactivates when frame reaches 0', () => {
    const state = { active: true, towerX: 100, towerY: 200, frame: 1 };
    updateUpgradeGlow(state as any);
    expect(state.active).toBe(false);
    expect(state.frame).toBe(0);
  });
});

describe('getTowerStats', () => {
  // Tower types: 0=Tabby (damage=15, range=100, attackSpeed=500)
  //              1=Siamese (damage=50, range=200, attackSpeed=1500)
  //              2=Orange (damage=25, range=120, attackSpeed=1000)
  
  describe('damage calculation / 伤害计算', () => {
    it('Level 1 Tabby damage equals base (15)', () => {
      // Tabby base damage = 15
      const stats = getTowerStats(0, 1);
      expect(stats.damage).toBe(15);
    });

    it('Level 5 Tabby damage = 15 * 1.2^4 = 31', () => {
      // 15 * 1.2^4 = 15 * 2.0736 = 31.104 -> round to 31
      const stats = getTowerStats(0, 5);
      expect(stats.damage).toBe(31);
    });

    it('Level 3 Siamese damage = 50 * 1.2^2 = 72', () => {
      // 50 * 1.2^2 = 50 * 1.44 = 72
      const stats = getTowerStats(1, 3);
      expect(stats.damage).toBe(72);
    });
  });

  describe('range calculation / 范围计算', () => {
    it('Level 5 Orange range = 120 * 1.05^4 = 146', () => {
      // 120 * 1.05^4 = 120 * 1.21550625 = 145.86075 -> round to 146
      const stats = getTowerStats(2, 5);
      expect(stats.range).toBe(146);
    });
  });

  describe('level clamping / 等级钳制', () => {
    it('Level 6 clamps to level 5 (returns level 5 stats)', () => {
      const stats = getTowerStats(0, 6);
      const level5Stats = getTowerStats(0, 5);
      expect(stats.damage).toBe(level5Stats.damage);
      expect(stats.range).toBe(level5Stats.range);
    });

    it('Level 0 clamps to level 1 (returns level 1 stats)', () => {
      const stats = getTowerStats(0, 0);
      const level1Stats = getTowerStats(0, 1);
      expect(stats.damage).toBe(level1Stats.damage);
      expect(stats.range).toBe(level1Stats.range);
    });

    it('Level -1 clamps to level 1', () => {
      const stats = getTowerStats(0, -1);
      expect(stats.damage).toBe(15); // Base damage
      expect(stats.range).toBe(100); // Base range
    });
  });

  describe('attack speed unchanged / 攻击速度不变', () => {
    it('Tabby attack speed = 500ms at all levels', () => {
      expect(getTowerStats(0, 1).attackSpeed).toBe(500);
      expect(getTowerStats(0, 2).attackSpeed).toBe(500);
      expect(getTowerStats(0, 5).attackSpeed).toBe(500);
    });

    it('Siamese attack speed = 1500ms at all levels', () => {
      expect(getTowerStats(1, 1).attackSpeed).toBe(1500);
      expect(getTowerStats(1, 3).attackSpeed).toBe(1500);
      expect(getTowerStats(1, 5).attackSpeed).toBe(1500);
    });

    it('Orange attack speed = 1000ms at all levels', () => {
      expect(getTowerStats(2, 1).attackSpeed).toBe(1000);
      expect(getTowerStats(2, 3).attackSpeed).toBe(1000);
      expect(getTowerStats(2, 5).attackSpeed).toBe(1000);
    });
  });
});

describe('getLevelDisplayConfig', () => {
  describe('glow color / 光环颜色', () => {
    it('level 1 has no glow (null)', () => {
      const config = getLevelDisplayConfig(1);
      expect(config.glowColor).toBe(null);
    });

    it('level 2 glowColor is #4CAF50 (green)', () => {
      const config = getLevelDisplayConfig(2);
      expect(config.glowColor).toBe('#4CAF50');
    });

    it('level 5 glowColor is #FFD700 (gold)', () => {
      const config = getLevelDisplayConfig(5);
      expect(config.glowColor).toBe('#FFD700');
    });
  });

  describe('badge color / 徽章颜色', () => {
    it('level 3 badgeColor is #2196F3 (blue)', () => {
      const config = getLevelDisplayConfig(3);
      expect(config.badgeColor).toBe('#2196F3');
    });
  });

  describe('badge text / 徽章文字', () => {
    it('level 3 badgeText is "Lv.3"', () => {
      const config = getLevelDisplayConfig(3);
      expect(config.badgeText).toBe('Lv.3');
    });

    it('level 5 badgeText is "Lv.5"', () => {
      const config = getLevelDisplayConfig(5);
      expect(config.badgeText).toBe('Lv.5');
    });
  });

  describe('constants / 常量', () => {
    it('LEVEL_BADGE_FONT is defined', () => {
      expect(LEVEL_BADGE_FONT).toBe('bold 11px Fredoka One');
    });

    it('LEVEL_BADGE_OFFSET is defined', () => {
      expect(LEVEL_BADGE_OFFSET).toEqual({ x: 18, y: -18 });
    });
  });
});

describe('getUpgradeCost', () => {
  it('Tabby Lv1→Lv2 cost = 100', () => {
    expect(getUpgradeCost(0, 1)).toBe(100);
  });
  it('Tabby Lv2→Lv3 cost = 200', () => {
    expect(getUpgradeCost(0, 2)).toBe(200);
  });
  it('Tabby Lv4→Lv5 cost = 800', () => {
    expect(getUpgradeCost(0, 4)).toBe(800);
  });
  it('Siamese Lv1→Lv2 cost = 150', () => {
    expect(getUpgradeCost(1, 1)).toBe(150);
  });
  it('Orange Lv1→Lv2 cost = 200', () => {
    expect(getUpgradeCost(2, 1)).toBe(200);
  });
  it('Level 5 returns null (MAX)', () => {
    expect(getUpgradeCost(0, 5)).toBeNull();
  });
});

describe('getSellValue', () => {
  it('Level 1 Tabby sell = 25', () => {
    const tower = { x: 0, y: 0, type: 0, lastAttack: 0, angle: 0, level: 1, totalInvested: 50 };
    expect(getSellValue(tower)).toBe(25);
  });
  it('Level 3 Tabby sell = 175', () => {
    const tower = { x: 0, y: 0, type: 0, lastAttack: 0, angle: 0, level: 3, totalInvested: 350 };
    expect(getSellValue(tower)).toBe(175);
  });
  it('Level 5 Siamese sell = 1162', () => {
    const tower = { x: 0, y: 0, type: 1, lastAttack: 0, angle: 0, level: 5, totalInvested: 2325 };
    expect(getSellValue(tower)).toBe(1162);
  });
});

describe('getUnlockCost', () => {
  it('5 towers → 500', () => {
    expect(getUnlockCost(5)).toBe(500);
  });
  it('25 towers → capped at 2000', () => {
    expect(getUnlockCost(25)).toBe(2000);
  });
  it('1 tower → 100', () => {
    expect(getUnlockCost(1)).toBe(100);
  });
});