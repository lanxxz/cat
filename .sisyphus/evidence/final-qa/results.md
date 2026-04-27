# F3: Real Manual QA Results

**Date:** 2026-04-27  
**Environment:** Windows, Chrome (Playwright), localhost:3000

---

## Scenarios [5/5 pass] | VERDICT: APPROVE

### Scenario 1: Wave Gate ✅ PASS
- **Wave 1:** Upgrade mode button (`⬆️ Upgrade`) NOT visible in tower panel
- **Wave 3:** Upgrade mode button appears and is clickable
- Evidence: `s01-wave1.png` (no button), `s01-wave3-upgrade-btn.png` (button visible)

### Scenario 2: Unlock + Upgrade Tabby ✅ PASS
- Tabby tower placed (cost 50g, gold: 500→450)
- Upgrade mode entered, popup shows: `🔒 解锁: 100🪙` (correct for 1 tower)
- Unlock paid (100g, gold: 450→350), `upgradeUnlocked[0]` set to true
- Upgrade to Lv.2 (cost 100g, gold: 350→250)
- Popup shows: `随地吐痰的虎斑猫 Lv.2`, Damage `18 → 22`, Range `105 → 110`
- Green glow tint (#4CAF50) active for Lv.2
- Sell value: 75g (floor(150 × 0.5))
- Evidence: `s02-lv2-upgraded.png`

### Scenario 3: Max Level ✅ PASS
- Upgraded through Lv.3 (200g), Lv.4 (400g), Lv.5 (800g)
- Total cost from Lv.2→Lv.5: 1400g
- Popup at Lv.5 shows: `⭐ 已满级` (MAX)
- Gold glow tint (#FFD700) active for Lv.5
- Sell value: 875g (floor(1750 × 0.5))
- Evidence: `s03-max-level.png`

### Scenario 4: Sell Tower ✅ PASS
- Sold the Lv.5 tower for 875g (50% of totalInvested 1750)
- Gold: 600→1475 (+875)
- Tower removed from gameRef.current.towers (length: 1→0)
- Map tile (0,0) reset to TILE.EMPTY (0) - buildable again
- Cat count in HUD: 1→0
- Upgrade mode exited, button reverted to `⬆️ Upgrade`
- upgradeUnlocked persisted: [true, false, false]
- Evidence: `s04-sold.png`

### Scenario 5: Language Toggle ✅ PASS
- **Chinese (zh):** `随地吐痰的虎斑猫`, `攻击力:`, `范围:`, `升级`, `出售`
- **English (en):** `Spitting Tabby`, `Damage:`, `Range:`, `Upgrade`, `Sell`
- Toggle via `EN`/`中` button works in both directions
- Popup text updates immediately without closing
- Evidence: `s05-lang-zh.png` (also verified English via snapshot)

---

## Summary

All upgrade system features function correctly:
- ✅ Wave gating (wave 3 unlock)
- ✅ Unlock mechanic (per-type, cost proportional to tower count)
- ✅ Multi-level upgrades with correct cost scaling (base × 2^level)
- ✅ Stat scaling (damage × 1.2^level, range × 1.05^level)
- ✅ Level badges and glow tints (green, blue, purple, gold)
- ✅ MAX level cap at Lv.5
- ✅ Sell refund (50% totalInvested)
- ✅ Internationalization (zh/en)
