/**
 * Responsive Scaling Utility / 响应式缩放工具
 * 
 * Provides hooks and utilities for adapting the game canvas to different viewport sizes.
 * 提供将游戏画布适配到不同视口大小的钩子和工具函数。
 */

import { useState, useEffect } from 'react';

/**
 * ============================================
 * BREAKPOINTS / 断点
 * ============================================
 */

export const RESPONSIVE_BREAKPOINTS = {
  /** Phone max width (≤480px) / 手机最大宽度 */
  PHONE_MAX: 480,
  /** Tablet max width (≤767px) / 平板最大宽度 */
  TABLET_MAX: 767,
  /** Desktop min width (≥768px) — matches game native width / 桌面最小宽度 */
  DESKTOP_MIN: 768,
} as const;

/** Native canvas width in pixels / 原生画布宽度（像素） */
export const GAME_NATIVE_WIDTH = 768;
/** Native canvas height in pixels / 原生画布高度（像素） */
export const GAME_NATIVE_HEIGHT = 512;

/** Device category / 设备类型 */
export type DeviceCategory = 'phone' | 'tablet' | 'desktop';

/**
 * Determine device category from viewport width.
 * 根据视口宽度确定设备类型。
 */
export function getDeviceCategory(width: number): DeviceCategory {
  if (width <= RESPONSIVE_BREAKPOINTS.PHONE_MAX) return 'phone';
  if (width <= RESPONSIVE_BREAKPOINTS.TABLET_MAX) return 'tablet';
  return 'desktop';
}

/**
 * ============================================
 * RESPONSIVE INFO / 响应式信息
 * ============================================
 */

export interface ResponsiveInfo {
  /** Current viewport width in CSS pixels / 当前视口宽度 */
  width: number;
  /** Scale factor: canvas display width / native width (≤1) / 缩放因子 */
  scale: number;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  category: DeviceCategory;
}

/**
 * Hook: Reads viewport width and returns responsive info.
 * 读取视口宽度并返回响应式信息。
 * 
 * Re-renders on window resize. Device rotation is handled automatically.
 * 窗口大小改变时重新渲染。设备旋转自动处理。
 */
export function useResponsiveScale(): ResponsiveInfo {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    // Also listen for orientationchange on mobile
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const scale = Math.min(1, width / GAME_NATIVE_WIDTH);
  const category = getDeviceCategory(width);

  return {
    width,
    scale,
    isPhone: category === 'phone',
    isTablet: category === 'tablet',
    isDesktop: category === 'desktop',
    category,
  };
}

/**
 * ============================================
 * COORDINATE CONVERSION / 坐标转换
 * ============================================
 */

/**
 * Convert a client (screen) coordinate to canvas coordinate,
 * accounting for CSS scaling of the canvas element.
 * 将客户端坐标转换为画布坐标，考虑画布的CSS缩放。
 * 
 * @param clientX - Mouse/touch X in CSS pixels
 * @param clientY - Mouse/touch Y in CSS pixels
 * @param canvasRect - Result of canvas.getBoundingClientRect()
 * @param canvasWidth - canvas.width (native pixel width, e.g. 768)
 * @param canvasHeight - canvas.height (native pixel height, e.g. 512)
 * @returns Canvas coordinates in native pixels
 */
export function scaleClientToCanvas(
  clientX: number,
  clientY: number,
  canvasRect: DOMRect,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } {
  const scaleX = canvasWidth / canvasRect.width;
  const scaleY = canvasHeight / canvasRect.height;
  return {
    x: (clientX - canvasRect.left) * scaleX,
    y: (clientY - canvasRect.top) * scaleY,
  };
}
