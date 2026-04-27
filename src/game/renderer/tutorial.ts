/**
 * Tutorial Highlight Renderer / 教程高亮渲染器
 * 
 * Renders canvas-drawn pulsing highlights to guide the player through tutorial steps.
 * 在画布上绘制脉动高亮效果，引导玩家完成教程步骤。
 * 
 * Layer 10 (rendered last, on top of all other layers).
 */

import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT } from '../constants';
import type { Box } from '../types';

/**
 * Render tutorial highlights on canvas
 * 在画布上渲染教程高亮
 * 
 * Draws pulsing borders on target tiles to guide the player through interactions.
 * 在目标格子上绘制脉动边框，引导玩家进行操作。
 * 
 * @param ctx - Canvas rendering context
 * @param state - Game state (map and boxes needed)
 * @param tutorialStep - Current tutorial step (0 = no highlights)
 */
export function renderTutorialHighlights(
  ctx: CanvasRenderingContext2D,
  state: { map: number[][]; boxes: Box[] },
  tutorialStep: number
): void {
  // No-op when tutorial is not active
  if (tutorialStep === 0) return;

  // Pulsing alpha: oscillates between 0.4 and 1.0
  const pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;

  ctx.save();

  if (tutorialStep === 1) {
    // Step 1: Highlight a box tile — guide player to click and break it
    if (state.boxes.length > 0) {
      const box = state.boxes[0];
      drawHighlight(ctx, box.x, box.y, '#FFD700', pulse, 'Click to break!');
    }
  } else if (tutorialStep === 3) {
    // Step 3: Highlight a buildable empty tile near the path
    const tile = findBuildableTile(state.map);
    if (tile) {
      drawHighlight(ctx, tile.x, tile.y, '#B9F6CA', pulse, 'Place tower here');
    }
  }
  // Steps 2 and 4: No canvas highlights
  // Step 2 uses DOM overlay for tower selection guidance
  // Step 4 uses DOM overlay for "Ready!" message

  ctx.restore();
}

/**
 * Draw a pulsing highlighted rectangle on a tile
 * 在格子上绘制脉动高亮矩形
 * 
 * @param ctx - Canvas rendering context
 * @param tileX - Tile grid X coordinate
 * @param tileY - Tile grid Y coordinate
 * @param color - Highlight color
 * @param alpha - Current pulse alpha value
 * @param label - Small label text above the tile
 */
function drawHighlight(
  ctx: CanvasRenderingContext2D,
  tileX: number,
  tileY: number,
  color: string,
  alpha: number,
  label: string
): void {
  const x = tileX * TILE_SIZE;
  const y = tileY * TILE_SIZE;
  const size = TILE_SIZE;

  // Pulsing fill overlay
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha * 0.2;
  ctx.fillRect(x, y, size, size);

  // Pulsing outer border
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 2, y + 2, size - 4, size - 4);

  // Inner glow border (subtle secondary ring)
  ctx.globalAlpha = alpha * 0.5;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 5, y + 5, size - 10, size - 10);

  ctx.globalAlpha = 1;

  // Small label text above the tile
  ctx.fillStyle = color;
  ctx.font = '10px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, x + size / 2, y - 4);
}

/**
 * Find a suitable buildable tile for tutorial step 3
 * 为教程步骤3寻找合适的可建造格子
 * 
 * Scans for an empty tile adjacent to a path tile.
 * 扫描路径相邻的空地格子。
 * 
 * @param map - 2D tile map array
 * @returns Tile coordinates or null if no suitable tile found
 */
function findBuildableTile(map: number[][]): { x: number; y: number } | null {
  // First pass: look for an empty tile adjacent to a path tile
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (map[y][x] === 0) {
        // Check all four cardinal neighbors
        const neighbors: [number, number][] = [
          [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
        ];
        for (const [nx, ny] of neighbors) {
          if (
            nx >= 0 && nx < GRID_WIDTH &&
            ny >= 0 && ny < GRID_HEIGHT &&
            map[ny][nx] === 1
          ) {
            return { x, y };
          }
        }
      }
    }
  }

  // Fallback: return any empty tile
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (map[y][x] === 0) return { x, y };
    }
  }

  return null;
}
