# Hajimi Defense - Game Specification

## 1. Project Overview

**Project Name:** Hajimi Defense
**Type:** Tower Defense Browser Game
**Core Concept:** Cute cats protect the Golden Tuna Can from household pests using strategic tower placement
**Target Users:** Casual gamers who love Kawaii aesthetics and fun tower defense gameplay

---

## 2. Visual & Art Direction

### Art Style: Hand-Drawn Pastel Kawaii
- **Color Palette:**
  - Background: Warm cream (#FFF8E7), soft pink (#FFE4EC)
  - UI Accents: Pastel pink (#FFB6C1), mint (#98D8C8), lavender (#C5A3FF)
  - Cats: Warm oranges, cream, grey, tabby patterns
  - Enemies: Cucumber green (#7CB342), Vacuum grey (#607D8B)
- **Aesthetic:** 
  - Hand-drawn look with slightly wobbly lines
  - Soft pastel colors throughout
  - Rounded, chubby cat designs (Kawaii)
  - Sparkle effects on important elements
  - Cute blinking animations

### Typography
- **Game Title:** "Hajimi Defense" - Cute bubbly font (CSS or embedded)
- **UI Text:** Rounded, friendly font style

---

## 3. Game Mechanics

### Gameplay Flow
1. **Wave-based** - Enemies spawn in waves
2. **Path** - Enemies follow a defined path toward the Golden Tuna Can
3. **Building** - Player places towers on valid tiles
4. **Obstacles** - Click boxes to break them for building space
5. **Defeat** - If 10 enemies reach the Tuna Can, game over
6. **Victory** - Survive all waves (15 waves)

### Tower Types

| Tower | Name | Attack Type | Damage | Speed | Range | Special |
|-------|------|-------------|--------|-------|-------|---------|
| 1 | Spitting Tabby | Single target | 15 | Fast | Short | Spits saliva projectile |
| 2 | Siamese Sniper | Single target | 50 | Slow | Long | Laser precise shot |
| 3 | Orange Bread Cat | AOE | 25 | Medium | Medium | Throws bread (area damage) |

### Enemy Types

| Enemy | Name | Health | Speed | Reward |
|-------|------|-------|-------|--------|
| 1 | Cucumber | 30 | Fast | 10 gold |
| 2 | Vacuum Cleaner | 100 | Slow | 25 gold |

### Economy
- **Starting Gold:** 100
- **Gold per Kill:** 10 (Cucumber), 25 (Vacuum)
- **Tower Costs:**
  - Spitting Tabby: 50 gold
  - Siamese Sniper: 75 gold
  - Orange Bread Cat: 100 gold

### Obstacle Mechanic
- **Breakable Boxes:** Some tiles have cardboard boxes
- **Click to Break:** Player clicks box to destroy it
- **Creates Space:** Broken box tile becomes buildable
- **Reward:** 5 gold for breaking

### Map Layout
- **Grid:** 12x8 tiles
- **Path:** Winding path from left to right, ending at Tuna Can (right side)
- **Start:** Enemy spawn on left
- **Base:** Golden Tuna Can on right (goal to protect)

---

## 4. UI Elements

### HUD (Top)
- Wave counter: "Wave X/15"
- Gold display with coin icon
- Lives remaining (hearts)
- Score display

### Tower Selection (Bottom Panel)
- 3 tower buttons with:
  - Cat icon
  - Name
  - Cost
  - Hover shows stats

### Game States
- **Start Screen:** Title + "Play" button
- **Playing:** Active game
- **Wave Complete:** Brief celebration
- **Game Over:** "Try Again" button
- **Victory:** Celebration + score

---

## 5. Technical Implementation

### Technology
- Single HTML file with embedded CSS and JavaScript
- Canvas-based rendering (2D game)
- No external dependencies (pure vanilla JS)

### Performance Targets
- 60 FPS smooth animation
- Works on modern browsers
- Mobile touch-friendly (tap instead of click)

---

## 6. Acceptance Criteria

- [ ] Game loads and displays start screen
- [ ] Can start game and see map with path
- [ ] All 3 tower types can be purchased and placed
- [ ] Towers attack enemies automatically
- [ ] Enemies follow path and reduce lives when reaching end
- [ ] Enemy death grants gold
- [ ] Boxes can be clicked to break
- [ ] Wave counter increments
- [ ] Game over triggers at 0 lives
- [ ] Victory triggers after wave 15
- [ ] Kawaii aesthetic evident throughout
- [ ] All animations smooth at 60 FPS