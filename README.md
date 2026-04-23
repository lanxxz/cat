# 🐱 萌新防御 (Hajimi Defense)

> 一款可爱的 Kawaii 风格塔防游戏，保护金金枪鱼罐头免受家庭害虫的入侵！

## 🎮 游戏玩法

可爱的小猫咪守护着珍贵的金金枪鱼罐头！但是黄瓜、吸尘器、蚊子和老鼠正在入侵...

### 🏗️ 防御塔

| 塔 | 费用 | 能力 |
|---|---|---|
| 😸 随地吐痰的虎斑猫 | 50金币 | 快速单发攻击 |
| 😺 狙击手暹罗猫 | 75金币 | 远程高伤害 |
| 😻 扔面包的胖橘猫 | 100金币 | 范围AOE伤害 |

### 👾 敌人

| 敌人 | 生命 | 速度 | 奖励 |
|---|---|---|---|
| 🥒 黄瓜 | 30 | 快 | 10金币 |
| 🧹 吸尘器 | 100 | 慢 | 25金币 |
| 🦟 蚊子 (波次5+) | 20 | 很快 | 15金币 |
| 🐀 老鼠 (波次10+) | 60 | 中 | 20金币 |

### 🎯 目标

- 坚守 15 波攻击
- 保护金金枪鱼罐头
- 初始 10 条生命

### 💡 提示

- 点击褐色纸箱可以打破它们，获得建造空间 (+5金币, +10分数)
- 合理搭配不同类型的防御塔
- 猫咪数量越多，敌人速度越快 (+2%/只)，但击杀奖励也越高
- 蚊子出现后敌人速度 +50%，老鼠出现后 +100%

## 🛠️ 技术栈

- **React 18** - 用户界面
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Canvas 2D** - 游戏渲染

## 📁 项目结构

```
hajimi-defense/
├── src/
│   ├── game/
│   │   ├── components/          # React UI 组件
│   │   │   ├── HUD.tsx             # 游戏状态显示（波次、金币、生命等）
│   │   │   ├── TowerPanel.tsx      # 防御塔选择面板
│   │   │   ├── Overlay.tsx        # 开始/结束/胜利界面
│   │   │   └── index.ts
│   │   ├── renderer/           # Canvas 渲染器
│   │   │   ├── renderMap.ts      # 地图、路径、纸箱渲染
│   │   │   ├── renderTower.ts   # 防御塔渲染（3种猫咪）
│   │   │   ├── renderEnemy.ts   # 敌人渲染（4种敌人）
│   │   │   ├── renderProjectile.ts # 投射物渲染
│   │   │   ├── renderEffects.ts  # 基地和粒子效果
│   │   │   ├── renderHover.ts   # 悬停预览
│   │   │   ├── index.ts          # 统一渲染入口
│   │   │   └── ...
│   │   ├── types.ts            # TypeScript 类型定义
│   │   ├── constants.ts        # 游戏常量配置
│   │   ├── config.ts           # 向后兼容导出
│   │   └── i18n.ts            # 国际化文本（中/英）
│   ├── App.tsx                # 主游戏组件（游戏逻辑）
│   ├── main.tsx              # React 入口
│   └── index.css             # 全局样式
├── index.html                   # HTML 入口
├── package.json                # 项目依赖
├── vite.config.ts              # Vite 配置
└── tsconfig.json              # TypeScript 配置
```

### 📂 模块说明

#### `/src/game/components/` - UI 组件
- **HUD.tsx**: 顶部状态栏，显示波次、金币、生命、分数、猫咪数量、敌人速度倍率、语言切换按钮
- **TowerPanel.tsx**: 底部防御塔选择面板，显示3种猫咪防御塔和费用
- **Overlay.tsx**: 覆盖层组件，包括开始界面、游戏结束界面、胜利界面

#### `/src/game/renderer/` - 渲染器
- **renderMap.ts**: 渲染地图背景（棋盘格）、路径（虚线）、纸箱障碍物
- **renderTower.ts**: 渲染3种防御塔（虎斑猫、暹罗猫、胖橘猫），手绘卡哇伊风格
- **renderEnemy.ts**: 渲染4种敌人（黄瓜、吸尘器、蚊子、老鼠），带摆动动画
- **renderProjectile.ts**: 渲染投射物（口水、激光、面包）
- **renderEffects.ts**: 渲染金枪鱼罐头基地、粒子效果（击杀、建造、打破纸箱）
- **renderHover.ts**: 渲染防御塔放置预览（攻击范围、可建造提示）

#### `/src/game/` - 游戏核心
- **types.ts**: 所有 TypeScript 接口（Tower, Enemy, Projectile, Particle 等）
- **constants.ts**: 游戏常量（速度倍率、奖励、波次配置、敌人类型）
- **config.ts**: 向后兼容导出（从 constants.ts 和 types.ts 重新导出）
- **i18n.ts**: 国际化文本（中文/英文双语支持）

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

### 预览构建

```bash
npm run preview
```

## 🎨 艺术风格

游戏采用手绘粉彩 Kawaii 风格：
- 温暖的奶油色背景
- 粉红色 UI 元素
- 可爱的猫咪角色设计（虎斑猫、暹罗猫、胖橘猫）
- 4种敌人：黄瓜（凶萌）、吸尘器（机器人）、蚊子（细小）、老鼠（狡猾）
- 闪烁动画效果

## 🌍 国际化 (i18n)

游戏支持中英文切换：
- 点击 HUD 右上角的 `EN` / `中` 按钮切换语言
- 所有 UI 文本、敌人名称、游戏说明都支持双语

## 🎯 游戏平衡

### 速度系统
- 每波敌人速度 +10%
- 每个漏掉的敌人 +5% 速度
- 每只猫咪 +2% 速度（鼓励进攻性策略）
- 蚊子出现（波次5+）额外 +50% 速度
- 老鼠出现（波次10+）额外 +100% 速度

### 奖励系统
- 打破纸箱：+5 金币，+10 分数
- 击杀敌人：金币 = 基础奖励 × (1 + 猫咪数 × 2%)
- 击杀分数：基于敌人速度和基础奖励

### 波次系统
- 共 15 波，难度递增
- 每波敌人数量增加 15%
- 波次 5 引入蚊子（快速、低血量）
- 波次 10 引入老鼠（中速、中血量）

## 📝 许可证

MIT License

## 🛠️ 开发说明

项目采用模块化架构，便于维护和扩展：

- **游戏逻辑**：集中在 `App.tsx`，使用 `useRef` 存储可变状态
- **渲染逻辑**：分离到 `renderer/` 模块，每个模块职责单一
- **配置管理**：集中在 `constants.ts`，所有常量一处修改
- **类型安全**：`types.ts` 定义所有接口，TypeScript 严格检查
- **UI 组件**：分离到 `components/`，便于复用和测试

### 添加新敌人类型

1. 在 `constants.ts` 的 `ENEMY_TYPES` 数组添加新配置
2. 在 `renderEnemy.ts` 添加对应的渲染函数
3. 在 `constants.ts` 的 `BASE_WAVES` 添加该敌人到相应波次

### 添加新防御塔

1. 在 `constants.ts` 的 `TOWER_TYPES` 数组添加新配置
2. 在 `renderTower.ts` 添加对应的渲染函数
3. 在 `TowerPanel.tsx` 会自动显示（基于数组渲染）

### 调整游戏平衡

所有平衡参数都在 `constants.ts` 中：
- `WAVE_SPEED_BONUS`: 每波速度加成
- `LEAK_SPEED_BONUS`: 漏敌速度加成
- `TOWER_SPEED_BONUS`: 猫咪速度加成
- `TOWER_REWARD_BONUS`: 猫咪奖励加成
- `WAVE_SCALE_FACTOR`: 波次敌人数量缩放系数
