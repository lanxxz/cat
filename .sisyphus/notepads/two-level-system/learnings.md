# Learnings - Two-Level System

## Conventions
- Game codebase uses React 18 + TypeScript + Canvas 2D
- All game state in App.tsx via useState/useRef (single component architecture)
- CSS-in-JS centralized in src/game/styles.ts
- i18n bilingual (zh/en) in src/game/i18n.ts via TEXT(lang) pattern
- Barrel exports via src/game/config.ts and src/game/index.ts

## Patterns
- Canvas coord math: scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height
- DOM overlays: absolute positioning inside canvasWrapper (position:relative)
- useRef for mutable state accessed in game loop closures (goldRef, selectedTowerRef pattern)
- setTimeout auto-dismiss pattern in useEffect (pathUnlockNotification)

## Gotchas
- Wave auto-advance callback fires when enemies cleared → must gate for Level 1
- Score mutated in TWO places (box click + enemy kill) → both need gating
- Canvas rendering has 9 layers → tutorial highlights = 10th layer
- Tower panel is DOM BELOW canvas → can't Canvas-draw tower selection guidance
- `getWaveData()` applies 15% scale → Level 1 must use raw data

## Tutorial & Announcement Styles (added)
- Tutorial overlay uses zIndex 90 (below overlays at 100) with pointerEvents: none for passthrough
- tutorialBounce keyframe defined in index.css, referenced by animation property in styles.ts
- levelAnnouncementOverlay follows similar pattern to pathUnlockNotification inline style in App.tsx
- Center-aligned overlays use top:50% + translate(-50%, -50%) with animation
- Color palette consistent: #FFB6C1 bg, white text, #5D4037 body text

## Tutorial Highlight Renderer (Task 7)
- Tutorial highlights = 10th canvas layer, rendered last via renderTutorialHighlights()
- renderGame signature updated: added tutorialStep: number = 0 (default 0 for backward compat)
- New file: src/game/renderer/tutorial.ts — exports renderTutorialHighlights(ctx, state, tutorialStep)
- Box type uses tile coords {x, y}; drawHighlight converts to pixel coords via TILE_SIZE
- Pulsing effect uses Date.now() * 0.005 in sin() → oscillates 0.4-1.0 alpha
- Step 1: golden (#FFD700) highlight on first box tile with label text
- Step 3: green (#B9F6CA) highlight on empty tile near path with label text
- Steps 2 and 4: no canvas highlights (DOM overlays handled separately)
- findBuildableTile() scans grid for empty tile adjacent to path (TILE.EMPTY=0, TILE.PATH=1)
- Type system: function accepts { map: number[][]; boxes: Box[] } compatible with both types
- Pre-existing: App.tsx _setLevel unused (tsc error unrelated to this change)
