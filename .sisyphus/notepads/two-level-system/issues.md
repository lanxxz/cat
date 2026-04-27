# Issues - Two-Level System

## Fixed
- [x] **Bug: Tutorial prompts not centered**
  - Cause: `canvasWrapperStyle` no flex display → absolute `tutorialOverlayContainer` height:100% unresolved
  - Fix: Added `display:flex; align-items:center; justifyContent:center` to `canvasWrapperStyle`

- [x] **Bug: Level 2 only 1 wave (CRITICAL)**
  - Cause: `wave` stale in game loop closure after L1→L2 transition + `level` missing from useEffect deps
  - Fix: Added `waveRef` pattern + `level` in useEffect dependency array

## Resolved
All issues fixed. Build/tests pass.
