// 游戏文本 - 简体中文
export const TEXT = {
  // 标题
  title: '🐱 萌新防御 🥫',
  
  // HUD
  wave: '波次',
  gold: '金币',
  lives: '生命',
  score: '分数',
  
  // 塔名称
  towerNames: ['随地吐痰的虎斑猫', '狙击手暹罗猫', '扔面包的胖橘猫'],
  
  // 开始界面
  startTitle: '🥫 "金金" 防御 🐱',
  instructions: [
    '🛡️ 可爱的猫咪 vs 家庭害虫！',
    '🐛 黄瓜和吸尘器正在入侵！',
    '🧀 点击打破纸箱获取建造空间！',
    '🏆 坚守15波即可获胜！',
  ],
  startButton: '开始游戏 🎮',
  
  // 游戏结束
  gameOver: '💔 游戏结束 💔',
  tryAgain: '再来一次 🔄',
  
  // 胜利
  victory: '🎉 你赢了！ 🎉',
  victorySubtitle: '🐱 金枪鱼罐头安全啦！🥫',
  playAgain: '再玩一次 🐱',
  
  // 分数
  finalScore: '最终得分',
  
  // 敌人
  enemyNames: ['黄瓜', '吸尘器'],
};

// tower translations
export const TOWER_TRANSLATIONS = [
  { name: 'Spitting Tabby', nameZh: '随地吐痰的虎斑猫', desc: '快速单发攻击' },
  { name: 'Siamese Sniper', nameZh: '狙击手暹罗猫', desc: '远程高伤害' },
  { name: 'Orange Bread Cat', nameZh: '扔面包的胖橘猫', desc: '范围AOE伤害' },
];

export const ENEMY_TRANSLATIONS = [
  { name: 'Cucumber', nameZh: '黄瓜', health: 30, speed: '快', reward: 10 },
  { name: 'Vacuum', nameZh: '吸尘器', health: 100, speed: '慢', reward: 25 },
];