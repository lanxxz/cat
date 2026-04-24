/**
 * Keyboard Handler / 键盘处理
 * 
 * 键盘事件处理逻辑
 * @module keyboard
 */

import type React from 'react';

/**
 * 创建键盘事件监听 / Create keyboard event listener
 * @param gameState - 当前游戏状态
 * @param onTogglePause - 切换暂停回调
 * @returns 清理函数
 */
export function createKeyboardHandler(
  gameState: string,
  onTogglePause: () => void
): () => void {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && gameState === 'playing') {
      onTogglePause();
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * 启动键盘监听 / Start keyboard listener
 */
export function useKeyboardHandler(
  gameState: string,
  onTogglePause: () => void
): React.EffectCallback {
  return () => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && gameState === 'playing') {
        onTogglePause();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  };
}