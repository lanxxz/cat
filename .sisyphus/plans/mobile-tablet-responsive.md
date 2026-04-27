# Plan: Mobile & Tablet Responsive Adaptation

> **Goal**: Make Hajimi Defense playable on phones (320px+) and tablets while keeping desktop unchanged.
> **Approach**: CSS-scale the canvas to fit viewport, add touch events, redesign UI for mobile via media queries. Game logic untouched.

---

## 1. Architecture Overview

### Principle: Game Logic Immutable
All game systems (`combatSystem`, `waveSystem`, `mapSystem`, `gameEngine`, `renderer`) remain **100% unchanged**. The canvas renders at its native 768×512 resolution. We handle adaptation purely at the presentation layer.

### Scaling System
```
┌─────────────────────────────────────┐
│  Responsive Container               │
│  (max-width: 768px, width: 100%)    │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Canvas (native 768×512)      │  │
│  │  CSS: width: 100%,            │  │
│  │        height: auto            │  │
│  │  → Browser scales rendering   │  │
│  └───────────────────────────────┘  │
│                                     │
│  Touch coordinate conversion:       │
│    canvasX = (clientX - rect.left)  │
│            × (768 / rect.width)     │
└─────────────────────────────────────┘
```

### Breakpoints
| Name | Width | Layout |
|------|-------|--------|
| Desktop | ≥ 768px | Current layout (unchanged) |
| Tablet | 481–767px | Compact HUD, same tower panel |
| Phone | ≤ 480px | Compact HUD, overlay tower panel, scaled title |

---

## 2. Implementation Phases

### Phase 1: Responsive Scale Utility (`src/game/responsive.ts`)
- [ ] Create `useResponsiveScale()` hook
  - Reads viewport width via `ResizeObserver` or `window.innerWidth`
  - Returns `{ scale, isPhone, isTablet, isDesktop }`
  - Exports `scaleClientToCanvas(clientX, clientY, canvasRect)` utility
- [ ] Create `RESPONSIVE_BREAKPOINTS` constant
  ```ts
  PHONE_MAX = 480
  TABLET_MAX = 767
  DESKTOP_MIN = 768
  ```

### Phase 2: Touch Events (`src/game/touch.ts`)
- [ ] Create `useTouchInteraction()` hook
  - Wraps `onPointerDown` for tower placement / box breaking
  - Wraps `onPointerMove` for hover tile preview (works on mouse + touch-drag)
  - Calls `scaleClientToCanvas()` to convert coordinates
  - Prevents default on canvas to avoid scroll/zoom
- [ ] Replace `onClick` + `onMouseMove` on canvas with pointer events
- [ ] Keep mouse fallback intact (pointer events handle both)
- [ ] ON TOUCH: `onPointerMove` only fires while finger is down → intentional: hover preview shows during touch-drag for aiming

### Phase 3: Responsive Styles Overhaul (`src/game/styles.ts` + `src/index.css`)

#### 3a. Canvas Container
- [ ] `canvasWrapperStyle`: add `maxWidth: '768px'`, `width: '100%'`
- [ ] `canvasStyle`: add `width: '100%'`, `height: 'auto'`, **`touchAction: 'none'`** (prevents double-tap zoom, pinch-zoom, scroll on canvas)
- [ ] `overlayContainerStyle`: change width from `'768px'` to `'100%'`, height from `'512px'` to `'100%'`
- [ ] Add media query: `@media (max-width: 480px)` → overlay fonts scale down
- [ ] Add `touch-action: manipulation` on all interactive elements to prevent 300ms tap delay on iOS

#### 3b. HUD Responsive
- [ ] `hudContainerStyle`: change width from `'768px'` to `'100%'`, add `maxWidth: '768px'`
- [ ] Add `hudPhoneStyle` for ≤480px:
  - `flexWrap: 'wrap'`, smaller gap, smaller padding
  - Stats in 2 rows via flex-wrap (first row: wave/gold/lives/score, second row wraps below)
- [ ] Stat boxes: reduce padding/font on phone

#### 3c. Tower Panel Responsive
- [ ] `towerPanelStyle`: change width from `'768px'` to `'100%'`, add `maxWidth: '768px'`
- [ ] Add `towerPanelPhoneStyle` for ≤480px:
  - `position: 'fixed'`, `bottom: 0`, `left: 0`, `right: 0`
  - `zIndex: 200`
  - `padding-bottom: env(safe-area-inset-bottom, 8px)` — iPhone notch/home indicator safe area
  - Compact buttons (narrower, smaller padding)
- [ ] Tower button: add `towerButtonPhoneStyle` with compact sizing

#### 3d. Title Responsive
- [ ] `titleStyle`: font-size becomes responsive
  - Desktop: 48px (current)
  - Tablet: 36px
  - Phone: 24px

#### 3e. Global CSS
- [ ] `body`: remove `overflow: hidden` on phone (or change to `overflow-y: auto`)
- [ ] Add `@media (max-width: 480px)` block in `index.css`
- [ ] Add `@media (min-width: 481px) and (max-width: 767px)` block
- [ ] Add `html { -webkit-text-size-adjust: 100% }` to prevent iOS font scaling
- [ ] Consider adding `viewport-fit=cover` to index.html meta for notched iPhones

### Phase 4: HUD Component Update (`src/game/components/HUD.tsx`)
- [ ] Accept `isPhone` prop
- [ ] Apply `hudPhoneStyle` when `isPhone`
- [ ] Ensure text doesn't overflow on narrow screens
- [ ] Language toggle and pause button stay visible

### Phase 5: Tower Panel Update (`src/App.tsx`)
- [ ] Accept `isPhone` from responsive hook
- [ ] Apply phone style to tower panel when `isPhone`
- [ ] Tower panel renders as fixed bottom overlay on phone
- [ ] Add a toggle to show/hide the panel (optional tap-to-expand)

### Phase 6: Overlay Update (`src/game/components/GameOverlays.tsx`)
- [ ] Accept `isPhone` prop
- [ ] Scale overlay title font down on phone
- [ ] Instructions box: reduce max-width, font-size on phone
- [ ] Button: reduce padding/font-size on phone

### Phase 7: App Integration (`src/App.tsx`)
- [ ] Import and use `useResponsiveScale()` hook
- [ ] Import and use `useTouchInteraction()` hook
- [ ] Replace `onClick`/`onMouseMove` with touch-aware handlers
- [ ] Pass `isPhone` to HUD, GameOverlays, tower panel
- [ ] Ensure game loop works correctly with scaled canvas
- [ ] Verify `getBoundingClientRect()` coordinate math accounts for scale

### Phase 8: Coordinate Fix (Critical)
In `App.tsx`, the current `handleCanvasClick` and `handleCanvasHover` use:
```ts
const rect = canvasRef.current!.getBoundingClientRect();
const tileX = Math.floor((e.clientX - rect.left) / TILE_SIZE);
```
This is **wrong when canvas is CSS-scaled**. Since `rect.width` may be < 768px, one CSS pixel represents more than one canvas pixel. Must fix to:
```ts
const rect = canvasRef.current!.getBoundingClientRect();
const scaleX = canvas.width / rect.width;
const canvasX = (e.clientX - rect.left) * scaleX;
const tileX = Math.floor(canvasX / TILE_SIZE);
```

### Phase 9: Basic Tests (`src/game/__tests__/responsive.test.ts`)
- [ ] Test `scaleClientToCanvas()` with known inputs
- [ ] Test `useResponsiveScale()` breakpoint detection
- [ ] Test that coordinate conversion is correct at different scale factors

---

## 3. File Manifest

| File | Action | Description |
|------|--------|-------------|
| `src/game/responsive.ts` | **NEW** | Scale hook + utility + breakpoint constants |
| `src/game/touch.ts` | **NEW** | Touch interaction hook with coordinate scaling |
| `src/game/styles.ts` | **MODIFY** | Add responsive styles, media query objects |
| `src/index.css` | **MODIFY** | Add media queries, fix overflow |
| `src/App.tsx` | **MODIFY** | Integrate hooks, fix coordinate math, pass isPhone |
| `src/game/components/HUD.tsx` | **MODIFY** | Accept isPhone, apply responsive style |
| `src/game/components/GameOverlays.tsx` | **MODIFY** | Accept isPhone, scale fonts |
| `src/game/__tests__/responsive.test.ts` | **NEW** | Unit tests for scale calc + breakpoints |

### Files NOT Changed
- `src/game/constants.ts`
- `src/game/combatSystem.ts`
- `src/game/waveSystem.ts`
- `src/game/mapSystem.ts`
- `src/game/gameEngine.ts`
- `src/game/keyboard.ts`
- `src/game/renderer/` (all files)
- `src/game/types.ts`
- `src/game/i18n.ts`
- `vite.config.ts`
- `tsconfig.json`

---

## 4. Success Criteria

- [ ] Game loads and plays on 320px wide viewport
- [ ] Canvas fills available width without horizontal scroll
- [ ] Tower placement works via tap on touchscreens
- [ ] Box breaking works via tap on touchscreens
- [ ] HUD stats are legible and non-overlapping on 320px
- [ ] Tower panel accessible (floating overlay) on phone
- [ ] Overlays (start/gameover/victory/pause) correctly scaled
- [ ] Desktop layout unchanged from current
- [ ] No horizontal scrollbar at any viewport width
- [ ] 60 FPS maintained on mobile
- [ ] Unit tests pass: `npx vitest run`

---

## 5. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Coordinate math regression on desktop | Test at ≥768px first, verify no behavioral change |
| Touch scroll conflicts with game interaction | `touch-action: none` on canvas |
| Fixed overlay covers game content | Add semi-transparent background, position at very bottom |
| Device rotation mid-game (portrait ↔ landscape) | `ResizeObserver` auto-detects width changes, `useResponsiveScale` re-triggers. Game loop and canvas remain uninterrupted. |
| iPhone notch / home indicator overlaps UI | `env(safe-area-inset-bottom)` padding on tower panel |
| iOS double-tap zoom interferes with gameplay | `touch-action: manipulation` on buttons, `touch-action: none` on canvas |
| Performance on low-end phones | CSS scale is GPU-accelerated, game loop unchanged |
| Typography readability at small sizes | Keep minimum 12px, use medium font-weight |

---

## 6. Implementation Order

1. `responsive.ts` (pure logic, testable in isolation)
2. `touch.ts` (depends on responsive utils)
3. `responsive.test.ts` (validate phase 1)
4. `styles.ts` + `index.css` (responsive styles)
5. `HUD.tsx` + `GameOverlays.tsx` (component updates)
6. `App.tsx` (integration, coordinate fix)
7. Manual QA at 320px, 480px, 768px, 1024px
8. Run tests, verify no regressions
