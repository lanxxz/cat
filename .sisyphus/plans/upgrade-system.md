# Cat Tower Upgrade System

## TL;DR

> **Quick Summary**: Add a 5-level upgrade system for all 3 cat tower types with geometric cost scaling (×2 per level), damage scaling (×1.2), range scaling (×1.05), visual level display (color tint + badge), upgrade sparkle+glow effects, and a sell tower option (50% refund). TDD approach with Vitest.

> **Deliverables**:
> - Level-aware tower types & stats helpers (pure functions, tested)
> - Upgrade/sell cost calculation helpers (pure functions, tested)
> - Level-aware combat system (scaled damage + range)
> - Upgrade mode toggle + tower selection in game UI
> - Upgrade popup (stats, cost, confirm) + sell button
> - Canvas rendering: level badge + color tint/glow per level
> - Upgrade particle effect (sparkle burst + glow pulse)
> - Full i18n (zh/en) for all new text
> - TDD test suite for all stat/cost logic

> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Task 1 → Task 7 → Task 8 → Task 14 → F1-F4

---

## Context

### Original Request
为游戏设计升级系统。三种类型的猫咪总共有5个等级的升级，每次升级消耗的金币是上之前等级的2倍，攻击力提升到原来的1.2倍。场上的每一只防御塔猫咪要体现等级。升级的猫咪要有特效动画。

### ⚠️ NEW REQUIREMENTS (Added 2026-04-27)
- **Level gate**: Upgrade feature unlocks at **Wave 3 of Level 2**. Before wave 3, the upgrade mode button is hidden/disabled. Level 1 (tutorial) has no upgrades.
- **Per-type unlock fee**: Each cat type requires a one-time unlock fee before any tower of that type can be upgraded. Pay once → all towers of that type (existing + future) can upgrade.
  - Unlock cost = `current total towers on field × 100`, capped at **2000**
  - Calculated in real-time when the player clicks to unlock
  - After unlocking, normal upgrade costs apply (geometric doubling from the plan)

### Interview Summary
**Key Discussions**:
- **Upgrade trigger**: Dedicated "Upgrade Mode" button in tower panel (4th mode alongside 3 tower types)
- **Timing**: Can upgrade anytime during gameplay (including mid-combat)
- **Stat scaling**: Attack power ×1.2 per level, range ×1.05 per level. Attack speed does NOT change.
- **Visual display**: Color tint/aura changes per level + level badge number displayed on each tower
- **Upgrade effect**: Sparkle burst + glow pulse combo animation
- **Sell tower**: Yes — 50% refund of total gold invested (build cost + all upgrade costs)
- **Testing**: TDD with Vitest (existing infrastructure)

**Research Findings**:
- `Tower` interface (`types.ts:29-35`) has NO `level` field — needs addition
- `TowerTypeConfig` (`constants.ts:127`) has static stats — needs level-aware getter
- Combat (`combatSystem.ts:94-113`) reads `TOWER_TYPES[tower.type].damage` directly — needs interception
- Rendering (`renderTower.ts`) has 3 hand-drawn Canvas cats with fixed colors — needs level tint + badge
- `TowerPanel.tsx` component exists but is NOT used by App.tsx (App renders tower buttons inline at lines 347-354) — will modify inline rendering
- Effects (`gameEngine.ts`) has particle system for box break/tower place/enemy kill — upgrade particles follow the same pattern
- i18n (`i18n.ts`) has bilingual `TEXTS` object with `zh`/`en` keys — needs new keys
- Only 1 test file exists (`responsive.test.ts`) — follows `describe`/`it`/`expect` Vitest pattern

### Metis Review
**Identified Gaps** (addressed):
- **Cost formula ambiguity**: Confirmed by user's example as geometric doubling (`base × 2^L`): Lv1→2=100g, Lv2→3=200g, Lv3→4=400g, Lv4→5=800g for Tabby
- **Sell flow**: Applied default — sell button inside upgrade popup with confirmation
- **Tower info display**: Applied default — upgrade popup serves as both info display and action panel
- **TowerPanel.tsx dead code**: Decision — modify App.tsx inline rendering (not the unused component)
- **Sell during combat**: Applied default — allowed (consistent with upgrade-anytime rule)
- **Attack speed scaling**: Confirmed — does NOT scale (only damage + range)
- **Level 2 reset**: Noted — Level 2 game reset wipes all towers and upgrades (correct behavior, no persistence needed)
- **Scope guardrails applied**: NO sound effects, NO game rebalancing, NO cat sprite redesign, NO save/load
- **NEW - Level gate**: Upgrade mode unlocked at Wave 3 of Level 2. Hidden/disabled before wave 3 and during Level 1 tutorial.
- **NEW - Per-type unlock fee**: One-time payment per cat type = `currentTowerCount × 100` (max 2000). Pay once → all towers of that type can upgrade. Unlock cost calculated real-time at click moment.

---

## Work Objectives

### Core Objective
Implement a 5-level tower upgrade system where players can invest gold to progressively strengthen their cat towers with visual feedback and strategic depth.

### Concrete Deliverables
- `src/game/types.ts` — `Tower` interface extended with `level` + `totalInvested`
- `src/game/constants.ts` — `MAX_TOWER_LEVEL`, `UPGRADE_COST_MULTIPLIER`, `UPGRADE_DAMAGE_MULTIPLIER`, `UPGRADE_RANGE_MULTIPLIER`, level color map, stats helper functions
- `src/game/combatSystem.ts` — Level-aware damage/range calculation in `towerAttacks()`
- `src/game/gameEngine.ts` — `spawnUpgradeParticles()` and glow pulse state
- `src/game/renderer/renderTower.ts` — Level badge text + color tint/glow per level
- `src/App.tsx` — Upgrade mode state, tower click detection, upgrade/sell handlers, upgrade popup integration
- `src/game/i18n.ts` — New text keys for upgrade/sell UI (zh + en)
- `src/game/styles.ts` — New styles for upgrade popup and mode button
- `src/game/__tests__/upgrade.test.ts` — TDD test suite for all stat/cost helpers

### Definition of Done
- [ ] `npm test` — all upgrade tests pass (≥12 test cases)
- [ ] `npm run build` — TypeScript compilation succeeds with no errors
- [ ] All 3 cat types can be upgraded from level 1 to level 5
- [ ] Upgrade cost doubles geometrically: Lv2=2×base, Lv3=4×base, Lv4=8×base, Lv5=16×base
- [ ] Damage scales by 1.2× per level (multiplicative compounding)
- [ ] Range scales by 1.05× per level (multiplicative compounding)
- [ ] Level badge visible on all towers on the field
- [ ] Color tint/glow changes visibly per level
- [ ] Upgrade sparkle + glow effect plays on level-up
- [ ] Sell returns 50% of total gold invested
- [ ] All new UI text works in both Chinese and English
- [ ] Level 5 towers show MAX and cannot be upgraded further
- [ ] Game runs at 60 FPS after changes

### Must Have
- Upgrade mode gated behind Wave 3 of Level 2 (hidden before)
- Per-type one-time unlock fee = `min(totalTowers × 100, 2000)` (real-time calculation)
- After unlock, geometric upgrade cost doubling (2^L × base)
- Multiplicative damage scaling (base × 1.2^L)
- Multiplicative range scaling (base × 1.05^L)
- Level badge and color tint on all towers
- Upgrade sparkle+glow effect animation
- Sell tower for 50% total invested (always available regardless of unlock state)
- Gold validation (cannot upgrade/unlock if insufficient gold)
- MAX level cap at 5
- Bilingual i18n coverage (16 new keys × 2 languages)

### Must NOT Have (Guardrails)
- Do NOT redesign cat sprites — color tint overlay only (modify fillStyle/strokeStyle, not shapes)
- Do NOT add sound effects or audio
- Do NOT rebalance existing game values (enemy HP, wave configs, base costs) — upgrades are additive
- Do NOT implement save/load or upgrade persistence across game sessions
- Do NOT add new tower types or enemy types
- Do NOT scale attack speed with level
- Do NOT modify the unused `TowerPanel.tsx` — modify App.tsx inline rendering instead
- Do NOT add tower range visual circle or stats tooltip (scope creep)
- Do NOT add tutorial steps for upgrade system

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** - ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES
- **Automated tests**: TDD — RED (failing test) → GREEN (minimal impl) → REFACTOR
- **Framework**: Vitest (existing `vitest run`)
- **Test file**: `src/game/__tests__/upgrade.test.ts`

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM/canvas, screenshot
- **Backend/logic**: Use Bash (bun/node REPL) — Import functions, call with params, compare output
- **API/CLI**: Use Bash (curl) — Not applicable (browser game)

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately - foundation, ALL PARALLEL):
├── Task 1: Tower interface + constants enrichment [quick]
├── Task 2: getTowerStats() + TDD tests [quick]
├── Task 3: getUpgradeCost() + getSellValue() + TDD tests [quick]
├── Task 4: spawnUpgradeParticles() + TDD tests [quick]
└── Task 5: Color tint constants + level display config [quick]

Wave 2 (After Wave 1 - core logic, MAX PARALLEL):
├── Task 6: Combat system level-awareness (depends: 2) [unspecified-high]
├── Task 7: Upgrade mode state + tower click detection (depends: 1) [unspecified-high]
├── Task 8: Upgrade execution handler (depends: 4, 7) [unspecified-high]
└── Task 9: Sell execution handler (depends: 3, 7) [unspecified-high]

Wave 3 (After Wave 2 - rendering + UI, MAX PARALLEL):
├── Task 10: Tower level rendering - badge + color tint (depends: 1, 5) [visual-engineering]
├── Task 11: Upgrade popup UI component (depends: 2, 3, 7) [visual-engineering]
├── Task 12: Tower panel - upgrade mode button (depends: 7) [visual-engineering]
├── Task 13: i18n keys for all new text (depends: none) [quick]
└── Task 14: End-to-end integration wire-up (depends: 8, 9, 10, 11, 12) [deep]

Wave FINAL (After ALL tasks — 4 parallel reviews):
├── Task F1: Plan compliance audit [oracle]
├── Task F2: Code quality review [unspecified-high]
├── Task F3: Real manual QA [unspecified-high]
└── Task F4: Scope fidelity check [deep]

Critical Path: Task 1 → Task 7 → Task 8 → Task 14 → F1-F4
Parallel Speedup: ~65% faster than sequential
Max Concurrent: 5 (Waves 1 & 3)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 5, 7, 10 | 1 |
| 2 | 1 | 6, 11 | 1 |
| 3 | 1 | 9, 11 | 1 |
| 4 | — | 8 | 1 |
| 5 | 1 | 10 | 1 |
| 6 | 2 | 14 | 2 |
| 7 | 1 | 8, 9, 11, 12 | 2 |
| 8 | 4, 7 | 14 | 2 |
| 9 | 3, 7 | 14 | 2 |
| 10 | 1, 5 | 14 | 3 |
| 11 | 2, 3, 7 | 14 | 3 |
| 12 | 7 | 14 | 3 |
| 13 | — | 14 | 3 |
| 14 | 6, 8, 9, 10, 11, 12, 13 | F1-F4 | 3 |

### Agent Dispatch Summary

- **Wave 1**: 5 × `quick` — T1-T5
- **Wave 2**: 4 × `unspecified-high` — T6-T9
- **Wave 3**: 3 × `visual-engineering` (T10-T12), 1 × `quick` (T13), 1 × `deep` (T14)
- **FINAL**: 1 × `oracle` (F1), 2 × `unspecified-high` (F2, F3), 1 × `deep` (F4)

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.

- [x] 1. Tower Interface Extension + Constants Enrichment

  **What to do**:
  - Add `level: number` (1-5, default 1) and `totalInvested: number` (cumulative gold spent) to the `Tower` interface in `src/game/types.ts`
  - Add `upgradeUnlocked: boolean[]` to `GameStateRef` (3 booleans, one per tower type, all default false)
  - Add `MAX_TOWER_LEVEL = 5`, `UPGRADE_UNLOCK_WAVE = 3` constants to `src/game/constants.ts`
  - Add `UNLOCK_COST_PER_TOWER = 100`, `UNLOCK_MAX_COST = 2000` constants
  - Add `UPGRADE_COST_MULTIPLIER = 2`, `UPGRADE_DAMAGE_MULTIPLIER = 1.2`, `UPGRADE_RANGE_MULTIPLIER = 1.05` constants
  - Add `LEVEL_COLORS` map: `{ 1: null, 2: '#4CAF50', 3: '#2196F3', 4: '#9C27B0', 5: '#FFD700' }` (level → glow ring color, null = no tint)
  - Add `LEVEL_BADGE_COLORS` map: `{ 1: '#999', 2: '#4CAF50', 3: '#2196F3', 4: '#9C27B0', 5: '#FFD700' }` (level → badge text color)
  - Update all `Tower` object creation sites to include `level: 1, totalInvested: towerType.cost`:
    - `App.tsx:172` (tower placement)
    - Any test fixtures

  **Must NOT do**:
  - Do NOT modify any rendering or combat logic in this task — types only
  - Do NOT change existing `TowerTypeConfig` interface structure
  - Do NOT add upgrade popup UI or click handlers

  **Recommended Agent Profile**:
  > Select category + skills based on task domain.
  - **Category**: `quick`
    - Reason: Pure type/constant changes, no logic or rendering, straightforward additions
  - **Skills**: [`git-master`]
    - `git-master`: For clean atomic commit of type changes

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4, 5)
  - **Blocks**: Tasks 5, 7, 10
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL):
  - `src/game/types.ts:29-35` — Current `Tower` interface — add `level` and `totalInvested` fields here
  - `src/game/types.ts:196-212` — `GameStateRef` — add `upgradeUnlocked: boolean[]` to the mutable ref
  - `src/game/constants.ts:127-137` — `TowerTypeConfig` interface — understand existing tower stat structure
  - `src/game/constants.ts:146-178` — `TOWER_TYPES` array — base costs: Tabby=50, Siamese=75, Orange=100 (used for `totalInvested` initialization)
  - `src/game/mapSystem.ts` — `initGameState()` — initialize `upgradeUnlocked: [false, false, false]`
  - `src/App.tsx:169-173` — Tower creation site — MUST update to include `level: 1, totalInvested: towerType.cost`
  - `src/game/__tests__/` — Existing test directory — new test file will go here

  **Acceptance Criteria**:
  - [ ] `Tower` interface has `level: number` field (default 1)
  - [ ] `Tower` interface has `totalInvested: number` field
  - [ ] `GameStateRef` has `upgradeUnlocked: boolean[]` (3 elements, all default false)
  - [ ] `MAX_TOWER_LEVEL = 5`, `UPGRADE_UNLOCK_WAVE = 3` constants defined and exported
  - [ ] `UNLOCK_COST_PER_TOWER = 100`, `UNLOCK_MAX_COST = 2000` constants defined
  - [ ] `LEVEL_COLORS` and `LEVEL_BADGE_COLORS` maps defined and exported
  - [ ] `UPGRADE_COST_MULTIPLIER`, `UPGRADE_DAMAGE_MULTIPLIER`, `UPGRADE_RANGE_MULTIPLIER` constants defined
  - [ ] `npm run build` passes (no type errors from new fields)
  - [ ] App.tsx tower creation includes `level: 1, totalInvested: towerType.cost`
  - [ ] `initGameState()` initializes `upgradeUnlocked: [false, false, false]`

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: TypeScript compilation with new Tower fields
    Tool: Bash
    Preconditions: Changes applied to types.ts and constants.ts
    Steps:
      1. Run: npm run build
      2. Assert exit code is 0
      3. Assert no TypeScript errors related to Tower.level or Tower.totalInvested
    Expected Result: Build succeeds, all type checks pass
    Failure Indicators: TS errors about missing properties, type mismatches
    Evidence: .sisyphus/evidence/task-1-build-pass.txt

  Scenario: Verify constants are exported and accessible
    Tool: Bash (node REPL)
    Preconditions: Build successful
    Steps:
      1. Run node REPL importing from built output:
         node -e "const c = require('./dist/game/constants.js'); console.log(c.MAX_TOWER_LEVEL, c.UPGRADE_DAMAGE_MULTIPLIER)"
      2. Assert MAX_TOWER_LEVEL === 5
      3. Assert UPGRADE_DAMAGE_MULTIPLIER === 1.2
    Expected Result: Constants export correctly with expected values
    Failure Indicators: undefined exports, wrong values
    Evidence: .sisyphus/evidence/task-1-constants.txt
  ```

  **Evidence to Capture**:
  - [ ] `task-1-build-pass.txt` — build output showing success
  - [ ] `task-1-constants.txt` — constant values verification

  **Commit**: YES (groups with N/A — standalone)
  - Message: `feat(types): add level, totalInvested, upgradeUnlocked to game state`
  - Files: `src/game/types.ts`, `src/game/constants.ts`, `src/game/mapSystem.ts`, `src/App.tsx`

---

- [x] 2. getTowerStats() Pure Function + TDD Tests

  **What to do**:
  - Create `src/game/__tests__/upgrade.test.ts` with Vitest test suite
  - Write RED tests FIRST for `getTowerStats(towerType: number, level: number)`:
    - Level 1 Tabby damage = 15 (base)
    - Level 5 Tabby damage ≈ 31.1 (15 × 1.2^4)
    - Level 3 Siamese damage ≈ 72 (50 × 1.2^2)
    - Level 5 Orange range ≈ 126 (120 × 1.05^4)
    - Level 6 clamps to level 5 (MAX)
    - Level 0 clamps to level 1 (MIN)
    - Attack speed unchanged across levels (Tabby = 500ms at all levels)
  - Implement `getTowerStats(type, level)` in `src/game/constants.ts`:
    - Clamp level to [1, MAX_TOWER_LEVEL]
    - Return `{ damage: number, range: number, attackSpeed: number }` 
    - damage = `Math.round(base.damage * Math.pow(UPGRADE_DAMAGE_MULTIPLIER, level - 1))`
    - range = `Math.round(base.range * Math.pow(UPGRADE_RANGE_MULTIPLIER, level - 1))`
    - attackSpeed = `base.attackSpeed` (unchanged)
  - Make tests GREEN

  **Must NOT do**:
  - Do NOT modify combat system in this task (Task 6 handles that)
  - Do NOT add any UI or rendering changes
  - Do NOT write tests for upgrade cost or sell value (Task 3 handles that)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Pure function with simple math, isolated testable unit, no UI
  - **Skills**: []
    - No special skills needed — pure TypeScript logic

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4, 5)
  - **Blocks**: Tasks 6, 11
  - **Blocked By**: Task 1 (needs constants)

  **References** (CRITICAL):
  - `src/game/constants.ts:127-137` — `TowerTypeConfig` — source of base stats (damage, range, attackSpeed)
  - `src/game/constants.ts:146-178` — `TOWER_TYPES` array — base values to test against: Tabby(dmg=15,range=100,spd=500), Siamese(dmg=50,range=200,spd=1500), Orange(dmg=25,range=120,spd=1000)
  - `src/game/__tests__/responsive.test.ts` — Test pattern to follow: `import { describe, it, expect } from 'vitest'`
  - `vitest.config.ts` — Test configuration: jsdom environment, globals enabled

  **Acceptance Criteria**:
  - [ ] Test file: `src/game/__tests__/upgrade.test.ts` created
  - [ ] `npm test` → all getTowerStats tests PASS (≥7 test cases)
  - [ ] Level 1 returns base stats exactly
  - [ ] Level 5 damage = base × 1.2^4 (rounded)
  - [ ] Level 5 range = base × 1.05^4 (rounded)
  - [ ] Attack speed identical at all levels
  - [ ] Level 6 clamped to level 5 (no error, returns level 5 stats)
  - [ ] Level 0 clamped to level 1

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Verify level 5 Tabby damage calculation
    Tool: Bash (vitest)
    Preconditions: Tests written, implementation code exists
    Steps:
      1. Run: npm test -- src/game/__tests__/upgrade.test.ts
      2. Assert all tests pass with 0 failures
      3. Assert specific test "getTowerStats Tabby level 5 damage" returns ~31
    Expected Result: All getTowerStats tests green
    Failure Indicators: Test failures, wrong damage/range values
    Evidence: .sisyphus/evidence/task-2-test-output.txt

  Scenario: Verify level clamping boundary behavior
    Tool: Bash (vitest)
    Preconditions: Tests include clamping test cases
    Steps:
      1. Run: npm test -- --reporter=verbose
      2. Assert test "clamps level 6 to 5" passes
      3. Assert test "clamps level 0 to 1" passes
    Expected Result: Boundary tests pass without errors
    Failure Indicators: Errors thrown, wrong clamped values
    Evidence: .sisyphus/evidence/task-2-clamp-tests.txt
  ```

  **Evidence to Capture**:
  - [ ] `task-2-test-output.txt` — full vitest output showing all tests pass
  - [ ] `task-2-clamp-tests.txt` — verbose output for clamping tests

  **Commit**: YES
  - Message: `feat(stats): add getTowerStats() with level-scaled damage and range`
  - Files: `src/game/constants.ts`, `src/game/__tests__/upgrade.test.ts`
  - Pre-commit: `npm test`

---

- [x] 3. getUpgradeCost() + getSellValue() + getUnlockCost() Pure Functions + TDD Tests

  **What to do**:
  - Add tests to `src/game/__tests__/upgrade.test.ts` (RED first):
    - Tabby Lv1→Lv2 cost = 100 (2 × 50)
    - Tabby Lv2→Lv3 cost = 200 (4 × 50)
    - Tabby Lv3→Lv4 cost = 400 (8 × 50)
    - Tabby Lv4→Lv5 cost = 800 (16 × 50)
    - Siamese Lv1→Lv2 cost = 150 (2 × 75)
    - Orange Lv1→Lv2 cost = 200 (2 × 100)
    - Level 5 returns null or Infinity (MAX — cannot upgrade)
    - getSellValue(Tower{type:0, level:1, totalInvested:50}) = 25
    - getSellValue(Tower{type:0, level:3, totalInvested:350}) = 175 (350 × 0.5)
    - **NEW**: `getUnlockCost(3)` returns 300 (3 towers × 100)
    - **NEW**: `getUnlockCost(25)` returns 2000 (capped at max)
    - **NEW**: `getUnlockCost(0)` returns 100 (minimum — at least 1 tower worth, since you need towers to unlock)
  - Implement in `src/game/constants.ts`:
    - `getUpgradeCost(towerType, currentLevel)` — same as before
    - `getSellValue(tower)` — same as before
    - **NEW**: `getUnlockCost(currentTowerCount: number): number` — returns `Math.min(currentTowerCount * UNLOCK_COST_PER_TOWER, UNLOCK_MAX_COST)`
  - Make tests GREEN

  **Must NOT do**:
  - Do NOT add upgrade/sell UI handlers (Tasks 8, 9 handle that)
  - Do NOT modify the Tower panel or App.tsx

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Two simple pure functions with straightforward math, TDD cycle
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4, 5)
  - **Blocks**: Tasks 9, 11
  - **Blocked By**: Task 1 (needs Tower interface and constants)

  **References** (CRITICAL):
  - `src/game/constants.ts:146-178` — `TOWER_TYPES` — base costs: [50, 75, 100]
  - `src/game/types.ts:29-35` — `Tower` interface (with new `level` and `totalInvested` fields from Task 1)
  - `src/game/__tests__/upgrade.test.ts` — Add new `describe` blocks to this file (Task 2 created it)
  - `UPGRADE_COST_MULTIPLIER = 2` — Defined in Task 1 constants enrichment

  **Acceptance Criteria**:
  - [ ] `npm test` → upgrade cost + sell value + unlock cost tests PASS (≥12 test cases)
  - [ ] `getUpgradeCost(0, 1)` returns 100 (Tabby Lv1→Lv2)
  - [ ] `getUpgradeCost(0, 4)` returns 800 (Tabby Lv4→Lv5)
  - [ ] `getUpgradeCost(0, 5)` returns null (MAX)
  - [ ] `getUpgradeCost(1, 1)` returns 150 (Siamese Lv1→Lv2)
  - [ ] `getUpgradeCost(2, 1)` returns 200 (Orange Lv1→Lv2)
  - [ ] `getSellValue({type:0, level:1, totalInvested:50})` returns 25
  - [ ] `getSellValue({type:0, level:3, totalInvested:350})` returns 175
  - [ ] `getSellValue({type:1, level:5, totalInvested:2325})` returns 1162
  - [ ] `getUnlockCost(5)` returns 500
  - [ ] `getUnlockCost(25)` returns 2000 (capped)
  - [ ] `getUnlockCost(1)` returns 100

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Verify all upgrade cost calculations
    Tool: Bash (vitest)
    Preconditions: Tests written, implementation complete
    Steps:
      1. Run: npm test -- src/game/__tests__/upgrade.test.ts
      2. Assert "getUpgradeCost Tabby level 1->2 returns 100" passes
      3. Assert "getUpgradeCost Tabby level 4->5 returns 800" passes
      4. Assert "getUpgradeCost returns null at max level" passes
    Expected Result: All cost tests green, values match geometric doubling formula
    Failure Indicators: Wrong cost values, null not returned at level 5
    Evidence: .sisyphus/evidence/task-3-cost-tests.txt

  Scenario: Verify sell value calculation
    Tool: Bash (vitest)
    Preconditions: Sell value tests included
    Steps:
      1. Run: npm test -- --reporter=verbose
      2. Assert "getSellValue level 1 tower returns 50% of base" passes
      3. Assert "getSellValue level 3 tower returns 50% of totalInvested" passes
      4. Verify floor rounding: 50% of odd number uses Math.floor
    Expected Result: Sell value = floor(totalInvested * 0.5)
    Failure Indicators: Wrong percentages, rounding errors
    Evidence: .sisyphus/evidence/task-3-sell-tests.txt
  ```

  **Evidence to Capture**:
  - [ ] `task-3-cost-tests.txt` — upgrade cost test output
  - [ ] `task-3-sell-tests.txt` — sell value test output

  **Commit**: YES
  - Message: `feat(economy): add getUpgradeCost(), getSellValue(), and getUnlockCost() helpers`
  - Files: `src/game/constants.ts`, `src/game/__tests__/upgrade.test.ts`
  - Pre-commit: `npm test`

---

- [x] 4. spawnUpgradeParticles() Effect Function + TDD Tests

  **What to do**:
  - Add `PARTICLE_COUNT_UPGRADE = 20` constant to `src/game/constants.ts`
  - Add upgrade particle color: `'#FFD700'` (gold) and glow pulse duration: `UPGRADE_GLOW_DURATION = 30` (frames)
  - Create `spawnUpgradeParticles(state: GameStateRef, tileX: number, tileY: number)` in `src/game/gameEngine.ts`:
    - Follow the exact pattern of `spawnPlaceTowerParticles()` (gameEngine.ts:65-71)
    - Spawn `PARTICLE_COUNT_UPGRADE` gold particles at tower center
    - Use `createParticle(x, y, '#FFD700')` with existing particle system
  - Add `UpgradeGlowState` interface: `{ active: boolean; towerX: number; towerY: number; frame: number }` 
  - Add `createUpgradeGlowState()` and `updateUpgradeGlow()` functions:
    - Glow expands from radius 20 to 40 over `UPGRADE_GLOW_DURATION` frames, fading alpha 1→0
    - Used by renderer to draw expanding glow ring
  - Add tests to `upgrade.test.ts`:
    - `spawnUpgradeParticles` adds 20 particles to state
    - Particles have gold color `#FFD700`
    - Glow state initializes with active=false
    - `updateUpgradeGlow` decrements frame counter

  **Must NOT do**:
  - Do NOT wire particles into upgrade action yet (Task 8 does that)
  - Do NOT render the glow ring yet (Task 10 does that)
  - Do NOT add sell particles

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Follows existing particle pattern exactly, simple testable functions
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 5)
  - **Blocks**: Task 8
  - **Blocked By**: None (particle system already exists; constants added in Task 1)

  **References** (CRITICAL):
  - `src/game/gameEngine.ts:32-43` — `createParticle()` function — reuse this, do NOT duplicate
  - `src/game/gameEngine.ts:65-71` — `spawnPlaceTowerParticles()` — exact pattern to copy for upgrade particles
  - `src/game/gameEngine.ts:88-98` — `updateParticles()` — existing update loop, upgrade particles use same system
  - `src/game/types.ts:98-107` — `Particle` interface — particle shape (x, y, vx, vy, color, life, alpha, size)
  - `src/game/constants.ts:58-66` — Existing particle count constants — add `PARTICLE_COUNT_UPGRADE` alongside these

  **Acceptance Criteria**:
  - [ ] `npm test` → upgrade particle tests PASS (≥4 test cases)
  - [ ] `spawnUpgradeParticles` creates exactly 20 particles in state
  - [ ] All spawned particles have color `#FFD700`
  - [ ] `createUpgradeGlowState()` returns `{ active: false, towerX: 0, towerY: 0, frame: 0 }`
  - [ ] `updateUpgradeGlow` decrements frame and sets active=false at frame 0
  - [ ] `npm run build` passes

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Verify upgrade particles spawn correctly
    Tool: Bash (vitest)
    Preconditions: Tests written, implementation complete
    Steps:
      1. Run: npm test -- src/game/__tests__/upgrade.test.ts
      2. Assert test "spawnUpgradeParticles adds 20 particles" passes
      3. Assert test "upgrade particles have gold color" passes
    Expected Result: 20 gold particles added to state.particles array
    Failure Indicators: Wrong count, wrong color, particles not pushed
    Evidence: .sisyphus/evidence/task-4-particle-tests.txt

  Scenario: Verify glow state lifecycle
    Tool: Bash (vitest)
    Preconditions: Glow state tests included
    Steps:
      1. Run: npm test -- --reporter=verbose
      2. Assert test "glow state initializes inactive" passes
      3. Assert test "updateGlow decrements frame to 0 then deactivates" passes
    Expected Result: Glow state properly cycles active→countdown→inactive
    Failure Indicators: Frame not decrementing, active flag stuck
    Evidence: .sisyphus/evidence/task-4-glow-tests.txt
  ```

  **Evidence to Capture**:
  - [ ] `task-4-particle-tests.txt` — particle spawning test output
  - [ ] `task-4-glow-tests.txt` — glow state lifecycle test output

  **Commit**: YES
  - Message: `feat(effects): add spawnUpgradeParticles() and upgrade glow state`
  - Files: `src/game/gameEngine.ts`, `src/game/constants.ts`, `src/game/__tests__/upgrade.test.ts`
  - Pre-commit: `npm test`

---

- [x] 5. Color Tint Constants + Level Display Configuration

  **What to do**:
  - Export `LEVEL_COLORS` and `LEVEL_BADGE_COLORS` maps from Task 1 (ensure they're usable by renderer)
  - Add `LEVEL_BADGE_FONT = 'bold 11px Fredoka One'` constant for badge text styling
  - Add `LEVEL_BADGE_OFFSET = { x: 18, y: -18 }` for badge positioning relative to tower center
  - Define helper type `LevelDisplayConfig` in constants: `{ glowColor: string | null; badgeColor: string; badgeText: string }`
  - Add `getLevelDisplayConfig(level: number): LevelDisplayConfig` function:
    - Returns glow color (null for level 1 = no tint), badge color, and badge text like "Lv.2"
    - For level 1: glow=null (no tint), badge=#999, text="Lv.1"
  - Add tests: Level 1 has no glow, Level 5 has gold glow (#FFD700), badge text formats correctly

  **Must NOT do**:
  - Do NOT modify renderTower.ts rendering code (Task 10 handles that)
  - Do NOT draw anything on canvas

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Configuration constants + simple lookup function, testable
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4)
  - **Blocks**: Task 10
  - **Blocked By**: Task 1 (needs LEVEL_COLORS from constants)

  **References** (CRITICAL):
  - `src/game/constants.ts` — Where `LEVEL_COLORS` and `LEVEL_BADGE_COLORS` were defined in Task 1
  - `src/game/renderer/renderTower.ts:26-44` — `renderTower()` function — badge will be positioned relative to `tx, ty` (tower center coords)
  - `src/game/constants.ts:17` — `TILE_SIZE = 64` — badge positioning context

  **Acceptance Criteria**:
  - [ ] `getLevelDisplayConfig(1).glowColor` is null
  - [ ] `getLevelDisplayConfig(2).glowColor` is `'#4CAF50'` (green)
  - [ ] `getLevelDisplayConfig(5).glowColor` is `'#FFD700'` (gold)
  - [ ] `getLevelDisplayConfig(3).badgeText` is `'Lv.3'`
  - [ ] `npm test` → level display tests PASS (≥5 test cases)

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Verify level display config for all levels
    Tool: Bash (vitest)
    Preconditions: Tests and implementation complete
    Steps:
      1. Run: npm test -- src/game/__tests__/upgrade.test.ts
      2. Assert "level 1 has no glow" passes
      3. Assert "level 5 badge color is gold" passes
      4. Assert "badge text format is Lv.N" passes
    Expected Result: Correct colors and text for all 5 levels
    Failure Indicators: Wrong colors, null not returned for level 1, text format wrong
    Evidence: .sisyphus/evidence/task-5-display-tests.txt
  ```

  **Evidence to Capture**:
  - [ ] `task-5-display-tests.txt` — display config test output

  **Commit**: YES
  - Message: `feat(display): add getLevelDisplayConfig() for level badge and tint colors`
  - Files: `src/game/constants.ts`, `src/game/__tests__/upgrade.test.ts`
  - Pre-commit: `npm test`

---

- [x] 6. Combat System Level-Awareness

  **What to do**:
  - In `src/game/combatSystem.ts`, modify `towerAttacks()` function:
    - Replace `const towerType = TOWER_TYPES[tower.type]` (line 96) with `const stats = getTowerStats(tower.type, tower.level)`
    - Replace `towerType.attackSpeed` (line 97) with `stats.attackSpeed`
    - Replace `towerType.range` (line 103) with `stats.range`
    - Replace `towerType.damage` (line 110) with `stats.damage`
    - Replace `towerType.type` (line 110) with `TOWER_TYPES[tower.type].type` (type doesn't change by level)
    - Replace `towerType.aoeRadius` (line 110) with `TOWER_TYPES[tower.type].aoeRadius` (AOE radius doesn't scale)
    - Replace `towerType.type as 'single' | 'aoe'` (line 110) with same from TOWER_TYPES
  - Add `getTowerStats` import from constants
  - The projectile speed calculation on line 110 also used `tower.type` — ensure projectile speed stays as-is (not level-dependent, using TOWER_TYPES base config)
  - Ensure `tower.level` defaults to 1 for any tower that might not have the field (backward compat)

  **Must NOT do**:
  - Do NOT change attack speed with level (it stays the same)
  - Do NOT change AOE radius with level
  - Do NOT modify projectile trajectory or lifetime

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Critical game logic change, must verify all 5 tower type references are updated correctly
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 7)
  - **Parallel Group**: Wave 2 (with Tasks 7, 8, 9)
  - **Blocks**: Task 14
  - **Blocked By**: Task 2 (needs getTowerStats)

  **References** (CRITICAL):
  - `src/game/combatSystem.ts:94-113` — `towerAttacks()` — EXACT function to modify, every `towerType.*` reference
  - `src/game/combatSystem.ts:96` — Line `const towerType = TOWER_TYPES[tower.type]` — replace with `getTowerStats()`
  - `src/game/combatSystem.ts:103` — Range check `dist <= towerType.range` — now uses level-scaled range
  - `src/game/combatSystem.ts:110` — Damage assignment `damage: towerType.damage` — now uses level-scaled damage
  - `src/game/constants.ts` — `getTowerStats()` from Task 2
  - `src/game/__tests__/upgrade.test.ts` — Existing getTowerStats tests verify correctness

  **Acceptance Criteria**:
  - [ ] `towerAttacks()` uses `getTowerStats(tower.type, tower.level)` for damage, range, attackSpeed
  - [ ] Projectile type and AOE radius still read from `TOWER_TYPES` (not level-scaled)
  - [ ] Level 5 Tabby projectiles have damage ~31 (not base 15)
  - [ ] Level 5 Siamese range is ~243 (200 × 1.05^4 ≈ 243)
  - [ ] `npm test` — all existing tests still pass (no regression)
  - [ ] `npm run build` passes

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Verify level-scaled damage in combat
    Tool: Bash
    Preconditions: Game running (npm run dev), level 5 tower placed
    Steps:
      1. Start game, place a Tabby (level 1)
      2. Simulate or manually upgrade to level 5 (via Task 8)
      3. Observe projectile damage numbers in combat
      4. Verify damage ≈31 (not 15)
    Expected Result: Higher-level towers deal more damage proportional to level
    Failure Indicators: All levels deal same damage, damage wrong
    Evidence: .sisyphus/evidence/task-6-damage-scaling.txt

  Scenario: Verify level-scaled range
    Tool: Bash (vitest)
    Preconditions: Integration test setup
    Steps:
      1. Run integration test: getTowerStats(1, 5).range === ~243
      2. Run integration test: getTowerStats(0, 1).range === 100
      3. Assert level 5 Siamese range > level 1 range
    Expected Result: Range grows by 1.05x per level
    Failure Indicators: Range unchanged, wrong multiplier
    Evidence: .sisyphus/evidence/task-6-range-scaling.txt
  ```

  **Evidence to Capture**:
  - [ ] `task-6-damage-scaling.txt` — combat damage verification
  - [ ] `task-6-range-scaling.txt` — range scaling verification

  **Commit**: YES
  - Message: `feat(combat): make tower attacks use level-scaled damage and range`
  - Files: `src/game/combatSystem.ts`
  - Pre-commit: `npm test && npm run build`

---

- [x] 7. Upgrade Mode State + Tower Click Detection in App.tsx

  **What to do**:
  - Add `upgradeMode: boolean` state to App.tsx (default false)
  - Add `selectedTowerIndex: number | null` state (null = no tower selected for upgrade/sell)
  - Track `upgradeUnlocked` per type in `gameRef.current` (from Task 1)
  - **Wave gate**: Hide/disable upgrade mode button when `wave < UPGRADE_UNLOCK_WAVE` (wave 3) or during Level 1 tutorial
  - Update `handleCanvasClick` in App.tsx (around line 148):
    - When `upgradeMode` is true AND tile has a tower (`map[tileY][tileX] === 4`):
      - Find tower at that tile → set `selectedTowerIndex`
      - Do NOT place new towers when in upgrade mode
    - When `upgradeMode` is false: existing behavior (box break / tower place)
  - Add `handleSelectUpgradeMode()` callback: toggle `upgradeMode`, deselect any tower type selection
  - Add `handleDeselectTower()` callback: set `selectedTowerIndex` to null
  - Add canvas cursor change: `crosshair` for placement mode, `pointer` for upgrade mode
  - Add visual hint: when in upgrade mode, draw a subtle highlight on hovered towers
  - **Unlock tracking**: Use `gameRef.current.upgradeUnlocked[type]` to check if type can be upgraded; if not yet unlocked, show unlock prompt instead of upgrade button

  **Must NOT do**:
  - Do NOT implement actual upgrade/sell logic (Tasks 8, 9 handle that)
  - Do NOT create the popup UI component (Task 11 handles that)
  - Do NOT add the upgrade mode button to the panel (Task 12 handles that)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Core state management in the main App component, multiple interaction modes
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 6)
  - **Parallel Group**: Wave 2 (with Tasks 6, 8, 9)
  - **Blocks**: Tasks 8, 9, 11, 12
  - **Blocked By**: Task 1 (needs Tower.level field)

  **References** (CRITICAL):
  - `src/App.tsx:46-69` — State declarations — add `upgradeMode` and `selectedTowerIndex` here
  - `src/App.tsx:148-177` — `handleCanvasClick` — add upgrade mode detection BEFORE existing box/tower logic
  - `src/App.tsx:168` — Line `state.map[tileY][tileX] === 0` — tower placement check; upgrade mode must bypass this
  - `src/App.tsx:191-194` — `handleSelectTower` — deselect upgrade mode when selecting tower type
  - `src/App.tsx:347-355` — Inline tower buttons — where upgrade mode toggle button will be added (Task 12)
  - `src/game/types.ts:29-35` — `Tower` interface with `level` field
  - `src/game/constants.ts:17` — `TILE_SIZE` — for coordinate math in tower detection
  - `src/game/constants.ts:425` — `TILE.TOWER = 4` — map tile value for occupied tower tiles

  **Acceptance Criteria**:
  - [ ] `upgradeMode` state toggles correctly via `handleSelectUpgradeMode()`
  - [ ] Upgrading mode button hidden/disabled when `wave < 3` in Level 2
  - [ ] Upgrade mode unavailable during Level 1 tutorial (any wave)
  - [ ] Clicking a tower tile in upgrade mode sets `selectedTowerIndex`
  - [ ] Clicking empty tile in upgrade mode does NOT place a tower
  - [ ] Deselecting upgrade mode (selecting a tower type) clears `selectedTowerIndex`
  - [ ] `selectedTowerIndex` is null after box break or empty tile click
  - [ ] `upgradeUnlocked[type]` correctly tracked per tower type (starts false, set true after paying unlock fee)
  - [ ] Canvas cursor changes: pointer on tower tiles in upgrade mode, crosshair otherwise
  - [ ] `npm run build` passes (no TS errors)

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Enter upgrade mode and select a tower
    Tool: Playwright (playwright skill)
    Preconditions: Game running, at least 1 tower placed on field
    Steps:
      1. Navigate to game, start game, place a Tabby tower at tile (5, 3)
      2. Click "Upgrade Mode" button (when added by Task 12)
      3. Click on the placed tower tile (5, 3)
      4. Assert selectedTowerIndex is set (tower is now selected)
      5. Assert no new tower was placed
    Expected Result: Clicking existing tower in upgrade mode selects it
    Failure Indicators: New tower placed instead, tower not selected, crash
    Evidence: .sisyphus/evidence/task-7-select-tower.png

  Scenario: Exit upgrade mode by selecting tower type
    Tool: Playwright (playwright skill)
    Preconditions: In upgrade mode with a tower selected
    Steps:
      1. Select a tower type from tower panel (e.g., Spitting Tabby)
      2. Assert upgradeMode becomes false
      3. Assert selectedTowerIndex becomes null
      4. Click empty tile → new tower placed normally
    Expected Result: Switching to tower placement clears upgrade state
    Failure Indicators: Upgrade mode persists, tower not placed
    Evidence: .sisyphus/evidence/task-7-exit-mode.png
  ```

  **Evidence to Capture**:
  - [ ] `task-7-select-tower.png` — screenshot of tower selected in upgrade mode
  - [ ] `task-7-exit-mode.png` — screenshot after exiting upgrade mode

  **Commit**: YES
  - Message: `feat(ui): add upgrade mode state and tower click detection`
  - Files: `src/App.tsx`
  - Pre-commit: `npm run build`

---

- [x] 8. Upgrade Execution Handler

  **What to do**:
  - In `App.tsx`, create `handleUpgrade()` callback:
    - Accepts `towerIndex: number` (index into `gameRef.current.towers`)
    - Gets the tower at that index
    - **Check unlock state**: If `!gameRef.current.upgradeUnlocked[tower.type]`:
      - Calculate `unlockCost = getUnlockCost(gameRef.current.towers.length)` (real-time, based on current total towers)
      - If `gold >= unlockCost`: deduct gold, set `upgradeUnlocked[tower.type] = true`, return (upgrade itself is separate action after unlock)
      - If `gold < unlockCost`: show feedback and return
    - Calls `getUpgradeCost(tower.type, tower.level)` — if null (MAX), return early
    - Validates `gold >= upgradeCost` — if not enough gold, show brief "Not enough gold!" feedback and return
    - Deducts gold via `setGold(g => g - upgradeCost)`
    - Increments `tower.level` by 1
    - Adds `upgradeCost` to `tower.totalInvested`
    - Gets tower tile coords: `tileX = Math.floor((tower.x - TILE_SIZE/2) / TILE_SIZE)`, `tileY` similarly
    - Calls `spawnUpgradeParticles(gameRef.current, tileX, tileY)` (from Task 4)
    - Activates glow state: `upgradeGlowRef.current = { active: true, towerX: tower.x, towerY: tower.y, frame: UPGRADE_GLOW_DURATION }`
    - Deselects tower after upgrade: `setSelectedTowerIndex(null)`
  - Add `handleUnlockType(type: number)` callback (or merge into handleUpgrade):
    - First click on locked tower → shows unlock cost → pay → unlocks type
    - Second click → normal upgrade flow
  - Add `upgradeGlowRef` to App.tsx (similar to `shakeRef`) for glow animation state
  - Pass glow state to renderer in the render loop

  **Must NOT do**:
  - Do NOT add sell logic (Task 9)
  - Do NOT render the popup or glow (Tasks 10, 11)
  - Do NOT add confirmation dialog (upgrade is immediate)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Core game state mutation (gold, tower level, particles), multiple refs and state updates
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 9)
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 9)
  - **Blocks**: Task 14
  - **Blocked By**: Tasks 4 (spawnUpgradeParticles), 7 (upgrade mode state)

  **References** (CRITICAL):
  - `src/App.tsx:148-177` — `handleCanvasClick` — upgrade handler may be called from here or from popup button (Task 11)
  - `src/App.tsx:50` — `gold` state and `setGold` — deduct gold on upgrade
  - `src/App.tsx:62` — `gameRef` — mutable towers array at `gameRef.current.towers[towerIndex]`
  - `src/App.tsx:63` — `shakeRef` — glowRef follows same pattern
  - `src/game/gameEngine.ts` — `spawnUpgradeParticles()` from Task 4
  - `src/game/constants.ts` — `getUpgradeCost()` from Task 3
  - `src/game/constants.ts:17` — `TILE_SIZE` — for converting tower pixel coords to tile coords
  - `src/App.tsx:172` — Tower creation line — `totalInvested` field initialized here, incremented on upgrade

  **Acceptance Criteria**:
  - [ ] First upgrade attempt on locked type: unlock cost shown, pay → type unlocked, all towers of that type can now upgrade
  - [ ] Unlock cost = `min(currentTowerCount × 100, 2000)` calculated at click moment
  - [ ] After unlock, upgrading Lv1→Lv2 Tabby costs 100 gold and increases damage from 15→18
  - [ ] Gold correctly deducted for unlock AND upgrade (separate transactions)
  - [ ] Gold insufficient for unlock → blocked, no state change
  - [ ] Gold insufficient for upgrade → blocked, no state change
  - [ ] Level 5 tower → upgrade blocked (MAX), no state change
  - [ ] Upgrade particles spawn at correct tower position
  - [ ] Glow state activates with correct position and frame count
  - [ ] `totalInvested` increases correctly (does NOT include unlock fee — unlock is separate)
  - [ ] `npm run build` passes

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Upgrade Tabby from level 1 to level 2
    Tool: Playwright (playwright skill)
    Preconditions: Game started, Tabby placed at (5,3), gold >= 100
    Steps:
      1. Enter upgrade mode (click upgrade button)
      2. Click Tabby tower at (5,3) to select it
      3. Click "Upgrade" button in popup (or trigger upgrade)
      4. Assert gold decreased by 100 (initial 200 → 100)
      5. Assert tower.level changed to 2
      6. Assert gold sparkle particles visible at tower position
      7. Assert tower shows "Lv.2" badge
    Expected Result: Tower upgraded with correct gold deduction and visual feedback
    Failure Indicators: Gold unchanged, no particles, level badge missing
    Evidence: .sisyphus/evidence/task-8-upgrade-success.png

  Scenario: Try upgrading with insufficient gold
    Tool: Playwright (playwright skill)
    Preconditions: Gold < upgrade cost (e.g., gold = 30, Tabby Lv1→Lv2 = 100)
    Steps:
      1. Enter upgrade mode, select tower
      2. Assert upgrade button is disabled or shows "Not enough gold"
      3. Try clicking upgrade (if not disabled)
      4. Assert gold unchanged, tower level unchanged
    Expected Result: Upgrade blocked gracefully when gold insufficient
    Failure Indicators: Gold goes negative, upgrade succeeds with 0 gold
    Evidence: .sisyphus/evidence/task-8-insufficient-gold.png

  Scenario: Max level tower shows no upgrade option
    Tool: Playwright (playwright skill)
    Preconditions: Tower at level 5 (max)
    Steps:
      1. Enter upgrade mode, select max-level tower
      2. Assert "MAX" shown instead of upgrade cost
      3. Assert no way to spend gold on this tower
    Expected Result: Level cap enforced
    Failure Indicators: Level 6 exists, gold spent on max tower
    Evidence: .sisyphus/evidence/task-8-max-level.png
  ```

  **Evidence to Capture**:
  - [ ] `task-8-upgrade-success.png` — screenshot after successful upgrade
  - [ ] `task-8-insufficient-gold.png` — screenshot of blocked upgrade
  - [ ] `task-8-max-level.png` — screenshot of max level display

  **Commit**: YES
  - Message: `feat(upgrade): implement upgrade execution with gold deduction, level increment, and particles`
  - Files: `src/App.tsx`
  - Pre-commit: `npm test && npm run build`

---

- [x] 9. Sell Execution Handler

  **What to do**:
  - In `App.tsx`, create `handleSell()` callback:
    - Accepts `towerIndex: number`
    - Gets tower at that index from `gameRef.current.towers[towerIndex]`
    - Calculates sell value via `getSellValue(tower)` from Task 3
    - Removes tower from `gameRef.current.towers` array: `splice(towerIndex, 1)`
    - Updates map tile to empty: `gameRef.current.map[tileY][tileX] = TILE.EMPTY (0)`
    - Adds gold refund: `setGold(g => g + sellValue)`
    - Deselects tower: `setSelectedTowerIndex(null)`
    - Exits upgrade mode: sets `upgradeMode` to false (avoids confusion after selling)
  - Add sell particle effect: small brown/grey particles (like box break but smaller, count=8) — reuse `createParticle()` with color `'#8D6E63'`
  - Add confirmation step: when user clicks "Sell", show brief confirmation ("Sell for X gold?") before executing, or use a two-click flow (first click shows sell button, second confirms)

  **Must NOT do**:
  - Do NOT refund more than 50% of totalInvested
  - Do NOT leave ghost tower data after selling
  - Do NOT allow selling when no tower is selected

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: State mutation across multiple refs and React state, requires careful cleanup
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 8)
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8)
  - **Blocks**: Task 14
  - **Blocked By**: Tasks 3 (getSellValue), 7 (selectedTowerIndex state)

  **References** (CRITICAL):
  - `src/App.tsx:62` — `gameRef.current.towers` — splice tower at index
  - `src/App.tsx:62` — `gameRef.current.map` — set map[tileY][tileX] = 0 (TILE.EMPTY)
  - `src/game/constants.ts:409-415` — `TILE.EMPTY = 0` — reset tile to buildable
  - `src/game/constants.ts` — `getSellValue()` from Task 3
  - `src/App.tsx:50` — `setGold` — add sell refund
  - `src/App.tsx:159-166` — Box breaking pattern — similar Remove-from-array + Update-map + Add-gold flow
  - `src/game/gameEngine.ts:32-43` — `createParticle()` — reuse for sell particles

  **Acceptance Criteria**:
  - [ ] Sell returns `Math.floor(totalInvested * 0.5)` gold
  - [ ] Tower removed from `state.towers` array
  - [ ] Map tile updated from `TILE.TOWER (4)` to `TILE.EMPTY (0)`
  - [ ] Gold correctly refunded (increases by sell value)
  - [ ] Cannot sell when no tower selected
  - [ ] After selling, `selectedTowerIndex` is null and `upgradeMode` is false
  - [ ] Sell particles spawn at tower position (grey/brown)
  - [ ] `npm test` — sell value tests still pass
  - [ ] `npm run build` passes

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Sell a level 1 Tabby for 25 gold
    Tool: Playwright (playwright skill)
    Preconditions: Tabby placed (cost 50), gold = 150
    Steps:
      1. Enter upgrade mode, select Tabby tower
      2. Click "Sell" button, confirm if needed
      3. Assert tower disappears from map
      4. Assert gold increases to 175 (150 + 25)
      5. Assert map tile is now empty (buildable)
    Expected Result: Tower sold, correct gold refund, tile cleared
    Failure Indicators: Wrong refund amount, tower still on map, gold unchanged
    Evidence: .sisyphus/evidence/task-9-sell-success.png

  Scenario: Sell a level 3 Tabby for correct refund
    Tool: Playwright (playwright skill)
    Preconditions: Tabby upgraded to level 3 (totalInvested = 50 + 100 + 200 = 350)
    Steps:
      1. Sell the level 3 Tabby
      2. Assert refund = Math.floor(350 * 0.5) = 175
      3. Assert tower removed and tile cleared
    Expected Result: Progressive refund reflects all upgrades
    Failure Indicators: Only base cost refunded, wrong math
    Evidence: .sisyphus/evidence/task-9-sell-level3.png
  ```

  **Evidence to Capture**:
  - [ ] `task-9-sell-success.png` — screenshot after sell with gold update
  - [ ] `task-9-sell-level3.png` — screenshot after selling upgraded tower

  **Commit**: YES
  - Message: `feat(sell): implement sell tower handler with 50% refund and map cleanup`
  - Files: `src/App.tsx`
  - Pre-commit: `npm test && npm run build`

---

- [x] 10. Tower Level Rendering — Badge + Color Tint

  **What to do**:
  - In `src/game/renderer/renderTower.ts`, modify `renderTower()` function:
    - After rendering the cat (existing code), add level badge rendering
    - Draw badge text at position `(tower.x + LEVEL_BADGE_OFFSET.x, tower.y + LEVEL_BADGE_OFFSET.y)`
    - Use `getLevelDisplayConfig(tower.level)` for colors and text
    - Badge style: white text with black outline (2px stroke), `LEVEL_BADGE_FONT`
    - Draw badge background: small rounded rect behind text for readability
  - Add color tint to each cat render function:
    - Before rendering body/head/ears, check `getLevelDisplayConfig(tower.level).glowColor`
    - If glowColor is not null (level ≥ 2):
      - Save context, set `ctx.globalAlpha = 0.15`, draw a colored glow circle behind the cat
      - Use `ctx.shadowColor = glowColor` and `ctx.shadowBlur = 8 + level * 2` for subtle aura
    - Higher levels get progressively more saturated/brighter body colors:
      - Instead of creating new render functions, apply a semi-transparent colored overlay on top of the existing cat
  - Ensure `tower.level` is accessed (default to 1 for backwards compat)
  - The render functions receive `tower: Tower` which now has `.level`

  **Must NOT do**:
  - Do NOT redesign cat shapes or proportions
  - Do NOT change the existing cat drawing code structure (add tint AFTER existing render)
  - Do NOT add glow animation here (that's the upgrade glow pulse from Task 4, rendered separately)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Canvas 2D rendering with color overlays, shadows, and text badges — purely visual work
  - **Skills**: []
    - No special skills needed — standard Canvas 2D API

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 11, 12, 13)
  - **Blocks**: Task 14
  - **Blocked By**: Tasks 1 (level field), 5 (display config)

  **References** (CRITICAL):
  - `src/game/renderer/renderTower.ts:26-44` — `renderTower()` — add badge + tint AFTER existing cat render
  - `src/game/renderer/renderTower.ts:52-125` — `renderSpittingTabby()` — Tabby colors: body #FF8C42, head #FF8C42
  - `src/game/renderer/renderTower.ts:133-207` — `renderSiameseSniper()` — Siamese colors: body #B0BEC5
  - `src/game/renderer/renderTower.ts:215-288` — `renderOrangeBreadCat()` — Orange colors: body #FF9800
  - `src/game/constants.ts` — `getLevelDisplayConfig()` from Task 5 — badge text, colors
  - `src/game/constants.ts` — `LEVEL_BADGE_OFFSET`, `LEVEL_BADGE_FONT` from Task 5
  - `src/game/types.ts:29-35` — `Tower` interface with `level` field

  **Acceptance Criteria**:
  - [ ] Level 1 towers show no color tint (only base rendering)
  - [ ] Level 2 towers show green tint/glow
  - [ ] Level 3 towers show blue tint/glow
  - [ ] Level 5 towers show gold tint/glow
  - [ ] Badge text "Lv.N" visible at top-right of each tower
  - [ ] Badge has white text with black outline, readable against all backgrounds
  - [ ] Tint intensity increases visibly with level (shadowBlur grows)
  - [ ] All 3 cat types receive correct per-level rendering
  - [ ] `npm run build` passes
  - [ ] No visual regression for existing non-upgraded game state (level=1)

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Level 5 tower shows gold tint and badge
    Tool: Playwright (playwright skill)
    Preconditions: Tower upgraded to level 5 (via Task 8)
    Steps:
      1. Place and upgrade a Tabby to level 5
      2. Take screenshot of the tower on map
      3. Assert gold glow visible around the cat
      4. Assert "Lv.5" badge visible at top-right
      5. Assert cat colors are more saturated than level 1
    Expected Result: Gold aura + Lv.5 badge clearly visible
    Failure Indicators: No badge, no tint, badge unreadable
    Evidence: .sisyphus/evidence/task-10-level5-tower.png

  Scenario: Level 1 tower has no tint (baseline)
    Tool: Playwright (playwright skill)
    Preconditions: Freshly placed level 1 Tabby
    Steps:
      1. Place Tabby at level 1
      2. Take screenshot
      3. Assert no colored glow/tint visible
      4. Assert "Lv.1" badge visible (subtle grey)
    Expected Result: Clean baseline rendering with Lv.1 badge
    Failure Indicators: Glow present at level 1, no badge
    Evidence: .sisyphus/evidence/task-10-level1-tower.png

  Scenario: All three cat types show correct level display
    Tool: Playwright (playwright skill)
    Preconditions: One of each cat type placed, all at level 3
    Steps:
      1. Place Tabby, Siamese, Orange cats, each at level 3
      2. Take screenshot showing all three
      3. Assert each shows blue tint + "Lv.3" badge
    Expected Result: Consistent level display across all cat types
    Failure Indicators: Different badge positions, missing badges, wrong colors
    Evidence: .sisyphus/evidence/task-10-all-types.png
  ```

  **Evidence to Capture**:
  - [ ] `task-10-level5-tower.png` — level 5 tower with gold glow
  - [ ] `task-10-level1-tower.png` — level 1 baseline
  - [ ] `task-10-all-types.png` — all 3 types at level 3

  **Commit**: YES
  - Message: `feat(render): add level badge and color tint to tower rendering`
  - Files: `src/game/renderer/renderTower.ts`
  - Pre-commit: `npm run build`

---

- [x] 11. Upgrade Popup UI Component

  **What to do**:
  - Create an `UpgradePopup` React component (or add inline rendering in App.tsx):
    - Positioned as an absolute overlay near the selected tower
    - **Two modes based on unlock state**:
      - **Locked type**: Shows "🔒 Unlock Upgrades" with unlock cost `getUnlockCost(towerCount)`, and "Unlock for Xg" button (disabled if gold insufficient)
      - **Unlocked type**: Shows tower name, current level (e.g., "Lv.2 → Lv.3"), current damage, next level damage, upgrade cost
    - Shows "Upgrade" button (disabled if gold insufficient or max level)
    - Shows "Sell" button with refund amount (e.g., "Sell for 175g") — always available regardless of unlock state
    - "MAX" label replaces upgrade button at level 5
    - Close/dismiss button (X) to deselect tower
  - Style: Rounded pink/white box with shadow, matching existing Kawaii aesthetic (use `towerButtonStyle` colors)
  - Add styles to `src/game/styles.ts`: `upgradePopupStyle`, `upgradePopupButtonStyle`, `upgradePopupCloseStyle`, `unlockPopupStyle`
  - The popup renders conditionally: only when `selectedTowerIndex !== null` and `upgradeMode === true`
  - Position: centered near the tower, but clamped to not overflow canvas edges
  - Wire `handleUpgrade()` and `handleSell()` from Tasks 8, 9 as button onClick handlers

  **Must NOT do**:
  - Do NOT implement the upgrade/sell logic (already done in Tasks 8, 9)
  - Do NOT add the upgrade mode toggle button (Task 12)
  - Do NOT add tutorial steps

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: React UI component with inline styles, Kawaii aesthetic, positioned overlay
  - **Skills**: []
    - Pure React + CSS-in-JS, no special skills needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 10, 12, 13)
  - **Blocks**: Task 14
  - **Blocked By**: Tasks 2 (stats for display), 3 (cost for display), 7 (selectedTowerIndex state)

  **References** (CRITICAL):
  - `src/game/styles.ts:77-92` — `towerButtonStyle` — color palette for matching popup style
  - `src/game/styles.ts:233-247` — `overlayContainerStyle` — overlay pattern for positioning
  - `src/App.tsx:315-322` — Level announcement overlay — similar absolute positioning pattern
  - `src/game/i18n.ts:29-30` — `towerNames` — tower name display in popup
  - `src/game/constants.ts` — `getTowerStats()`, `getUpgradeCost()`, `getSellValue()` — data for popup display
  - `src/App.tsx:46-69` — React state: `selectedTowerIndex`, `upgradeMode`, `gold`
  - `src/App.tsx:62` — `gameRef.current.towers` — access selected tower data

  **Acceptance Criteria**:
  - [ ] Popup appears when tower selected in upgrade mode (wave ≥ 3)
  - [ ] **Locked type popup**: Shows "🔒 Unlock Upgrades" + unlock cost + disabled state if gold insufficient
  - [ ] **Unlocked type popup**: Shows tower name + current level → next level, current damage → next damage, upgrade cost
  - [ ] "Unlock" button pays fee, sets `upgradeUnlocked[type] = true`, popup refreshes to show upgrade options
  - [ ] "Upgrade" button disabled when gold < cost or at max level
  - [ ] "MAX" shown when tower is level 5
  - [ ] "Sell for Xg" button visible with correct refund amount (always available)
  - [ ] Close button (X) deselects tower and hides popup
  - [ ] Popup position does not overflow canvas boundaries
  - [ ] Matches Kawaii aesthetic (pink/white rounded, shadow, Fredoka One font)
  - [ ] `npm run build` passes

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Popup shows correct upgrade info for level 1 Tabby
    Tool: Playwright (playwright skill)
    Preconditions: Level 1 Tabby placed, gold = 200
    Steps:
      1. Enter upgrade mode, click Tabby tower
      2. Assert popup appears near tower
      3. Assert popup shows "Spitting Tabby Lv.1 → Lv.2"
      4. Assert popup shows "Damage: 15 → 18"
      5. Assert popup shows "Cost: 100 🪙"
      6. Assert "Upgrade" button is enabled (gold >= 100)
      7. Assert "Sell for 25g" button visible
    Expected Result: Complete upgrade info displayed correctly
    Failure Indicators: Popup missing, wrong stats, enabled/disabled wrong
    Evidence: .sisyphus/evidence/task-11-popup-info.png

  Scenario: Popup shows MAX for level 5 tower
    Tool: Playwright (playwright skill)
    Preconditions: Tower upgraded to level 5
    Steps:
      1. Select the level 5 tower in upgrade mode
      2. Assert popup shows "MAX" instead of upgrade button
      3. Assert no upgrade cost displayed
      4. Assert "Sell" button still visible
    Expected Result: Clear MAX indication, no upgrade possible
    Failure Indicators: "Upgrade" button still shown, cost displayed
    Evidence: .sisyphus/evidence/task-11-max-popup.png

  Scenario: Popup closes on X button
    Tool: Playwright (playwright skill)
    Preconditions: Popup visible with tower selected
    Steps:
      1. Click the X/close button on popup
      2. Assert popup disappears
      3. Assert selectedTowerIndex is null
      4. Assert still in upgrade mode (can select another tower)
    Expected Result: Clean dismiss, still in upgrade mode
    Failure Indicators: Popup persists, mode exits unexpectedly
    Evidence: .sisyphus/evidence/task-11-close-popup.png
  ```

  **Evidence to Capture**:
  - [ ] `task-11-popup-info.png` — popup with full upgrade info
  - [ ] `task-11-max-popup.png` — popup at max level
  - [ ] `task-11-close-popup.png` — after closing popup

  **Commit**: YES
  - Message: `feat(ui): add upgrade popup with stats, cost, upgrade and sell buttons`
  - Files: `src/App.tsx`, `src/game/styles.ts`
  - Pre-commit: `npm run build`

---

- [x] 12. Tower Panel — Upgrade Mode Button (Desktop + Phone)

  **What to do**:
  - In App.tsx inline tower panel (lines 347-355), add a 4th button for upgrade mode:
    - Position: to the right of the 3 tower type buttons
    - Label: "⬆️ Upgrade" (or use i18n key)
    - Visual: different style — golden/orange gradient to distinguish from tower placement buttons
    - When clicked: calls `handleSelectUpgradeMode()` (from Task 7)
    - Active state: button glows/highlights when `upgradeMode === true`
    - When in upgrade mode, deselect any tower type selection
  - Add phone styles for the upgrade mode button (compact version)
    - Use `towerButtonPhoneStyle` pattern for consistency
    - Smaller emoji/icon, compact padding
  - Ensure the upgrade mode button is disabled during game states where towers can't be modified (start screen, game over, victory, paused)

  **Must NOT do**:
  - Do NOT add sell button here (sell is in the popup)
  - Do NOT modify the unused TowerPanel.tsx component

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI button addition with styling, dual responsive layouts, state-based visual feedback
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 10, 11, 13)
  - **Blocks**: Task 14
  - **Blocked By**: Task 7 (upgradeMode state + handleSelectUpgradeMode)

  **References** (CRITICAL):
  - `src/App.tsx:347-355` — Inline tower buttons — add 4th button here
  - `src/App.tsx:347` — Desktop tower panel `towerPanelStyle` — add button to this flex row
  - `src/App.tsx:348` — Phone tower panel `towerPanelPhoneStyle` — add compact button
  - `src/game/styles.ts:77-92` — `towerButtonStyle` — base button style pattern
  - `src/game/styles.ts:325-340` — `towerButtonPhoneStyle` — phone button pattern
  - `src/App.tsx:191-194` — `handleSelectTower` — upgrade mode button calls `handleSelectUpgradeMode()` instead
  - `src/App.tsx:47` — `upgradeMode` state — used for active/inactive button styling

  **Acceptance Criteria**:
  - [ ] 4th button visible in tower panel labeled "Upgrade" with distinct style
  - [ ] Button hidden/disabled when `wave < 3` in Level 2 or during Level 1 tutorial
  - [ ] Button appears/enables at wave 3 with visual reveal (optional subtle animation)
  - [ ] Clicking upgrade mode button sets `upgradeMode = true` and deselects any tower type
  - [ ] Upgrade button shows active/highlighted state when mode is on
  - [ ] Selecting a tower type button exits upgrade mode
  - [ ] Button visible and usable on both desktop and phone layouts
  - [ ] Button disabled on start/gameover/victory/paused screens
  - [ ] `npm run build` passes

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Enter and exit upgrade mode via panel button
    Tool: Playwright (playwright skill)
    Preconditions: Game in 'playing' state
    Steps:
      1. Click "Upgrade" button in tower panel
      2. Assert upgrade mode is active (button highlighted)
      3. Assert tower type selection cleared
      4. Click a tower type button (e.g., Spitting Tabby)
      5. Assert upgrade mode deactivated (button no longer highlighted)
      6. Assert tower type selected for placement
    Expected Result: Smooth toggle between upgrade and placement modes
    Failure Indicators: Both modes active simultaneously, button unresponsive
    Evidence: .sisyphus/evidence/task-12-mode-toggle.png

  Scenario: Upgrade button disabled during game over
    Tool: Playwright (playwright skill)
    Preconditions: Game over state
    Steps:
      1. Assert "Upgrade" button is disabled (greyed out, not clickable)
    Expected Result: Cannot enter upgrade mode when game is over
    Failure Indicators: Button clickable during game over
    Evidence: .sisyphus/evidence/task-12-disabled-state.png
  ```

  **Evidence to Capture**:
  - [ ] `task-12-mode-toggle.png` — screenshot showing button active/inactive states
  - [ ] `task-12-disabled-state.png` — screenshot of disabled button

  **Commit**: YES
  - Message: `feat(ui): add upgrade mode toggle button to tower panel`
  - Files: `src/App.tsx`, `src/game/styles.ts`
  - Pre-commit: `npm run build`

---

- [x] 13. i18n Keys for Upgrade/Sell UI

  **What to do**:
  - Add new text keys to `TEXTS.zh` and `TEXTS.en` in `src/game/i18n.ts`:
    - `upgrade`: "升级" / "Upgrade"
    - `upgradeMode`: "升级模式" / "Upgrade Mode"
    - `sell`: "出售" / "Sell"
    - `sellFor`: "出售获得 {gold} 金币" / "Sell for {gold}g"
    - `maxLevel`: "已满级" / "MAX"
    - `level`: "等级" / "Lv."
    - `upgradeCost`: "升级费用" / "Upgrade Cost"
    - `damage`: "攻击力" / "Damage"
    - `range`: "范围" / "Range"
    - `notEnoughGold`: "金币不足!" / "Not enough gold!"
    - `confirmSell`: "确定出售?" / "Confirm sell?"
    - **NEW**: `unlockUpgrades`: "解锁升级" / "Unlock Upgrades"
    - **NEW**: `unlockCost`: "解锁费用" / "Unlock Cost"
    - **NEW**: `unlockHint`: "付一次解锁该类型所有猫咪的升级" / "Pay once to unlock upgrades for all cats of this type"
    - **NEW**: `locked`: "🔒 未解锁" / "🔒 Locked"
    - **NEW**: `upgradeLockedWave`: "第3波后解锁升级功能" / "Upgrades unlock after Wave 3"
  - Update all new UI elements to use `TEXT(lang)` for text:
    - Upgrade mode button label
    - Popup labels (upgrade cost, damage, range, level)
    - Sell button and confirmation text
    - MAX label
    - "Not enough gold" feedback
  - Ensure `langRef` and `tRef` in App.tsx reflect new keys

  **Must NOT do**:
  - Do NOT add new languages (only zh + en)
  - Do NOT modify existing tower name translations

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Text key additions, simple translation mapping, no logic
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 10, 11, 12)
  - **Blocks**: Task 14
  - **Blocked By**: None (pure text additions, no code dependencies)

  **References** (CRITICAL):
  - `src/game/i18n.ts:22-97` — `TEXTS` object — add keys to both `zh` and `en` blocks
  - `src/game/i18n.ts:29-30` — `towerNames` — keep existing, add new keys alongside
  - `src/App.tsx:61` — `TEXT(lang)` usage pattern — `const t = TEXT(lang)` for accessing translations
  - `src/game/components/HUD.tsx` — Example of i18n usage in components
  - `src/game/types.ts:18` — `Language` type — `'zh' | 'en'`

  **Acceptance Criteria**:
  - [ ] All 16 new keys present in both `zh` and `en`
  - [ ] Upgrade mode button shows correct text in both languages
  - [ ] Unlock popup shows "解锁升级" / "Unlock Upgrades" with cost in correct language
  - [ ] Popup labels switch correctly when language toggled
  - [ ] "Not enough gold" feedback shows in correct language
  - [ ] "MAX" shows in correct language
  - [ ] Wave gate text ("第3波后解锁") / ("Upgrades unlock after Wave 3") shown when upgrade button hidden
  - [ ] No TypeScript errors (all keys typed correctly)
  - [ ] `npm run build` passes

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Chinese UI text for upgrade elements
    Tool: Playwright (playwright skill)
    Preconditions: Language set to Chinese (zh)
    Steps:
      1. Start game, enter upgrade mode
      2. Assert upgrade mode button shows "升级模式"
      3. Select tower → assert popup shows "升级费用", "攻击力", "出售获得 X 金币"
      4. Max level tower → assert "已满级"
    Expected Result: All upgrade UI in Chinese
    Failure Indicators: English text in Chinese mode, missing translations
    Evidence: .sisyphus/evidence/task-13-zh-text.png

  Scenario: English UI text for upgrade elements
    Tool: Playwright (playwright skill)
    Preconditions: Language set to English (en)
    Steps:
      1. Toggle language to EN
      2. Assert upgrade mode button shows "Upgrade Mode"
      3. Select tower → assert popup shows "Damage", "Upgrade Cost", "Sell for Xg"
      4. Max level tower → assert "MAX"
    Expected Result: All upgrade UI in English
    Failure Indicators: Chinese text in English mode, missing translations
    Evidence: .sisyphus/evidence/task-13-en-text.png
  ```

  **Evidence to Capture**:
  - [ ] `task-13-zh-text.png` — Chinese upgrade UI screenshot
  - [ ] `task-13-en-text.png` — English upgrade UI screenshot

  **Commit**: YES
  - Message: `feat(i18n): add upgrade/sell text keys for zh and en`
  - Files: `src/game/i18n.ts`, `src/App.tsx`
  - Pre-commit: `npm run build`

---

- [x] 14. End-to-End Integration Wire-Up

  **What to do**:
  - Verify all pieces connect correctly:
    - Upgrade mode toggle → tower selection → popup display → upgrade button → gold deduction → level increment → particle spawn → badge update → tint update
    - Sell flow: popup → sell button → confirmation → tower removal → gold refund → tile cleared
    - Max level: no upgrade option, sell still works
    - Insufficient gold: upgrade blocked, feedback shown
    - Language toggle: all text updates correctly
  - Fix any integration issues:
    - Ensure `tower.level` defaults to 1 in all code paths (new towers, test fixtures)
    - Ensure combat system reads level-scaled stats for existing and newly upgraded towers
    - Ensure renderer re-renders when level changes (canvas redraw every frame handles this)
    - Ensure phone layout doesn't break with 4th button + popup
  - Add any missing imports or exports
  - Run full game cycle: start → place towers → upgrade to level 5 → sell → victory

  **Must NOT do**:
  - Do NOT add new features — this is integration/polish only
  - Do NOT refactor existing code beyond what's needed for integration

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: End-to-end integration requiring holistic understanding of all systems
  - **Skills**: [`playwright`]
    - `playwright`: For full end-to-end gameplay verification

  **Parallelization**:
  - **Can Run In Parallel**: NO (sequential — depends on all previous tasks)
  - **Parallel Group**: Wave 3 (sequential, runs after Tasks 10, 11, 12, 13)
  - **Blocks**: F1-F4 (Final Verification)
  - **Blocked By**: Tasks 6, 8, 9, 10, 11, 12, 13

  **References** (CRITICAL):
  - `src/App.tsx` — Full game component with all handlers wired
  - `src/game/combatSystem.ts` — Level-aware combat
  - `src/game/renderer/renderTower.ts` — Level-aware rendering
  - `src/game/gameEngine.ts` — Upgrade particles + glow
  - `src/game/constants.ts` — All helper functions
  - `src/game/i18n.ts` — All translations
  - `src/game/styles.ts` — All new styles
  - `src/game/__tests__/upgrade.test.ts` — All tests

  **Acceptance Criteria**:
  - [ ] Full upgrade flow works: place → select → upgrade → visual update → combat scaling
  - [ ] Full sell flow works: select → sell → refund → tower removed → tile cleared
  - [ ] Max level cap enforced (no level 6)
  - [ ] Gold validation enforced (no negative gold)
  - [ ] All tests pass: `npm test`
  - [ ] Build succeeds: `npm run build`
  - [ ] No console errors during gameplay
  - [ ] 60 FPS maintained with upgraded towers and effects

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Complete playthrough with upgrades
    Tool: Playwright (playwright skill)
    Preconditions: Fresh game
    Steps:
      1. Start game, place 1 of each tower type
      2. Upgrade Tabby to level 5, Siamese to level 3, Orange to level 2
      3. Verify each tower shows correct badge and tint
      4. Play through 3 waves, verify combat damage scales with level
      5. Sell the level 2 Orange cat, verify gold refund and map cleanup
      6. Verify game continues normally after sell
    Expected Result: Full upgrade + sell gameplay working end-to-end
    Failure Indicators: Crashes, wrong damage, visual glitches, gold errors
    Evidence: .sisyphus/evidence/task-14-full-playthrough.png

  Scenario: Edge case — upgrade then sell same tower
    Tool: Playwright (playwright skill)
    Preconditions: Tabby placed
    Steps:
      1. Upgrade Tabby to level 3 (totalInvested = 350)
      2. Immediately sell it
      3. Assert gold refund = 175 (50% of 350)
      4. Assert tile is empty, tower gone from array
      5. Place new tower on same tile → works normally
    Expected Result: Clean upgrade→sell→replace cycle
    Failure Indicators: Ghost tower remains, tile locked, wrong refund
    Evidence: .sisyphus/evidence/task-14-upgrade-sell-cycle.png
  ```

  **Evidence to Capture**:
  - [ ] `task-14-full-playthrough.png` — end-to-end screenshot
  - [ ] `task-14-upgrade-sell-cycle.png` — upgrade→sell→replace screenshot

  **Commit**: YES
  - Message: `feat(integration): wire up full upgrade/sell system end-to-end`
  - Files: `src/App.tsx`, `src/game/combatSystem.ts`, `src/game/renderer/renderTower.ts` (integration fixes)
  - Pre-commit: `npm test && npm run build`

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, run game). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in `.sisyphus/evidence/`. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [14/14] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `npm run build` + `npm test`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, `console.log` in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp).
  Output: `Build [PASS/FAIL] | Tests [N pass/N fail] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration: upgrade→combat scaling, sell→new placement, max level cap, language toggle. Test edge cases: empty state (no towers → upgrade mode), rapid clicks, mobile layout. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance per task. Detect cross-task contamination. Flag unaccounted changes.
  Output: `Tasks [14/14 compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| Task | Message | Files | Pre-commit |
|------|---------|-------|------------|
| 1 | `feat(types): add level, totalInvested, upgradeUnlocked to game state` | `types.ts`, `constants.ts`, `mapSystem.ts`, `App.tsx` | `npm run build` |
| 2 | `feat(stats): add getTowerStats() with level-scaled damage and range` | `constants.ts`, `__tests__/upgrade.test.ts` | `npm test` |
| 3 | `feat(economy): add getUpgradeCost(), getSellValue(), and getUnlockCost()` | `constants.ts`, `__tests__/upgrade.test.ts` | `npm test` |
| 4 | `feat(effects): add spawnUpgradeParticles() and upgrade glow state` | `gameEngine.ts`, `constants.ts`, `__tests__/upgrade.test.ts` | `npm test` |
| 5 | `feat(display): add getLevelDisplayConfig() for level badge and tint colors` | `constants.ts`, `__tests__/upgrade.test.ts` | `npm test` |
| 6 | `feat(combat): make tower attacks use level-scaled damage and range` | `combatSystem.ts` | `npm test && npm run build` |
| 7 | `feat(ui): add upgrade mode state, wave gate, tower click detection` | `App.tsx` | `npm run build` |
| 8 | `feat(upgrade): implement unlock + upgrade execution with gold and particles` | `App.tsx` | `npm test && npm run build` |
| 9 | `feat(sell): implement sell tower handler with 50% refund and map cleanup` | `App.tsx` | `npm test && npm run build` |
| 10 | `feat(render): add level badge and color tint to tower rendering` | `renderer/renderTower.ts` | `npm run build` |
| 11 | `feat(ui): add upgrade/unlock popup with stats, cost, and action buttons` | `App.tsx`, `styles.ts` | `npm run build` |
| 12 | `feat(ui): add upgrade mode toggle button (hidden before wave 3)` | `App.tsx`, `styles.ts` | `npm run build` |
| 13 | `feat(i18n): add upgrade/sell/unlock text keys for zh and en` | `i18n.ts`, `App.tsx` | `npm run build` |
| 14 | `feat(integration): wire up full upgrade/sell/unlock system end-to-end` | `App.tsx` (integration fixes) | `npm test && npm run build` |

---

## Success Criteria

### Verification Commands
```bash
npm test                          # Expected: all tests pass (≥12 upgrade test cases + existing tests)
npm run build                     # Expected: TypeScript compilation succeeds, no errors
npm run dev                       # Expected: game loads, upgrade system functional
```

### Final Checklist
- [ ] All "Must Have" present (11 items verified)
- [ ] All "Must NOT Have" absent (7 guardrails verified)
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Upgrade mode hidden before Wave 3; appears at Wave 3
- [ ] Per-type unlock fee = min(towerCount × 100, 2000), real-time calculation
- [ ] 3 cat types × 5 levels = 15 upgrade states rendered correctly
- [ ] Upgrade cost doubles geometrically per level
- [ ] Damage scales by 1.2× per level
- [ ] Range scales by 1.05× per level
- [ ] Level badges visible on all towers
- [ ] Color tints visible per level
- [ ] Upgrade sparkle+glow effect plays
- [ ] Sell refunds 50% total invested
- [ ] MAX cap enforced at level 5
- [ ] Bilingual i18n complete (16 keys)
- [ ] 60 FPS maintained

