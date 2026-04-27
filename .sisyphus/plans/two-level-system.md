# Two-Level System: Tutorial + Full Game

## TL;DR

> **Quick Summary**: Split Hajimi Defense into 2 levels — Level 1 (tutorial: 1 wave, step-by-step guidance, no scoring) and Level 2 (full 15-wave game with scoring). Auto-transition between levels with prominent announcements.
>
> **Deliverables**:
> - Level system (state, constants, types)
> - Tutorial Guide overlay (step-by-step in-game guidance)
> - Level 1: 1 wave × 3 cucumbers, score locked at 0
> - Level 2: Full 15-wave game, scoring enabled
> - Level announcements (prominent start messages)
> - Auto-transition L1 → L2 after tutorial completion
>
> **Estimated Effort**: Medium  
> **Parallel Execution**: YES — 3 waves  
> **Critical Path**: Task 1 → Task 5 → Task 8 → Task 10 → F1-F4

---

## Context

### Original Request
将游戏修改为两个关卡。第一关是教程关（1波敌人，使用向导说明，不计分）；第二关为当前完整游戏（15波，计分）；两关开始有醒目提示。

### Interview Summary

**Key Discussions**:
- **Tutorial format**: In-game step-by-step guidance with overlay arrows/highlights — 4 sequential steps
- **Level transition**: Auto-transition after Level 1 complete (2-second "Level Complete" message → Level 2 auto-start)
- **Level 1 enemies**: Exactly 3 cucumbers (type 0), no scaling
- **Score in Level 1**: Displayed as 0, does not increment
- **Restart flow**: "Start Game" always begins at Level 1; Level 2 gameover → "Try Again" → Level 1
- **Test strategy**: No unit tests; Agent-Executed QA via Playwright

**Research Findings**:
- Main game logic in `src/App.tsx` (265 lines) — single component, all state managed via useState/useRef
- Wave system: `BASE_WAVES[15]`, `getWaveData()` applies scaling factor; wave auto-advance in game loop callback
- Score mutations at 2 points: box click (line 121) and enemy kill (line 160)
- Game overlays use DOM absolute positioning over canvas (path-unlock pattern at lines 231-250 is reusable template)
- Tutorial tower button guidance is challenging because tower panel is DOM below canvas (not canvas-rendered)
- Existing renderGame has 9 layers; tutorial highlights would be 10th layer

### Metis Review

**Key Gaps Identified & Addressed**:
- **Wave auto-advance bug**: Level 1 completion would trigger wave 2 in normal loop → **Fixed**: gate the `setWave` callback behind `level !== 1`
- **Score leak**: Both score mutation points need gating → **Fixed**: conditional on `level === 2`
- **Path unlock during Level 1**: Path unlock logic fires at wave transitions → **Fixed**: gate behind `level !== 1`
- **Tutorial rendering approach**: Hybrid — Canvas highlights for tiles/boxes; DOM overlay for instruction text; visual arrow pointing down for tower panel
- **Level 2 state carryover**: Must do full reset → Use existing `startGame()` logic for Level 2 initialization
- **4 tutorial steps only**: No branch, no skip, sequential advancement on natural user actions

---

## Work Objectives

### Core Objective
Add a two-level system to Hajimi Defense — a guided tutorial level (Level 1) that teaches mechanics through step-by-step in-game guidance, followed by auto-transition to the full game (Level 2) with scoring enabled.

### Concrete Deliverables
- `level` state (`1 | 2`) and `tutorialStep` state (`0..4`) in App.tsx
- `TutorialGuide` component (DOM overlay with step-by-step instructions + directional cues)
- Canvas-rendered tutorial highlights (pulsing borders on target tiles/boxes)
- Level announcement messages (prominent DOM overlay, reusing path-unlock pattern)
- Score gating: Level 1 score frozen at 0; Level 2 scoring active
- Wave gating: Level 1 wave completion does NOT trigger wave auto-advance
- Auto-transition: Level 1 complete → 2s message → Level 2 full reset + start
- Updated i18n with tutorial + level announcement texts (zh/en)

### Definition of Done
- [ ] `npm run build` succeeds with no TypeScript errors
- [ ] "Start Game" → Level 1 tutorial overlay visible with Step 1 text
- [ ] Breaking a box advances to Step 2; selecting tower advances to Step 3; placing tower advances to Step 4
- [ ] Score stays at 0 throughout Level 1 (box breaks + kills do NOT increase score)
- [ ] 3 cucumbers killed/leaked → "Level 1 Complete" message for 2s → Level 2 auto-starts
- [ ] Level 2 shows "Level 2 - Full Game!" announcement at start
- [ ] Level 2 scoring works: box breaks → +10 score; enemy kills → score increments
- [ ] Level 2 plays full 15 waves with path unlocking at waves 4/6
- [ ] Level 2 gameover → "Try Again" → returns to Level 1

### Must Have
- Level 1 tutorial with 4 sequential steps (box → tower → place → ready)
- Level 1: exactly 3 cucumbers, NO wave scaling
- Score display: 0 in Level 1, active in Level 2
- Auto-transition L1 → L2
- Level announcement messages at both levels' start
- Both i18n languages supported (zh/en)

### Must NOT Have (Guardrails)
- **G1**: Level 1 enemies must NOT be scaled via `getWaveData()` — use raw `[{type:0, count:3}]`
- **G2**: Score must NOT increment during Level 1 at either mutation point
- **G3**: Tutorial steps must be sequential, no branching, no skip button
- **G4**: Wave auto-advance callback must NOT fire for Level 1
- **G5**: Path unlock logic must NOT fire during Level 1
- **G6**: Level 2 must start with FULL state reset (no carryover from Level 1)
- **G7**: Tutorial overlay must be dismissed before Level 2 begins
- **SC1**: Simple pulsing highlight + arrow; no animated characters, glow effects, or dialogue
- **SC2**: Exactly 4 tutorial steps — no more
- **SC3**: No "Skip Tutorial" button
- **SC5**: Do NOT refactor App.tsx into multiple components

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (Vitest + jsdom)
- **Automated tests**: NONE — Agent-Executed QA only
- **Framework**: Vitest (not used for this plan)

### QA Policy
Every task includes agent-executed QA scenarios using **Playwright** for browser-based verification.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.png`.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — foundation, ALL parallel):
├── Task 1: Type definitions + constants [quick]
├── Task 2: i18n texts (tutorial + level announcements) [writing]
├── Task 3: Tutorial styles (CSS for overlays) [visual-engineering]
└── Task 4: Level state scaffolding in App.tsx [quick]

Wave 2 (After Wave 1 — core features, 3 parallel):
├── Task 5: Gate score and wave logic behind level [quick] (depends: 4)
├── Task 6: Create TutorialGuide component [visual-engineering] (depends: 1, 2, 3)
├── Task 7: Add canvas tutorial highlights to renderer [visual-engineering] (depends: 1, 3)
└── Task 8: Add level announcement overlay [quick] (depends: 2, 3)

Wave 3 (After Wave 2 — integration, sequential chain):
├── Task 9: Implement tutorial state machine in App.tsx [deep] (depends: 5, 6, 7)
└── Task 10: Implement Level 1→2 auto-transition [deep] (depends: 8, 9)

Wave FINAL (After ALL tasks — 4 parallel reviews):
├── Task F1: Plan compliance audit [oracle]
├── Task F2: Code quality review [unspecified-high]
├── Task F3: Real QA via Playwright [unspecified-high]
└── Task F4: Scope fidelity check [deep]
```

**Critical Path**: Task 1 → Task 5 → Task 9 → Task 10 → F1-F4  
**Parallel Speedup**: ~50% faster than sequential (8 tasks → 3 waves)  
**Max Concurrent**: 4 (Wave 1)

---

## TODOs

- [x] 1. Add type definitions and level constants

  **What to do**:
  - In `src/game/types.ts`: Add `Level` type = `1 | 2`; Add `TutorialStep` type = `0 | 1 | 2 | 3 | 4` (0=inactive, 1=break box, 2=select tower, 3=place tower, 4=ready)
  - In `src/game/constants.ts`: Add `LEVEL1_ENEMY_COUNT = 3`; Add `LEVEL1_WAVE: WaveData[] = [{ type: 0, count: 3 }]` (raw, NOT scaled); Add `TUTORIAL_TRANSITION_DELAY = 2000` (ms for "Level Complete" message); Add `LEVEL_ANNOUNCEMENT_DURATION = 2500` (ms for level start message)
  - Export all new symbols from `src/game/config.ts` (re-export barrel)

  **Must NOT do**:
  - Do NOT use `getWaveData()` for Level 1 enemies (G1)
  - Do NOT modify existing `GameState` values
  - Do NOT add any unused types

  **Recommended Agent Profile**:
  - **Category**: `quick` — Simple type additions and constant definitions, no logic changes
  - **Skills**: [`git-master`]
    - `git-master`: For atomic commit workflow
  - **Skills Evaluated but Omitted**: None — straightforward type/config work

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4)
  - **Blocks**: Tasks 5, 6, 7, 8 (all need types/constants defined)
  - **Blocked By**: None

  **References**:
  - `src/game/types.ts:8-9` — Existing `GameState` type pattern to follow for new union types
  - `src/game/types.ts:179-182` — Existing `WaveData` interface to understand Level 1 wave structure
  - `src/game/constants.ts:348-365` — `BASE_WAVES` as pattern reference for Level 1 wave data
  - `src/game/constants.ts:74` — `WAVE_TRANSITION_DELAY` as pattern for timing constants
  - `src/game/config.ts:10-38` — Barrel export pattern for new constants

  **Acceptance Criteria**:
  - [ ] `npx tsc --noEmit` passes with no new errors
  - [ ] `Level` type accepts `1` and `2`, rejects other values
  - [ ] `TutorialStep` type accepts `0|1|2|3|4`, rejects other values
  - [ ] `LEVEL1_WAVE` equals `[{ type: 0, count: 3 }]` (no scaling applied)
  - [ ] All new exports available from `src/game/config.ts`

  **QA Scenarios**:
  ```
  Scenario: Type check passes
    Tool: Bash
    Preconditions: Working directory is project root
    Steps:
      1. Run: npx tsc --noEmit
      2. Check exit code is 0
    Expected Result: No TypeScript errors related to new types/constants
    Failure Indicators: TypeScript compilation errors mentioning new types
    Evidence: .sisyphus/evidence/task-1-typecheck.txt

  Scenario: Level 1 wave is unscaled
    Tool: Bash (node REPL)
    Preconditions: Build succeeds
    Steps:
      1. Run node -e to import LEVEL1_WAVE and verify type=0, count=3
    Expected Result: { type: 0, count: 3 }
    Failure Indicators: count differs from 3, or scaling applied
    Evidence: .sisyphus/evidence/task-1-wave-check.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-1-typecheck.txt` — tsc output
  - [ ] `.sisyphus/evidence/task-1-wave-check.txt` — Level 1 wave verification

  **Commit**: YES (Commit 1)
  - Message: `feat(levels): add level types, constants, and i18n texts`
  - Files: `src/game/types.ts`, `src/game/constants.ts`, `src/game/config.ts`

- [x] 2. Add i18n texts for tutorial and level announcements

  **What to do**:
  - In `src/game/i18n.ts`: Add tutorial step texts to both `TEXTS.zh` and `TEXTS.en`:
    - `tutorialStep1`: "点击纸箱打破它们！(+5金币)" / "Click a box to break it! (+5 gold)"
    - `tutorialStep2`: "选择下方的防御塔 👇" / "Select a tower below 👇"
    - `tutorialStep3`: "将防御塔放置在空地上" / "Place the tower on an empty tile"
    - `tutorialStep4`: "准备就绪！敌人来了！" / "Ready! Enemies incoming!"
  - Add level announcement texts:
    - `level1Announcement`: "🐱 第一关：教程关卡 🐱" / "🐱 Level 1: Tutorial 🐱"
    - `level1Complete`: "🎉 第一关完成！ 🎉" / "🎉 Level 1 Complete! 🎉"
    - `level2Announcement`: "⚔️ 第二关：正式战斗！⚔️" / "⚔️ Level 2: Full Game! ⚔️"
    - `level2Subtitle`: "开始计算积分！" / "Scoring enabled!"
  - Use existing pattern: `export const TEXT = (lang: Language) => TEXTS[lang]`

  **Must NOT do**:
  - Do NOT remove or reorder existing translation keys
  - Do NOT add texts in only one language

  **Recommended Agent Profile**:
  - **Category**: `writing` — Pure text content, no logic changes
  - **Skills**: [] — No special skills needed
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4)
  - **Blocks**: Tasks 6, 8 (need i18n texts)
  - **Blocked By**: None

  **References**:
  - `src/game/i18n.ts:4-62` — Full TEXT structure showing both zh and en key patterns
  - `src/game/i18n.ts:16-22` — `instructions` array as pattern for structured multi-step text
  - `src/game/i18n.ts:17` — Example of instructional tone to match

  **Acceptance Criteria**:
  - [ ] All 7 new keys exist in both `TEXTS.zh` and `TEXTS.en`
  - [ ] `tutorialStep1` through `tutorialStep4` accessible via `TEXT(lang).tutorialStep1`
  - [ ] `level1Announcement`, `level1Complete`, `level2Announcement`, `level2Subtitle` all accessible
  - [ ] No existing keys removed or reordered

  **QA Scenarios**:
  ```
  Scenario: All tutorial texts exist in Chinese
    Tool: Bash (node REPL)
    Preconditions: Build succeeds
    Steps:
      1. Import TEXT('zh') and verify tutorialStep1-4 are non-empty strings
      2. Verify level1Announcement, level1Complete, level2Announcement, level2Subtitle are non-empty
    Expected Result: All 7 keys contain Chinese text
    Failure Indicators: Missing key, undefined value, empty string
    Evidence: .sisyphus/evidence/task-2-i18n-zh.txt

  Scenario: All tutorial texts exist in English
    Tool: Bash (node REPL)
    Preconditions: Build succeeds
    Steps:
      1. Import TEXT('en') and verify same 7 keys contain English text
    Expected Result: All 7 keys contain English text, different from Chinese
    Failure Indicators: Missing key, same as Chinese, empty string
    Evidence: .sisyphus/evidence/task-2-i18n-en.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-2-i18n-zh.txt` — Chinese text content
  - [ ] `.sisyphus/evidence/task-2-i18n-en.txt` — English text content

  **Commit**: YES (same Commit 1)
  - Files: `src/game/i18n.ts`

- [x] 3. Create tutorial overlay and announcement styles

  **What to do**:
  - In `src/game/styles.ts`: Add CSS-in-JS style objects for:
    - `tutorialOverlayContainer` — full-canvas semi-transparent overlay with high z-index
    - `tutorialTextBox` — positioned instruction text box (white bg, rounded, shadow, pulsing animation via CSS keyframes)
    - `tutorialArrow` — arrow indicator pointing to target (using CSS border-triangle or emoji)
    - `levelAnnouncementOverlay` — centered big text overlay (reuses overlay pattern from path-unlock at App.tsx:231-250)
    - `tutorialHighlightPulse` — pulsing border animation keyframes
  - Add keyframe animation: `@keyframes tutorialPulse { 0%, 100% { opacity:0.4 } 50% { opacity:1 } }`
  - Style colors: use existing palette (#FFB6C1 pink, #FF6B9D accent, #5D4037 text)

  **Must NOT do**:
  - Do NOT modify existing style objects (only add new ones)
  - Do NOT use inline styles elsewhere — centralize here

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` — CSS/styling work requires visual judgment
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: For matching Kawaii aesthetic while creating tutorial overlay styles
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4)
  - **Blocks**: Tasks 6, 7, 8 (need style objects)
  - **Blocked By**: None

  **References**:
  - `src/game/styles.ts:230-243` — `overlayContainerStyle` as pattern for tutorial overlay (position:absolute, z-index)
  - `src/game/styles.ts:266-279` — `instructionsBoxStyle` and `instructionTextStyle` for text box styling
  - `src/game/styles.ts:14-22` — `containerStyle` for understanding layout structure
  - `src/App.tsx:231-250` — Path-unlock DOM overlay as pattern for level announcements (absolute positioning over canvas)
  - `src/game/styles.ts:34-37` — `titleStyle` animation pattern with `@keyframes`

  **Acceptance Criteria**:
  - [ ] `npx tsc --noEmit` passes (all style types valid React.CSSProperties)
  - [ ] All 4+ new style objects exported from `src/game/styles.ts`
  - [ ] Tutorial overlay uses z-index higher than canvas (≥ 50)
  - [ ] Pulsing animation defined and syntactically valid

  **QA Scenarios**:
  ```
  Scenario: Styles compile and export correctly
    Tool: Bash (node REPL)
    Preconditions: Build succeeds
    Steps:
      1. Import new styles from src/game/styles.ts
      2. Verify each is a valid React.CSSProperties object
    Expected Result: No import errors, all style objects are plain objects
    Failure Indicators: Import failure, undefined export
    Evidence: .sisyphus/evidence/task-3-styles.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-3-styles.txt` — Style import verification

  **Commit**: YES (same Commit 1)
  - Files: `src/game/styles.ts`

- [x] 4. Add level state scaffolding to App.tsx

  **What to do**:
  - In `src/App.tsx`: Add two new state variables (useState):
    ```ts
    const [level, setLevel] = useState<Level>(1);
    const [tutorialStep, setTutorialStep] = useState<TutorialStep>(0);
    ```
  - Add `Level` and `TutorialStep` to the import from `./game/types`
  - Add `LEVEL1_WAVE`, `TUTORIAL_TRANSITION_DELAY`, `LEVEL_ANNOUNCEMENT_DURATION` to the import from `./game/constants`
  - Add level announcement state: `const [levelAnnouncement, setLevelAnnouncement] = useState<string | null>(null)`
  - **No behavior changes yet** — just declare variables. The existing game must still work identically.
  - Pass `level` prop to `HUD` component (update HUD's Props interface minimally — just accept the prop, no display changes yet)

  **Must NOT do**:
  - Do NOT change any game logic — variables exist but are unused (except HUD prop passthrough)
  - Do NOT break the existing single-level game flow
  - Do NOT change wave advancement, scoring, or enemy spawning

  **Recommended Agent Profile**:
  - **Category**: `quick` — State variable additions, no logic changes
  - **Skills**: [`git-master`]
    - `git-master`: For atomic commit
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3)
  - **Blocks**: Tasks 5, 9, 10 (need state variables)
  - **Blocked By**: None (types from Task 1 are declared; TypeScript will error if not imported correctly, but scaffolding can be written in parallel)

  **References**:
  - `src/App.tsx:48-55` — Existing useState declarations as pattern to follow
  - `src/App.tsx:8-9` — Import section to add new imports
  - `src/App.tsx:36` — Import of `GameState` from types — follow same pattern for new types
  - `src/game/components/HUD.tsx:26-38` — HUDProps interface to add `level` prop
  - `src/game/types.ts:9` — `GameState` type as reference for Level type usage

  **Acceptance Criteria**:
  - [ ] `npx tsc --noEmit` passes
  - [ ] `npm run dev` starts, game plays identically to before
  - [ ] `level` defaults to 1, `tutorialStep` defaults to 0
  - [ ] `levelAnnouncement` defaults to null
  - [ ] `HUD` component receives `level` prop (no TS errors)

  **QA Scenarios**:
  ```
  Scenario: Game still works after scaffolding
    Tool: Playwright
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to localhost:3000
      2. Click "START GAME" button
      3. Wait 3 seconds for enemies to appear and start moving
      4. Verify: canvas shows enemies moving, HUD shows Wave 1/15
    Expected Result: Game plays normally — single-level behavior unchanged
    Failure Indicators: Page crash, TypeScript error in console, game doesn't start
    Evidence: .sisyphus/evidence/task-4-game-works.png

  Scenario: New state variables accessible in console
    Tool: Playwright
    Preconditions: Game running
    Steps:
      1. Open browser console (via Playwright page.evaluate)
      2. Check that React DevTools or component internals show level=1
    Expected Result: Component renders with new state initialized
    Failure Indicators: undefined state, type error
    Evidence: .sisyphus/evidence/task-4-state-check.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-4-game-works.png` — Screenshot of game running
  - [ ] `.sisyphus/evidence/task-4-state-check.png` — Verification screenshot

  **Commit**: YES (Commit 2)
  - Message: `feat(levels): add level scaffolding, tutorial guide, and announcements`
  - Files: `src/App.tsx`

---

- [x] 5. Gate score and wave logic behind level check

  **What to do**:
  - In `src/App.tsx` `handleCanvasClick` (line 121): Gate `setScore` call — only call `setScore(s => s + BOX_SCORE_REWARD)` when `level === 2` (use `levelRef` or inline check)
  - In `src/App.tsx` game loop `onDamageEnemy` callback (line 160): Gate `setScore(o => o + s)` — only call when `level === 2`
  - In `src/App.tsx` wave-completion callback (lines 196-205): Gate the entire `setTimeout` block — only fire when `level !== 1` (i.e., only in Level 2)
  - In `src/App.tsx` path-unlock logic (lines 186-194): Gate behind `level !== 1` — path unlocking only for Level 2
  - Add a `levelRef = useRef(level)` that stays in sync with `level` state (for use inside the game loop closure where `level` state might be stale)
  - Update `levelRef.current = level` in the game loop or via useEffect

  **Must NOT do**:
  - Do NOT change the score calculation logic itself (`calcKillReward` stays intact)
  - Do NOT change the wave spawn logic for Level 2 (it must remain identical)
  - Do NOT accidentally mutate state inside the game loop without proper React patterns

  **Recommended Agent Profile**:
  - **Category**: `quick` — Conditional gating, no new logic, straightforward boolean checks
  - **Skills**: [`git-master`]
    - `git-master`: For atomic commit
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8)
  - **Blocks**: Tasks 9, 10 (need gating in place)
  - **Blocked By**: Task 4 (needs level state variables)

  **References**:
  - `src/App.tsx:118-122` — `handleCanvasClick` box-click handler with score mutation (line 121 to gate)
  - `src/App.tsx:158-164` — `onDamageEnemy` callback with score mutation (line 160 to gate)
  - `src/App.tsx:183-206` — Wave completion callback (lines 196-205 to gate)
  - `src/App.tsx:186-194` — Path unlock logic (lines 186-194 to gate)
  - `src/App.tsx:60-64` — Existing `goldRef` and `selectedTowerRef` pattern for `levelRef`

  **Acceptance Criteria**:
  - [ ] `npx tsc --noEmit` passes
  - [ ] Level 2 game plays identically to current single-level game (regression check)
  - [ ] Score increments on box breaks and kills ONLY when level === 2
  - [ ] When level !== 2, box breaks still give gold but NOT score
  - [ ] When level !== 2, enemy kills still give gold but NOT score
  - [ ] When level !== 2, wave completion does NOT trigger wave auto-advance
  - [ ] When level !== 2, path unlock logic does NOT fire

  **QA Scenarios**:
  ```
  Scenario: Score does NOT increment during Level 1 simulation
    Tool: Playwright
    Preconditions: Start game (Level 1), set level=1 in tutorial mode
    Steps:
      1. Navigate to game, start
      2. Break a box (click box tile on canvas)
      3. Check: score display still shows 0
      4. Check: gold DID increase by +5
    Expected Result: Gold increases, score stays at 0
    Failure Indicators: Score > 0 after box break
    Evidence: .sisyphus/evidence/task-5-score-locked.png

  Scenario: Level 2 scoring works correctly
    Tool: Playwright
    Preconditions: Level 2 active (can mock or fast-forward)
    Steps:
      1. Start Level 2
      2. Break a box
      3. Verify score changed from 0 to 10
      4. Kill an enemy and verify score increases further
    Expected Result: Score increments on both box breaks and kills
    Failure Indicators: Score stays at 0 in Level 2
    Evidence: .sisyphus/evidence/task-5-score-active.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-5-score-locked.png` — Score at 0 after actions in Level 1
  - [ ] `.sisyphus/evidence/task-5-score-active.png` — Score incrementing in Level 2

  **Commit**: YES (Commit 2)
  - Files: `src/App.tsx`

- [x] 6. Create TutorialGuide DOM overlay component

  **What to do**:
  - Create `src/game/components/TutorialGuide.tsx` — a React component that:
    - Accepts props: `step: TutorialStep`, `lang: Language`, `canvasRef: RefObject<HTMLCanvasElement>`, `level: Level`
    - Returns null when `step === 0` or `level !== 1`
    - For step 1: Renders a positioned DIV over canvas pointing to a box location (calculate box position from gameRef, convert to screen coords using canvas bounding rect + scale)
    - For step 2: Renders a DIV with arrow pointing down (below canvas toward tower panel) + instruction text
    - For step 3: Renders a positioned DIV pointing to a buildable empty tile
    - For step 4: Renders centered "Ready!" message with countdown feel
    - Uses `tutorialOverlayContainer`, `tutorialTextBox` styles from Task 3
    - Reads i18n text via `TEXT(lang).tutorialStep1` through `.tutorialStep4`
  - Export from `src/game/components/index.ts`

  **Must NOT do**:
  - Do NOT add skip/close buttons (G3)
  - Do NOT use Canvas rendering — this is DOM-only
  - Do NOT hardcode pixel positions (calculate from canvas bounding rect)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` — Positioning DOM elements over canvas requires visual judgment
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: For matching Kawaii aesthetic in tutorial overlay design
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 7, 8)
  - **Blocks**: Task 9 (needs this component)
  - **Blocked By**: Tasks 1 (types), 2 (i18n), 3 (styles)

  **References**:
  - `src/game/components/GameOverlays.tsx:20-53` — Overlay component pattern (props, conditional rendering, TEXT usage)
  - `src/App.tsx:231-250` — Path-unlock DOM overlay for positioning reference (absolute positioning over canvas wrapper)
  - `src/App.tsx:108-114` — `handleCanvasClick` coordinate math — inverse this to position DOM over canvas tiles
  - `src/App.tsx:228` — `canvasWrapperStyle` (position:relative) — tutorial overlay will be absolutely positioned inside this
  - `src/game/components/HUD.tsx:30` — Props interface pattern to follow
  - `src/game/types.ts:8-9` — Level type definition

  **Acceptance Criteria**:
  - [ ] `npx tsc --noEmit` passes
  - [ ] Component returns null when `step === 0`
  - [ ] Component returns null when `level !== 1`
  - [ ] Each step (1-4) shows correct text from i18n
  - [ ] Step 1 highlights a box location (any existing box in gameRef)
  - [ ] Step 2 shows downward-pointing arrow and "select tower" instruction
  - [ ] Step 3 highlights a buildable tile location
  - [ ] Step 4 shows centered ready message

  **QA Scenarios**:
  ```
  Scenario: Tutorial overlay appears on Level 1 start
    Tool: Playwright
    Preconditions: Start game → Level 1, step=1
    Steps:
      1. Navigate to game, click "START GAME"
      2. Wait for tutorial overlay to render
      3. Verify: visible instruction text matching tutorialStep1
      4. Screenshot
    Expected Result: Tutorial text visible over canvas, no errors
    Failure Indicators: No overlay visible, wrong text, JS error
    Evidence: .sisyphus/evidence/task-6-step1.png

  Scenario: Tutorial overlay disappears when step=0
    Tool: Playwright
    Preconditions: Level 1, step set to 0
    Steps:
      1. Set tutorialStep to 0
      2. Verify overlay is not in DOM
    Expected Result: TutorialGuide returns null (no DOM elements)
    Failure Indicators: Overlay text still visible
    Evidence: .sisyphus/evidence/task-6-step0-hidden.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-6-step1.png` — Step 1 overlay screenshot
  - [ ] `.sisyphus/evidence/task-6-step0-hidden.png` — No overlay when disabled

  **Commit**: YES (Commit 2)
  - Files: `src/game/components/TutorialGuide.tsx`, `src/game/components/index.ts`

- [x] 7. Add canvas tutorial highlights to renderer

  **What to do**:
  - In `src/game/renderer/`: Create `tutorial.ts` with a `renderTutorialHighlights(ctx, state, tutorialStep)` function
  - This is the 10th render layer (after existing 9 layers), called from the main render function
  - For step 1: Draw a pulsing golden/yellow border around a box tile on the map — iterate `state.boxes`, pick the first one, draw highlighted rectangle
  - For step 3: Draw a pulsing green border around a buildable empty tile (scan map for tile type 0 near path)
  - For steps 2 and 4: No-op (tower selection guide is DOM, ready message is DOM)
  - Pulsing effect: Use `Math.sin(Date.now() * 0.005) * 0.3 + 0.7` for alpha oscillation
  - Export and wire into `src/game/renderer/index.ts` — add call after existing 9 layers
  - Match Kawaii style: soft rounded corners, pastel highlight colors (#FFD700 gold, #B9F6CA green)

  **Must NOT do**:
  - Do NOT modify existing render layers
  - Do NOT draw highlights when `tutorialStep === 0`
  - Do NOT draw highlights for Level 2

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` — Canvas drawing requires visual judgment and API knowledge
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: For matching Kawaii visual style in canvas highlights
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6, 8)
  - **Blocks**: Task 9 (needs canvas highlights for tutorial experience)
  - **Blocked By**: Tasks 1 (types), 3 (color references in styles)

  **References**:
  - `src/game/renderer/` — Existing renderer directory; find the main render function to understand layer order
  - `src/App.tsx:212` — `renderGame(ctx, ...)` call — where tutorial highlight would be invoked
  - `src/game/constants.ts:17` — `TILE_SIZE = 64` for highlight rectangle dimensions
  - `src/game/constants.ts:397-403` — `TILE.EMPTY = 0` to find buildable tiles
  - `src/game/constants.ts:398` — `TILE.BOX = 2` to find box positions
  - `src/game/renderer/` — Look for how existing layers draw (ctx.save/restore, fillStyle, strokeStyle patterns)

  **Acceptance Criteria**:
  - [ ] `npx tsc --noEmit` passes
  - [ ] `renderTutorialHighlights` is a no-op when `tutorialStep === 0`
  - [ ] Step 1: A gold/yellow pulsing rectangle visible over a box tile
  - [ ] Step 3: A green pulsing rectangle visible over an empty buildable tile
  - [ ] Highlight colors use pastel/pulsing effect matching Kawaii aesthetic

  **QA Scenarios**:
  ```
  Scenario: Box highlight visible on Step 1
    Tool: Playwright
    Preconditions: Level 1, tutorialStep=1, gameRef has boxes on map
    Steps:
      1. Start game with tutorial mode, step 1 active
      2. Wait for 2-3 render frames (100ms)
      3. Screenshot canvas
      4. Verify: a visible golden/yellow highlight rectangle exists
    Expected Result: Canvas shows highlighted box
    Failure Indicators: No highlight visible, wrong color, rendering error
    Evidence: .sisyphus/evidence/task-7-step1-highlight.png

  Scenario: No highlights when tutorial inactive
    Tool: Playwright
    Preconditions: Level 1, tutorialStep=0
    Steps:
      1. Start game, set tutorialStep=0
      2. Screenshot canvas
      3. Compare with known clean canvas (no tutorial highlights)
    Expected Result: Canvas renders normally, no extra highlights
    Failure Indicators: Tutorial highlights visible when they shouldn't be
    Evidence: .sisyphus/evidence/task-7-no-highlights.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-7-step1-highlight.png` — Box highlighted on canvas
  - [ ] `.sisyphus/evidence/task-7-no-highlights.png` — Clean canvas when disabled

  **Commit**: YES (Commit 2)
  - Files: `src/game/renderer/tutorial.ts`, `src/game/renderer/index.ts`

- [x] 8. Add level announcement overlay

  **What to do**:
  - Add a `levelAnnouncement` state variable to App.tsx (type: `{ text: string; subtitle?: string } | null`)
  - Create a positioned DOM overlay inside `canvasWrapperStyle` div (same pattern as path-unlock at App.tsx:231-250)
  - When non-null, renders a centered box with:
    - Large emoji title (from i18n: `level1Announcement` or `level2Announcement`)
    - Optional subtitle (from i18n: `level2Subtitle`)
    - Pastel background, rounded corners, bounce animation
  - Auto-dismisses after `LEVEL_ANNOUNCEMENT_DURATION` ms (via setTimeout that sets `levelAnnouncement` to null)
  - Called from two places (later in Task 10): Level 1 start and Level 2 start
  - For now, wire a test: show Level 1 announcement on game start (to verify it works)

  **Must NOT do**:
  - Do NOT interfere with the path-unlock notification system
  - Do NOT block game interaction during announcement (announcement is decorative, game plays underneath)

  **Recommended Agent Profile**:
  - **Category**: `quick` — Simple DOM overlay with text, existing pattern reuse
  - **Skills**: [`git-master`]
    - `git-master`: For atomic commit
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6, 7)
  - **Blocks**: Task 10 (needs announcement component)
  - **Blocked By**: Tasks 2 (i18n), 3 (styles)

  **References**:
  - `src/App.tsx:231-250` — Path-unlock DOM overlay — EXACT pattern to copy for level announcement (position:absolute, top:50%, left:50%, transform, backgroundColor, borderRadius, fontSize, fontFamily, boxShadow, animation, zIndex)
  - `src/App.tsx:55` — `pathUnlockNotification` state as pattern for `levelAnnouncement` state
  - `src/App.tsx:70-82` — useEffect that watches state and sets timeout for auto-dismiss — replicate this pattern
  - `src/game/i18n.ts` — TEXT keys added in Task 2

  **Acceptance Criteria**:
  - [ ] `npx tsc --noEmit` passes
  - [ ] Level announcement div appears centered over canvas when state is set
  - [ ] Auto-dismisses after `LEVEL_ANNOUNCEMENT_DURATION` ms (2500ms)
  - [ ] Chinese text shows correctly when `lang === 'zh'`
  - [ ] English text shows correctly when `lang === 'en'`
  - [ ] Bounce animation matches path-unlock notification style

  **QA Scenarios**:
  ```
  Scenario: Level 1 announcement appears on game start
    Tool: Playwright
    Preconditions: Start game → Level 1
    Steps:
      1. Click "START GAME"
      2. Wait 500ms for announcement to render
      3. Screenshot — verify "🐱 第一关：教程关卡 🐱" visible
      4. Wait 3000ms
      5. Screenshot — verify announcement dismissed
    Expected Result: Announcement shows for ~2.5s then disappears
    Failure Indicators: No announcement, doesn't disappear, wrong text
    Evidence: .sisyphus/evidence/task-8-announcement.png, .sisyphus/evidence/task-8-announcement-gone.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-8-announcement.png` — Announcement visible
  - [ ] `.sisyphus/evidence/task-8-announcement-gone.png` — Announcement dismissed

  **Commit**: YES (Commit 2)
  - Files: `src/App.tsx`

---

- [x] 9. Implement tutorial state machine in App.tsx

  **What to do**:
  - Wire up the 4-step tutorial state machine that advances on natural user actions:
    - **Step 1 → 2**: When player clicks a box in `handleCanvasClick` AND `tutorialStep === 1` → `setTutorialStep(2)`
    - **Step 2 → 3**: When player selects a tower in `handleSelectTower` AND `tutorialStep === 2` → `setTutorialStep(3)`. Only advance if a tower IS selected (type >= 0), NOT on deselect.
    - **Step 3 → 4**: When player places a tower on an empty tile AND `tutorialStep === 3` → `setTutorialStep(4)`
    - **Step 4**: Show "Ready!" message for 1.5s, then automatically start the Level 1 wave (3 cucumbers)
  - Modify `startGame()` to begin in Level 1 tutorial mode:
    - Set `level = 1`, `tutorialStep = 1`
    - Do NOT immediately start the wave (unlike current behavior which calls `createWave(1)`)
    - Instead, wait for tutorial to complete (step 4 timeout) before spawning enemies
  - When step 4 timeout fires: call `createWave(1)` using `LEVEL1_WAVE` data (not the normal `WAVES[0]` which is scaled)
  - Integrate `TutorialGuide` component into App.tsx render tree inside `canvasWrapperStyle` div
  - Integrate `renderTutorialHighlights` into the render call (pass `tutorialStep` and `level`)
  - Add `tutorialStep` detection logic for box click: gameRef needs a method or the handler needs to know whether a box was clicked (currently `handleCanvasClick` splices box and returns early)

  **Must NOT do**:
  - Do NOT allow tutorial steps to skip or go backwards (G3)
  - Do NOT start Level 1 wave until tutorial step 4 completes
  - Do NOT use `getWaveData()` or `WAVES[]` for Level 1 — use raw `LEVEL1_WAVE` (G1)

  **Recommended Agent Profile**:
  - **Category**: `deep` — Complex state machine integration requiring careful coordination of multiple handlers
  - **Skills**: [`git-master`]
    - `git-master`: For atomic commit
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: NO — sequential
  - **Parallel Group**: Wave 3, Sequential (depends on all Wave 2 tasks)
  - **Blocks**: Task 10 (transition requires tutorial state machine working)
  - **Blocked By**: Tasks 5 (gating), 6 (TutorialGuide), 7 (canvas highlights)

  **References**:
  - `src/App.tsx:93-105` — `startGame()` function — must be modified to support tutorial mode
  - `src/App.tsx:107-133` — `handleCanvasClick` — add tutorial step advancement logic inside box-click branch and tower-placement branch
  - `src/App.tsx:147` — `handleSelectTower` — add tutorial step 2 advancement
  - `src/App.tsx:85-91` — `startWave` callback — Level 1 should call this only after tutorial step 4
  - `src/game/waveSystem.ts:66-83` — `startWave()` function to understand wave creation
  - `src/game/constants.ts:349` — `BASE_WAVES[0]` = `[{type:0, count:3}]` — Level 1 should use similar but unscaled data
  - `src/App.tsx:16` — Import of `startWave` for Level 1 wave creation timing

  **Acceptance Criteria**:
  - [ ] `npx tsc --noEmit` passes
  - [ ] "Start Game" → tutorial step 1 active (overlay visible, box highlighted)
  - [ ] Clicking a box advances to step 2
  - [ ] Selecting a tower type advances to step 3
  - [ ] Placing a tower on empty tile advances to step 4
  - [ ] Step 4 shows "Ready!" for 1.5s, then 3 cucumbers spawn
  - [ ] Out-of-order actions do NOT advance the tutorial (e.g., clicking empty tile before step 3)
  - [ ] Pause is disabled during tutorial (or handled gracefully)
  - [ ] Score stays at 0 throughout (verified in Task 5)

  **QA Scenarios**:
  ```
  Scenario: Full tutorial flow works sequentially
    Tool: Playwright
    Preconditions: Fresh game start
    Steps:
      1. Click "START GAME" → observe step 1 overlay "Click a box"
      2. Click a box tile on canvas → observe step 2 overlay "Select a tower"
      3. Click tower button (50-cost tabby) → observe step 3 overlay "Place the tower"
      4. Click an empty tile near path → observe step 4 "Ready!"
      5. Wait 2s → observe 3 cucumbers spawning
    Expected Result: Steps advance in order, each showing correct text
    Failure Indicators: Step doesn't advance, wrong text, skips a step
    Evidence: .sisyphus/evidence/task-9-step1.png through task-9-step4.png

  Scenario: Out-of-order action does NOT advance tutorial
    Tool: Playwright
    Preconditions: Tutorial step 1 active
    Steps:
      1. Click an empty tile (not a box) — should NOT advance to step 2
      2. Screenshot to verify still on step 1
    Expected Result: Tutorial stays on step 1; no premature advancement
    Failure Indicators: Step advances incorrectly
    Evidence: .sisyphus/evidence/task-9-out-of-order.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-9-step1.png` — Step 1 screenshot
  - [ ] `.sisyphus/evidence/task-9-step2.png` — Step 2 screenshot
  - [ ] `.sisyphus/evidence/task-9-step3.png` — Step 3 screenshot
  - [ ] `.sisyphus/evidence/task-9-step4.png` — Step 4 screenshot
  - [ ] `.sisyphus/evidence/task-9-out-of-order.png` — Out-of-order no-advance check

  **Commit**: YES (Commit 3)
  - Files: `src/App.tsx`

- [x] 10. Implement Level 1 → Level 2 auto-transition

  **What to do**:
  - Detect Level 1 completion: In the game loop, when `level === 1` AND `enemiesToSpawn.length === 0` AND `enemies.length === 0` AND `tutorialStep === 4`:
    - Set `tutorialStep = 0` (dismiss tutorial overlay)
    - Show "Level 1 Complete!" announcement via `setLevelAnnouncement` (using i18n `level1Complete`)
    - After `TUTORIAL_TRANSITION_DELAY` (2000ms), trigger Level 2 start:
      - Call `startGame()` (full reset: gold, lives, score, wave, towers, enemies, etc.)
      - Then set `level = 2` and `tutorialStep = 0`
      - Show Level 2 announcement (`level2Announcement` + `level2Subtitle`)
      - Start wave 1 normally (Level 2 uses standard 15-wave flow with scoring)
  - Wire level announcement display: The announcement overlay from Task 8 renders when `levelAnnouncement` is set
  - Show Level 1 announcement when starting Level 1 (in `startGame` or as a side effect)
  - Handle "Try Again" from Level 2 gameover: When gameover on Level 2, "Try Again" should return to Level 1 (start from beginning with tutorial)
  - Ensure Level 2 gameover/victory show correct score (accumulated Level 2 score only)

  **Must NOT do**:
  - Do NOT carry over gold/lives/towers from Level 1 to Level 2 (G6)
  - Do NOT show tutorial overlay during Level 2 (G7)
  - Do NOT allow Level 1 score to carry into Level 2 (G6 ensures full reset)
  - Do NOT keep `tutorialStep > 0` when Level 2 starts

  **Recommended Agent Profile**:
  - **Category**: `deep` — Complex cross-component integration with timing, state resets, and game flow coordination
  - **Skills**: [`git-master`]
    - `git-master`: For atomic commit
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: NO — sequential
  - **Parallel Group**: Wave 3, Sequential (depends on Task 9)
  - **Blocks**: Final Verification (F1-F4)
  - **Blocked By**: Tasks 8 (announcement), 9 (tutorial state machine)

  **References**:
  - `src/App.tsx:93-105` — `startGame()` function for full state reset pattern (gold, lives, score, wave, towers)
  - `src/App.tsx:183-206` — Wave completion logic (lines 183-206) — Level 1 uses a separate detection, not this callback (gated in Task 5)
  - `src/App.tsx:197-205` — `setTimeout` pattern for delayed wave advancement — adapt for Level 1→2 transition timing
  - `src/App.tsx:70-82` — useEffect pattern for auto-dismissing notifications
  - `src/App.tsx:55` — `pathUnlockNotification` state pattern for `levelAnnouncement`
  - `src/game/components/GameOverlays.tsx:56-65` — Game over overlay — "Try Again" button calls `onStart`; this must route to Level 1

  **Acceptance Criteria**:
  - [ ] All 3 cucumbers killed/leaked → "Level 1 Complete!" message for 2 seconds
  - [ ] After 2 seconds, Level 2 starts automatically
  - [ ] Level 2 begins with full game state reset: gold=100, lives=10, score=0, wave=1
  - [ ] Level 2 shows "Level 2: Full Game!" announcement at start
  - [ ] Level 2 plays full 15 waves with scoring active
  - [ ] Level 2 gameover → "Try Again" → returns to Level 1 (tutorial)
  - [ ] Level 2 victory shows final score
  - [ ] No tutorial elements visible during Level 2

  **QA Scenarios**:
  ```
  Scenario: Level 1 → Level 2 auto-transition
    Tool: Playwright
    Preconditions: Tutorial completed, 3 cucumbers spawned
    Steps:
      1. Wait for all 3 cucumbers to be killed (or leak)
      2. Observe "Level 1 Complete!" announcement for ~2s
      3. Wait for transition (total ~2.5s)
      4. Observe "Level 2: Full Game!" announcement
      5. Verify HUD shows score=0, wave=1/15, gold=100
      6. Break a box → verify score changes from 0 to 10
    Expected Result: Smooth auto-transition with level announcements
    Failure Indicators: No announcement, score not reset, HUD wrong
    Evidence: .sisyphus/evidence/task-10-l1-complete.png, task-10-l2-start.png

  Scenario: Level 2 "Try Again" returns to Level 1
    Tool: Playwright
    Preconditions: Level 2 gameover (trigger by letting enemies leak)
    Steps:
      1. Trigger gameover in Level 2 (lives reach 0)
      2. Click "TRY AGAIN" button
      3. Verify: tutorial overlay appears (step 1), Level 1 announcement shows
    Expected Result: Restart goes to Level 1, not Level 2
    Failure Indicators: Restarts directly into Level 2 without tutorial
    Evidence: .sisyphus/evidence/task-10-try-again-l1.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-10-l1-complete.png` — "Level 1 Complete" announcement
  - [ ] `.sisyphus/evidence/task-10-l2-start.png` — "Level 2" announcement
  - [ ] `.sisyphus/evidence/task-10-try-again-l1.png` — Try Again → Level 1

  **Commit**: YES (Commit 3)
  - Files: `src/App.tsx`

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, run Playwright). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in `.sisyphus/evidence/`. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `npx tsc --noEmit` + `npm run build`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names.
  Output: `Build [PASS/FAIL] | Lint [N issues] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real QA via Playwright** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture screenshots. Test cross-task integration (Level 1 → Level 2 transition, scoring in Level 2 vs not in Level 1). Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff. Verify 1:1 — everything in spec was built, nothing beyond spec. Check "Must NOT do" compliance. Detect cross-task contamination. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **Commit 1** (Wave 1): `feat(levels): add level types, constants, and i18n texts`
  Files: `src/game/types.ts`, `src/game/constants.ts`, `src/game/i18n.ts`

- **Commit 2** (Wave 2): `feat(levels): add level scaffolding, tutorial guide, and announcements`
  Files: `src/App.tsx`, `src/game/components/TutorialGuide.tsx`, `src/game/renderer/tutorial.ts`, `src/game/styles.ts`

- **Commit 3** (Wave 3): `feat(levels): implement tutorial state machine and L1→L2 transition`
  Files: `src/App.tsx`

## Success Criteria

### Verification Commands
```bash
npm run build        # Expected: success, no errors
npm run dev          # Expected: game loads at localhost:3000
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] TypeScript build passes
- [ ] Playwright QA scenarios pass
