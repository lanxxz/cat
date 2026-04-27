# Upgrade System - Learnings

## Task: Upgrade Mode State + Tower Click Detection (App.tsx)

### Patterns Used
- **useRef for mutable game-loop state**: upgradeModeRef, selectedTowerIndexRef follow the same pattern as selectedTowerRef, goldRef, etc.
- **Wave gate**: Upgrade mode only available in Level 2 with wave >= UPGRADE_UNLOCK_WAVE (3). Using `level !== 2 || wave < UPGRADE_UNLOCK_WAVE` for the gate check.
- **Tower tile detection**: `state.map[tileY]?.[tileX] === 4` (TILE_TOWER = 4 hardcoded, not a named constant)
- **Tower coordinate conversion**: `Math.floor((t.x - TILE_SIZE/2) / TILE_SIZE)` converts pixel center to tile index
- **Callback pattern**: handleSelectUpgradeMode uses useCallback with empty deps (since all setState functions are stable)

### Files Modified
1. `src/App.tsx` - Main changes:
   - Added `upgradeMode` state + `upgradeModeRef`
   - Added `selectedTowerIndex` state + `selectedTowerIndexRef`
   - Modified `handleCanvasClick` with upgrade mode gate + tower click detection
   - Updated `handleSelectTower` to exit upgrade mode
   - Added `handleSelectUpgradeMode` callback
   - Added hover cursor logic (pointer on towers in upgrade mode)
   - Added onPointerLeave handler for cursor reset
   - Added 'U' keyboard shortcut for upgrade mode toggle
   - Reset upgrade states in `startGame` and Level 1→2 transition

2. `src/game/renderer/index.ts` - Minimal change:
   - Added `_selectedTowerIndex` optional parameter (forward-compat for future rendering tasks)

### Key Decisions
- **Cursor handled in hover handler, not renderer**: Upgrade mode cursor logic (`pointer`/`default`/`crosshair`) is set dynamically in handleCanvasHover via `canvas.style.cursor`, not in the renderGame function. This avoids needing to modify renderer internals for this task.
- **SelectedTowerIndex is NOT passed to renderer yet**: The parameter is declared in renderGame signature (prefixed with `_` to suppress noUnusedParameters) but not used by the renderer. Future tasks will activate this.
- **Wave gate is checked inside click handler**: If conditions aren't met, upgrade mode auto-deselects. This prevents stale upgrade mode after game state changes.

### TypeScript Considerations
- `_prefix` convention for unused parameters works in TS 5.5.4 to suppress `noUnusedParameters` errors
- `noUnusedLocals` requires actual reads of declared variables; refs and state setters are reads, but the value itself needs explicit use

---

## F4: Scope Fidelity Check (2026-04-27)

### File Scope Verification
- **Expected files (12)**: types.ts, constants.ts, combatSystem.ts, gameEngine.ts, renderer/renderTower.ts, mapSystem.ts, i18n.ts, styles.ts, config.ts, __tests__/upgrade.test.ts, renderer/index.ts, App.tsx
- **Actual modified (11 + 1 new)**: All 12 accounted for. Zero unexpected files.
- **Extra files (0 code)**: Only plan infrastructure (.sisyphus/notepads/upgrade-system/, .sisyphus/plans/upgrade-system.md)

### Task-by-Task Compliance
| Task | Must-Do | Must-Not | Verdict |
|------|---------|----------|---------|
| T1 | Types/constants/initGameState | No logic/rendering | ✅ |
| T2 | getTowerStats + 10 tests | No combat mod | ✅ |
| T3 | getUpgradeCost/getSellValue/getUnlockCost + 12 tests | No UI handlers | ✅ |
| T4 | spawnUpgradeParticles + glow state + 5 tests | Not wired yet | ✅ |
| T5 | LevelDisplayConfig + 7 tests | No rendering code | ✅ |
| T6 | towerAttacks uses getTowerStats | No speed/aoe scaling | ✅ |
| T7 | upgradeMode/selectedTowerIndex/wave gate | No upgrade/sell logic | ✅ |
| T8 | handleUpgrade with unlock+upgrade flow | No sell/glow render | ✅ |
| T9 | handleSell with refund+cleanup+particles | No oversell | ✅ |
| T10 | Glow ring + badge rendering | No cat redesign | ✅ |
| T11 | Popup with lock/unlock/upgrade/sell modes | No logic impl | ✅ |
| T12 | Upgrade mode button (golden, responsive) | No TowerPanel.tsx mod | ✅ |
| T13 | 18 i18n keys zh+en | Only zh+en | ✅ |
| T14 | Integration wire-up (glow anim, U shortcut) | No new features | ✅ |

### Must-NOT Guardrails
1. ✅ No cat sprite redesign (glow ring + badge additive only)
2. ✅ No sound effects or audio
3. ✅ No game rebalancing (base costs/HPs unchanged)
4. ✅ No save/load
5. ✅ No new tower/enemy types
6. ✅ Attack speed NOT scaled
7. ✅ TowerPanel.tsx NOT modified
8. ✅ No range visual circle or stats tooltip
9. ✅ No tutorial steps

### Minor Notes
- config.ts updated as barrel re-exports (needed for integration, not a task spec file but reasonable)
- Test file uses 2x `as any` in mock objects (acceptable in test code, not production)
- renderTower.ts uses `roundRect()` API (requires modern browser, visual-only)

### Verdict: APPROVE
Tasks [14/14 compliant] | Extra Files [0] | Contamination [CLEAN]
