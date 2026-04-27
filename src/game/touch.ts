/**
 * Touch Interaction Hook / 触控交互钩子
 * 
 * @deprecated 未使用 - App.tsx 直接使用内联 onPointerDown/onPointerMove 处理事件。保留供参考。
 * Unused - App.tsx uses inline onPointerDown/onPointerMove events instead. Kept for reference.
 * 
 * Provides pointer event handlers with coordinate scaling for both
 * mouse and touch input. Replaces onClick/onMouseMove with unified
 * pointer events that work on all devices.
 * 提供带坐标缩放的指针事件处理器，同时支持鼠标和触控输入。
 * 用统一的指针事件替换 onClick/onMouseMove，适用于所有设备。
 */

import { useRef, useCallback } from 'react';
import { scaleClientToCanvas } from './responsive';
import { TILE_SIZE } from './constants';

export interface TouchCallbacks {
  /** Called on pointer down — for tower placement and box breaking */
  onTap: (tileX: number, tileY: number) => void;
  /** Called on pointer move — for hover tile preview */
  onHover: (tileX: number, tileY: number) => void;
}

/**
 * Hook: Returns pointer event handlers that properly scale
 * client coordinates to canvas tile coordinates.
 * 返回正确将客户端坐标映射到画布网格坐标的指针事件处理器。
 * 
 * Usage in JSX:
 *   <canvas {...touchHandlers} ... />
 */
export function useTouchInteraction(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  callbacks: TouchCallbacks
) {
  // Keep callbacks in a ref to avoid re-binding on every render
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  const getTileFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const { x, y } = scaleClientToCanvas(
        clientX,
        clientY,
        rect,
        canvas.width,
        canvas.height
      );
      return {
        tileX: Math.floor(x / TILE_SIZE),
        tileY: Math.floor(y / TILE_SIZE),
      };
    },
    [canvasRef]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const tile = getTileFromEvent(e.clientX, e.clientY);
      if (tile) {
        callbacksRef.current.onTap(tile.tileX, tile.tileY);
      }
      // Prevent default to avoid touch scrolling/zooming on the canvas
      e.preventDefault();
    },
    [getTileFromEvent]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const tile = getTileFromEvent(e.clientX, e.clientY);
      if (tile) {
        callbacksRef.current.onHover(tile.tileX, tile.tileY);
      }
    },
    [getTileFromEvent]
  );

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
  };
}
