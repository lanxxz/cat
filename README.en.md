# 🐱 Hajimi Defense

> A cute Kawaii-style tower defense game to protect the golden tuna can from household pests!

## 🎮 How to Play

Cute cats defend the precious golden tuna can! But cucumbers, vacuums, mosquitoes, and rats are invading...

### 🏗️ Towers

| Tower | Cost | Ability |
|---|---|---|
| 😸 Spitting Tabby | 50g | Fast single attack |
| 😺 Siamese Sniper | 75g | Long range, high damage |
| 😻 Orange Bread Cat | 100g | AOE area damage |

### 👾 Enemies

| Enemy | Health | Speed | Base Reward | First Appears |
|---|---|---|---|---|
| 🥒 Cucumber | 30 | 1.0 | 20g | Wave 1 |
| 🧹 Vacuum | 180 | 0.8 | 35g | Wave 3 |
| 🦟 Mosquito | 30 | 3.0 | 20g | Wave 5 |
| 🐀 Rat | 200 | 1.5 | 30g | Wave 10 |

### 🎯 Goal

- Survive 15 waves
- Protect the golden tuna can
- Start with 10 lives

### 💡 Tips

- Click brown boxes to break them for building space (+5g, +10pts)
- Mix different tower types strategically
- More cats = faster enemies (+2%/cat), but higher kill rewards (+4%/cat)
- Mosquitoes add +50% speed, rats add +100%

## 🛠️ Tech Stack

- **React 18** - UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Canvas 2D** - Game rendering

## 📁 Project Structure

```
src/
├── App.tsx                    # Main game component (344 lines)
├── game/
│   ├── mapSystem.ts           # Map initialization
│   ├── waveSystem.ts          # Wave management
│   ├── combatSystem.ts        # Combat system
│   ├── gameEngine.ts          # Particles + screen shake
│   ├── keyboard.ts            # Keyboard handler
│   ├── constants.ts           # Game constants
│   ├── types.ts               # TypeScript types
│   ├── i18n.ts               # i18n (Chinese/English)
│   ├── styles.ts              # UI styles
│   ├── config.ts              # Game configuration
│   ├── responsive.ts          # Responsive adaptation
│   ├── touch.ts               # Touch event handling
│   ├── index.ts               # Export file
│   ├── __tests__/             # Test files
│   ├── components/            # UI components
│   │   └── HUD.tsx            # Game HUD display
│   └── renderer/              # Canvas renderer
```

## 🚀 Quick Start

### Install dependencies

```bash
npm install
```

### Development mode

```bash
npm run dev
```

Visit http://localhost:3000

### Build production

```bash
npm run build
```

## 🎨 Art Style

Hand-drawn pastel Kawaii style:
- Warm cream background
- Pink UI elements
- Cute cat character designs
- Glowing animation effects

## 🌍 i18n

Game supports Chinese/English:
- Click `EN` / `中` button in HUD to switch language

## 📝 License

MIT License
