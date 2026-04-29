# AGENTS.md — Hajimi Defense (萌新防御)

> Compact guidance for OpenCode sessions in this repo. Every line should answer: "Would an agent likely miss this without help?"

## Commands

```bash
npm run dev          # Vite dev server on :3000
npm run build        # tsc -b && vite build  (typecheck first, then bundle)
npm test             # vitest run (single pass)
npm run test:watch   # vitest (watch mode)
npm run preview      # vite preview (production build)
```

**Order matters**: `npm run build` runs `tsc -b` first. If type errors exist, the build fails before `vite build` runs.

## Architecture

```
App.tsx                    # Orchestration: useGameState → useGameCallbacks → useGameEffects → useGameLoop
  hooks/
    useGameState.ts        # All useState + useRef (single source of truth)
    useGameCallbacks.ts    # All event handlers (canvas clicks, start/restart, tower ops)
    useGameEffects.ts      # All useEffect blocks (path unlock, announcements, keyboard)
    useGameLoop.ts         # requestAnimationFrame game loop (spawn, move, attack, render)
  components/              # React UI components (HUD, TowerPanel, GameOverlays, etc.)
  renderer/                # Canvas 2D renderers (map, towers, enemies, projectiles, particles)
  constants.ts             # All game config: towers, enemies, waves, paths, upgrade costs
  types.ts                 # All TypeScript interfaces
  combatSystem.ts          # Enemy spawn, movement, tower attacks, projectile updates
  mapSystem.ts             # Map generation, box placement, initGameState
  waveSystem.ts            # Wave definitions & startWave (MOSTLY DEPRECATED — see below)
  gameEngine.ts            # Particles, screen shake, upgrade glow
  i18n.ts                  # TEXT(lang) → { zh, en } translations
  styles.ts                # React.CSSProperties objects for UI
  responsive.ts            # Device category detection + canvas coordinate scaling
```

## Critical: Game State Pattern

**Game state is NOT in React state.** The game loop runs at 60fps via `requestAnimationFrame`. All mutable game data lives in `gameRef: MutableRefObject<GameStateRef>` and is mutated imperatively. React state (`useState`) is only for UI triggers (gold display, wave counter, overlays, etc.).

```typescript
// ❌ NEVER do this for game entities:
const [enemies, setEnemies] = useState([]);

// ✅ The actual pattern:
gameRef.current.enemies.push(newEnemy); // mutable ref, no re-render
setGold(gold + reward);                 // React state for UI display only
```

When adding game mechanics, add data to `GameStateRef` interface in `types.ts`, then mutate via `gameRef.current` inside `useGameLoop.ts` or `combatSystem.ts`. Only use `useState` setters for values displayed in HUD.

## Watch Out: Deprecated Code

- **`waveSystem.ts`**: `createEnemy()`, `spawnEnemyIfNeeded()`, `calcKillReward()` are all `@deprecated`. The live versions live in `combatSystem.ts`. Only `startWave()` in this file is actively used.
- **`config.ts`**: Legacy re-export file. New imports should go directly to `constants.ts` or `types.ts`.
- **`src/components/`**: This directory is EMPTY. All components live in `src/game/components/`.

## Duplicated Config

`PATH_UNLOCK_WAVES` is defined in both `useGameLoop.ts` and `useGameEffects.ts`. If you change path unlock timing, update BOTH or extract to `constants.ts`.

## TypeScript Strictness

`tsconfig.json` enforces:
- `strict: true`
- `noUnusedLocals: true` — unused imports/variables fail `tsc`
- `noUnusedParameters: true` — unused params fail `tsc`
- `noFallthroughCasesInSwitch: true`

**Always run `tsc -b` before committing.** Unused imports are the most common build failure.

## Testing

- Framework: Vitest with jsdom environment
- Test files: `src/game/__tests__/*.test.ts`
- Tests are unit-level, testing pure functions (getTowerStats, getUpgradeCost, getSellValue, responsive scaling)
- No snapshot tests, no integration tests
- Run a single test file: `npx vitest run src/game/__tests__/upgrade.test.ts`

## Bilingual Convention

All source files use bilingual comments:
```typescript
// English description / 中文描述
```
This applies to everything: JSDoc, inline comments, docstrings. New code MUST follow this pattern. The `i18n.ts` system supports `zh` and `en` via `TEXT(lang)` returning a typed object.

## Color & Style

- UI styles are `React.CSSProperties` objects in `styles.ts` — NOT CSS files (except `src/index.css` for global/responsive)
- Game rendering uses Canvas 2D — all draw calls in `src/game/renderer/`
- Fonts: Fredoka One (title), Nunito (body/badges), loaded via Google Fonts in `index.css`
- Pastel Kawaii palette: cream `#FFF8E7`, pink `#FFE4EC`, mint `#98D8C8`, lavender `#C5A3FF`

## Responsive Design

Three breakpoints in `responsive.ts`:
- Phone: ≤480px — canvas scales to 40%, fixed tower panel at bottom
- Tablet: 481–767px — canvas scales to 65%
- Desktop: ≥768px — full-size canvas (768×512)

Canvas coordinate scaling (`scaleClientToCanvas`) is REQUIRED when handling pointer events — device pixels ≠ canvas pixels on mobile/tablet.

## Game Mechanics Quick Reference

- Grid: 12×8 tiles, 64px each, full canvas 768×512
- 15 waves, 3 tower types (Tabby/Siamese/Orange), 4 enemy types (Cucumber/Vacuum/Mosquito/Rat)
- Multi-path system: 3 paths (Easy/Medium/Hard), Easy unlocked at start, Normal at wave 4, Hard at wave 6
- Tower upgrade: 5 levels, unlocked at wave 3, cost = base × 2^level
- Enemies in `gameRef.current.enemiesToSpawn[]` are shuffled, then spawned one at a time with timer gates

## openspec

This project uses `openspec` for spec-driven development. Artifacts must be in Chinese (zh-CN). Config at `openspec/config.yaml`.

## File Creation Rules

- Game components → `src/game/components/`
- Renderers → `src/game/renderer/`
- Hooks → `src/game/hooks/`
- Tests → `src/game/__tests__/`
- New game systems → `src/game/` (add exports to `src/game/index.ts`)
