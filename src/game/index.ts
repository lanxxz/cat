/**
 * Game Configuration / 游戏配置
 * 
 * Main entry point for game configuration.
 * 游戏配置的主要入口点。
 * 
 * Re-exports all constants, types, and configurations.
 * 重新导出所有常量、类型和配置。
 */

export * from './constants';
export * from './types';
export { TEXT, TEXTS, ENEMY_TRANSLATIONS, ENEMY_DATA } from './i18n';
export type { Language } from './types';
export type { GameState } from './types';