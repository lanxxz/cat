# 🐱 萌新防御 (Hajimi Defense)

> 一款可爱的 Kawaii 风格塔防游戏，保护金金枪鱼罐头免受家庭害虫的入侵！

## 🎮 游戏玩法

可爱的小猫咪守护着珍贵的金金枪鱼罐头！但是黄瓜、吸尘器、蚊子、老鼠正在入侵...

### 🏗️ 防御塔

| 塔 | 费用 | 能力 |
|---|---|---|
| 😸 随地吐痰的虎斑猫 | 50金币 | 快速单发攻击 |
| 😺 狙击手暹罗猫 | 75金币 | 远程高伤害 |
| 😻 扔面包的胖橘猫 | 100金币 | 范围AOE伤害 |

### 👾 敌人

| 敌人 | 生命 | 速度 | 基础奖励 | 首次出现 |
|---|---|---|---|---|
| 🥒 黄瓜 | 30 | 1.0 | 20金币 | 波次1 |
| 🧹 吸尘器 | 180 | 0.8 | 35金币 | 波次3 |
| 🦟 蚊子 | 30 | 3.0 | 40金币 | 波次5 |
| 🐀 老鼠 | 200 | 1.5 | 50金币 | 波次10 |

### 🎯 目标

- 坚守 15 波攻击
- 保护金金枪鱼罐头
- 初始 10 条生命

### 💡 提示

- 点击褐色纸箱可以打破它们，获得建造空间 (+5金币, +10分数)
- 合理搭配不同类型的防御塔
- 猫咪数量越多，敌人速度越快 (+2%/只)，但击杀奖励也越高 (+4%/只)
- 蚊子出现后敌人速度 +50%，老鼠出现后 +100%

## 🛠️ 技术栈

- **React 18** - 用户界面
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Canvas 2D** - 游戏渲染

## 📁 项目结构

```
src/
├── App.tsx                    # 主游戏组件 (344行)
├── game/
│   ├── mapSystem.ts           # 地图初始化
│   ├── waveSystem.ts          # 波次管理
│   ├── combatSystem.ts        # 战斗系统
│   ├── gameEngine.ts          # 粒子系统 + 屏幕震动
│   ├── keyboard.ts            # 键盘事件处理
│   ├── constants.ts           # 游戏常量
│   ├── types.ts               # 类型定义
│   ├── i18n.ts                # 国际化 (中/英)
│   ├── styles.ts               # UI 样式
│   ├── config.ts              # 游戏配置
│   ├── responsive.ts          # 响应式适配
│   ├── touch.ts               # 触摸事件处理
│   ├── index.ts               # 导出文件
│   ├── __tests__/             # 测试文件
│   ├── components/              # UI 组件
│   │   ├── index.ts           # 导出所有组件
│   │   ├── HUD.tsx            # 游戏HUD显示
│   │   ├── TowerPanel.tsx     # 塔板面板
│   │   ├── Overlay.tsx        # 覆盖层
│   │   ├── TutorialGuide.tsx  # 教程指南
│   │   └── GameOverlays.tsx   # 游戏结束叠加层
│   └── renderer/               # Canvas 渲染器
│       ├── index.ts            # 导出渲染器
│       ├── renderMap.ts        # 地图渲染
│       ├── renderTower.ts      # 塔渲染
│       ├── renderEnemy.ts      # 敌人渲染
│       ├── renderProjectile.ts # 投射物渲染
│       ├── renderHover.ts      # 悬停效果渲染
│       ├── renderEffects.ts    # 特效渲染
│       └── tutorial.ts         # 教程渲染
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

## 🎨 艺术风格

游戏采用手绘粉彩 Kawaii 风格：
- 温暖的奶油色背景
- 粉红色 UI 元素
- 可爱的猫咪角色设计
- 闪烁动画效果

## 🌍 国际化 (i18n)

游戏支持中英文切换：
- 点击 HUD 右上角的 `EN` / `中` 按钮切换语言

## 📝 许可证

MIT License