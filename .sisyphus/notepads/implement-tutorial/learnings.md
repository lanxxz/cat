# Tutorial State Machine — Learnings

## Implementation Summary

Wired the 4-step tutorial flow into `src/App.tsx` (9 changes, 324 lines total).

### Tutorial Flow
1. **Start Game** → `tutorialStep=1` (overlay visible, canvas highlights box), wave NOT started
2. **Click box** → `tutorialStep=2` (overlay prompts tower selection with arrow)
3. **Select tower** → `tutorialStep=3` (canvas highlights buildable tile)
4. **Place tower** → `tutorialStep=4` (1.5s delay → wave starts with 3 cucumbers from `LEVEL1_WAVE`)

### Key Decisions
- Used `tutorialStepRef` (same pattern as `selectedTowerRef`/`goldRef`) to avoid restarting the animation loop on step changes
- `renderGame` already accepted `tutorialStep` param with default `0` — no renderer changes needed
- `handleSelectTower` advances only on actual selection (`selectedTowerType !== type`), not deselection
- Level 1 uses raw `LEVEL1_WAVE` data (unscaled 3 cucumbers), NOT `WAVES[0]` which is `BASE_WAVES[0]` scaled by `WAVE_SCALE_FACTOR`

### Files Modified
- `src/App.tsx` — all tutorial state machine logic + TutorialGuide rendering

### Verification
- `npx tsc --noEmit` — clean
- `npm run build` — clean (54 modules, 179KB JS)
