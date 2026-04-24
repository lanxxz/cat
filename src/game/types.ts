/**
 * Game Types / 游戏类型定义
 * 
 * Contains all TypeScript interfaces used throughout the game.
 * 包含游戏中使用的所有 TypeScript 接口。
 */

/** 游戏状态 / Game state */
export type GameState = 'start' | 'playing' | 'paused' | 'gameover' | 'victory';

/** 语言类型 / Language type */
export type Language = 'zh' | 'en';

/**
 * Tower / 防御塔
 * 
 * @property x - X coordinate (center of tile) / X 坐标 (格子中心)
 * @property y - Y coordinate (center of tile) / Y 坐标 (格子中心)
 * @property type - Tower type index (0=Tabby, 1=Siamese, 2=Orange) / 防御塔类型索引
 * @property lastAttack - Timestamp of last attack / 上次攻击时间戳
 * @property angle - Current rotation angle for shooting / 当前射击角度
 */
export interface Tower {
  x: number;
  y: number;
  type: number;
  lastAttack: number;
  angle: number;
}

/**
 * Enemy / 敌人
 * 
 * @property x - Current X position / 当前 X 坐标
 * @property y - Current Y position / 当前 Y 坐标
 * @property type - Enemy type index (0=Cucumber, 1=Vacuum, 2=Mosquito, 3=Rat) / 敌人类型索引
 * @property health - Current health / 当前生命值
 * @property maxHealth - Maximum health / 最大生命值
 * @property speed - Movement speed / 移动速度
 * @property reward - Gold reward on defeat / 击败后获得金币
 * @property pathIndex - Current position on path / 当前路径索引
 * @property wobble - Animation wobble offset / 动画摆动偏移
 */
export interface Enemy {
  x: number;
  y: number;
  type: number;
  health: number;
  maxHealth: number;
  speed: number;
  reward: number;
  pathIndex: number;
  pathId: number;      // 当前所在路径ID / Current path ID
  wobble: number;
}

/**
 * Projectile / 投射物
 * 
 * @property x - Current X position / 当前 X 坐标
 * @property y - Current Y position / 当前 Y 坐标
 * @property angle - Movement direction / 移动方向
 * @property speed - Movement speed / 移动速度
 * @property damage - Damage dealt on hit / 命中时造成的伤害
 * @property type - Attack type / 攻击类型
 * @property aoeRadius - Area of effect radius (for AOE attacks) / 范围攻击半径
 * @property life - Remaining frames / 剩余帧数
 */
export interface Projectile {
  x: number;
  y: number;
  angle: number;
  speed: number;
  damage: number;
  type: 'single' | 'aoe';
  aoeRadius?: number;
  life: number;
}

/**
 * Particle / 粒子效果
 * 
 * @property x - Current X position / 当前 X 坐标
 * @property y - Current Y position / 当前 Y 坐标
 * @property vx - X velocity / X 速度
 * @property vy - Y velocity / Y 速度
 * @property color - Particle color / 粒子颜色
 * @property life - Remaining frames / 剩余帧数
 * @property alpha - Transparency / 透明度
 * @property size - Particle size / 粒子大小
 */
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  alpha: number;
  size: number;
}

/**
 * Box / 纸箱 (obstacle that can be destroyed)
 * 
 * @property x - Grid X position / 网格 X 坐标
 * @property y - Grid Y position / 网格 Y 坐标
 */
export interface Box {
  x: number;
  y: number;
}

/**
 * Path coordinate / 路径坐标
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Path node - 路径节点（支持分支）
 * 
 * @property x - X coordinate / X 坐标
 * @property y - Y coordinate / Y 坐标
 * @property branches - 可选的分支目标索引 / Optional branch destination indices
 * @property isEntry - 是否是入口节点 / Whether this is an entry point
 * @property isExit - 是否是出口节点 / Whether this is an exit point
 */
export interface PathNode {
  x: number;
  y: number;
  branches?: number[];    // 分支索引数组 / Branch indices
  isEntry?: boolean;     // 入口标记 / Entry marker
  isExit?: boolean;      // 出口标记 / Exit marker
}

/**
 * Path - 一条完整路径
 * 
 * @property id - 路径唯一标识 / Path unique identifier
 * @property name - 路径名称 / Path name
 * @property nodes - 路径节点列表 / Path nodes list
 * @property difficulty - 路径难度 (1-10) / Path difficulty
 * @property color - 路径颜色 / Path color
 * @property enemyTypes - 可使用此路径的敌人类型 / Enemy types that can use this path
 */
export interface Path {
  id: number;
  name: string;
  nodes: Position[];
  difficulty: number;
  color: string;
  enemyTypes: number[];
}

/**
 * Multi-path system - 多路径系统
 * 
 * @property paths - 所有路径列表 / All paths list
 * @property branches - 所有分支点列表 / All branch points
 * @property entries - 入口点列表 / Entry points
 * @property exits - 出口点列表 / Exit points
 */
export interface MultiPathSystem {
  paths: Path[];
  branches: PathNode[];
  entries: Position[];
  exits: Position[];
}

/**
 * Wave data / 波次数据
 * 
 * @property type - Enemy type index / 敌人类型索引
 * @property count - Number of enemies / 敌人数量
 */
export interface WaveData {
  type: number;
  count: number;
}

/**
 * Game state reference (mutable) / 游戏状态引用 (可变更)
 * 
 * This interface is used with useRef to store mutable game state.
 * 此接口与 useRef 一起使用以存储可变的游戏状态。
 */
export interface GameStateRef {
  map: number[][];
  path: Position[];
  paths: Position[][];
  pathIds: number[];
  unlockedPaths: number[];     // 已解锁的路径ID / Unlocked path IDs
  pathUnlockNotifications: { pathId: number; wave: number }[];  // 待显示的路径解锁提示
  towers: Tower[];
  enemies: Enemy[];
  projectiles: Projectile[];
  particles: Particle[];
  boxes: Box[];
  enemiesToSpawn: number[];
  enemySpawnTimer: number;
  waveInProgress: boolean;
  hoverTile: Position;
  enemiesLeaked: number;
}