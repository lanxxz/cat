# Decisions - Two-Level System

## Architecture Decisions
- Level state: `useState<Level>(1)` → `1 | 2` union type
- Tutorial step: `useState<TutorialStep>(0)` → `0 | 1 | 2 | 3 | 4`
- Level announcement: `useState<{text:string; subtitle?:string} | null>(null)`
- Tutorial rendering: Hybrid — DOM overlay for text/arrows + Canvas for tile highlights
- Level 1 wave: Raw `[{type:0, count:3}]`, not scaled via getWaveData()
- Score gating: `level === 2` check at both mutation points

## Flow Decisions
- Start Game → always Level 1 (tutorial)
- L1 Complete → 2s "Level Complete" message → auto-start Level 2
- Level 2 start → full state reset + level announcement
- "Try Again" (L2 gameover) → returns to Level 1
- "Try Again" (L1 gameover) → returns to Level 1 (same)
