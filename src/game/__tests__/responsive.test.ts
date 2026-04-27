/**
 * Tests for responsive scaling utilities / 响应式缩放工具测试
 */

import { describe, it, expect } from 'vitest';
import {
  getDeviceCategory,
  scaleClientToCanvas,
  RESPONSIVE_BREAKPOINTS,
} from '../responsive';

describe('getDeviceCategory', () => {
  it('returns phone for width ≤ 480', () => {
    expect(getDeviceCategory(320)).toBe('phone');
    expect(getDeviceCategory(375)).toBe('phone');
    expect(getDeviceCategory(480)).toBe('phone');
  });

  it('returns tablet for width 481–767', () => {
    expect(getDeviceCategory(481)).toBe('tablet');
    expect(getDeviceCategory(600)).toBe('tablet');
    expect(getDeviceCategory(767)).toBe('tablet');
  });

  it('returns desktop for width ≥ 768', () => {
    expect(getDeviceCategory(768)).toBe('desktop');
    expect(getDeviceCategory(1024)).toBe('desktop');
    expect(getDeviceCategory(1920)).toBe('desktop');
  });
});

describe('scaleClientToCanvas', () => {
  const canvasWidth = 768;
  const canvasHeight = 512;

  function makeRect(
    left: number,
    top: number,
    width: number,
    height: number
  ): DOMRect {
    return {
      x: left,
      y: top,
      left,
      top,
      right: left + width,
      bottom: top + height,
      width,
      height,
      toJSON: () => ({}),
    } as DOMRect;
  }

  it('returns identity when canvas is full-size (no CSS scaling)', () => {
    const rect = makeRect(0, 0, canvasWidth, canvasHeight);
    const result = scaleClientToCanvas(
      100,
      200,
      rect,
      canvasWidth,
      canvasHeight
    );
    expect(result.x).toBe(100);
    expect(result.y).toBe(200);
  });

  it('scales coordinates when canvas is CSS-scaled to half width', () => {
    // Canvas displayed at 384px wide (half of native 768px)
    const displayWidth = 384;
    const displayHeight = 256; // half of 512
    const rect = makeRect(0, 0, displayWidth, displayHeight);

    const result = scaleClientToCanvas(
      100, // tap at display x=100
      50, // tap at display y=50
      rect,
      canvasWidth,
      canvasHeight
    );
    // 100 * (768/384) = 200
    expect(result.x).toBeCloseTo(200);
    expect(result.y).toBeCloseTo(100);
  });

  it('scales when canvas is 40% width (phone)', () => {
    // 768 * 0.4 = 307.2, 512 * 0.4 = 204.8
    const displayWidth = 307.2;
    const displayHeight = 204.8;
    const rect = makeRect(10, 10, displayWidth, displayHeight);

    const result = scaleClientToCanvas(
      60 + 10, // clientX = rect.left + offset within canvas
      30 + 10,
      rect,
      canvasWidth,
      canvasHeight
    );
    expect(result.x).toBeCloseTo(150); // 60 * 768/307.2
    expect(result.y).toBeCloseTo(75); // 30 * 512/204.8
  });

  it('handles canvas offset from viewport edge', () => {
    const rect = makeRect(20, 30, canvasWidth, canvasHeight);
    const result = scaleClientToCanvas(
      120, // clientX = 20 (rect.left) + 100 (within canvas)
      230,
      rect,
      canvasWidth,
      canvasHeight
    );
    expect(result.x).toBe(100);
    expect(result.y).toBe(200);
  });

  it('handles no-scaling case with offset canvas', () => {
    // Desktop: canvas at full size but not at (0,0)
    const rect = makeRect(50, 20, canvasWidth, canvasHeight);
    const result = scaleClientToCanvas(150, 120, rect, canvasWidth, canvasHeight);
    expect(result.x).toBe(100); // 150 - 50
    expect(result.y).toBe(100); // 120 - 20
  });

  it('handles edge: client at top-left corner of canvas', () => {
    const rect = makeRect(100, 50, canvasWidth, canvasHeight);
    const result = scaleClientToCanvas(100, 50, rect, canvasWidth, canvasHeight);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it('handles edge: client at bottom-right corner of canvas when scaled', () => {
    const displayWidth = 384;
    const displayHeight = 256;
    const rect = makeRect(0, 0, displayWidth, displayHeight);
    const result = scaleClientToCanvas(384, 256, rect, canvasWidth, canvasHeight);
    expect(result.x).toBeCloseTo(768);
    expect(result.y).toBeCloseTo(512);
  });
});

describe('RESPONSIVE_BREAKPOINTS', () => {
  it('has correct values', () => {
    expect(RESPONSIVE_BREAKPOINTS.PHONE_MAX).toBe(480);
    expect(RESPONSIVE_BREAKPOINTS.TABLET_MAX).toBe(767);
    expect(RESPONSIVE_BREAKPOINTS.DESKTOP_MIN).toBe(768);
  });
});
