// Game texts - Bilingual (Chinese & English)
export type Language = 'zh' | 'en';

export const TEXTS = {
  zh: {
    title: '🐱 萌新防御 🥫',
    ready: '准备开始',
    start: '开始游戏 🎮',
    wave: '波次',
    gold: '金币',
    lives: '生命',
    score: '分数',
    enemySpeed: '敌速',
    towerCount: '猫咪',
    towerNames: ['随地吐痰的虎斑猫', '狙击手暹罗猫', '扔面包的胖橘猫'],
    startTitle: '🥫 "金金" 防御 🐱',
    instructions: [
      '🛡️ 可爱的猫咪 vs 家庭害虫！',
      '🐛 黄瓜和吸尘器正在入侵！',
      '🧀 点击打破纸箱获取建造空间！',
      '🏆 坚守15波即可获胜！',
    ],
    startButton: '开始游戏 🎮',
    gameOver: '💔 游戏结束 💔',
    tryAgain: '再来一次 🔄',
    victory: '🎉 你赢了！ 🎉',
    victorySubtitle: '🐱 金枪鱼罐头安全啦！🥫',
    playAgain: '再玩一次 🐱',
    finalScore: '最终得分',
    pause: '暂停',
    resume: '继续',
    enemyNames: ['黄瓜', '吸尘器', '蚊子', '老鼠'],
  },
  en: {
    title: '🐱 Hajimi Defense 🥫',
    ready: 'Ready',
    start: 'START GAME 🎮',
    wave: 'Wave',
    gold: 'Gold',
    lives: 'Lives',
    score: 'Score',
    enemySpeed: 'Spd',
    towerCount: 'Cats',
    towerNames: ['Spitting Tabby', 'Siamese Sniper', 'Orange Bread Cat'],
    startTitle: '🥫 "Golden" Defense 🐱',
    instructions: [
      '🛡️ Cute cats vs Household pests!',
      '🐛 Cucumbers and Vacuums are attacking!',
      '🧀 Click boxes to break and free space!',
      '🏆 Survive 15 waves to win!',
    ],
    startButton: 'START GAME 🎮',
    gameOver: '💔 Game Over 💔',
    tryAgain: 'TRY AGAIN 🔄',
    victory: '🎉 YOU WIN! 🎉',
    victorySubtitle: '🐱 The Golden Tuna is safe! 🥫',
    playAgain: 'PLAY AGAIN 🐱',
    finalScore: 'Final Score',
    pause: 'Pause',
    resume: 'Resume',
    enemyNames: ['Cucumber', 'Vacuum', 'Mosquito', 'Rat'],
  },
};

export const TEXT = (lang: Language) => TEXTS[lang];

// Enemy types with new enemies
export const ENEMY_TRANSLATIONS = {
  zh: [
    { name: 'Cucumber', nameZh: '黄瓜', health: 30, speed: 1, reward: 10 },
    { name: 'Vacuum', nameZh: '吸尘器', health: 100, speed: 0.5, reward: 25 },
    { name: 'Mosquito', nameZh: '蚊子', health: 20, speed: 1.5, reward: 15 },
    { name: 'Rat', nameZh: '老鼠', health: 60, speed: 0.8, reward: 20 },
  ],
  en: [
    { name: 'Cucumber', nameZh: 'Cucumber', health: 30, speed: 1, reward: 10 },
    { name: 'Vacuum', nameZh: 'Vacuum', health: 100, speed: 0.5, reward: 25 },
    { name: 'Mosquito', nameZh: 'Mosquito', health: 20, speed: 1.5, reward: 15 },
    { name: 'Rat', nameZh: 'Rat', health: 60, speed: 0.8, reward: 20 },
  ],
};

export const ENEMY_DATA = (lang: 'zh' | 'en') => ENEMY_TRANSLATIONS[lang];