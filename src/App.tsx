/**
 * Hajimi Defense (萌新防御) - Main Game Component
 * 🐱 金金枪鱼罐头防御 - Cute cat tower defense game
 * 
 * Architecture / 架构:
 * - UI Components: /game/components/ (HUD, TowerPanel, Overlay)
 * - Renderers: /game/renderer/ (Map, Towers, Enemies, Effects)
 * - Config: /game/config.ts, /game/constants.ts, /game/i18n.ts
 * 
 * Features / 功能:
 * - 3 tower types (Tabby, Siamese, Orange Cat) / 3 种防御塔
 * - 4 enemy types (Cucumber, Vacuum, Mosquito, Rat) / 4 种敌人
 * - 15 waves with scaling difficulty / 15 波难度递增
 * - i18n support (Chinese/English) / 中英双语
 * - Wave/Lives/Gold/Score tracking / 波次/生命/金币/分数
 */

import { useState, useCallback, useRef, useEffect } from 'react';

// ============ Game Configuration / 游戏配置 ============
import {
  BOX_SCORE_REWARD,
  BOX_GOLD_REWARD,
  TOWER_TYPES, 
  ENEMY_TYPES, 
  TILE, 
  TILE_SIZE,
  GRID_WIDTH,
  GRID_HEIGHT,
  WAVES,
  PATH_COORDS,
  TOTAL_WAVES,
  INITIAL_GOLD,
  INITIAL_LIVES,
  BOX_COUNT,
  WAVE_SPEED_BONUS,
  LEAK_SPEED_BONUS,
  TOWER_SPEED_BONUS,
  MOSQUITO_SPEED_BONUS,
  RAT_SPEED_BONUS,
  TOWER_REWARD_BONUS,
  SPEED_SCORE_MULTIPLIER,
  KILL_SCORE_MULTIPLIER,
  ENEMY_SPAWN_INTERVAL,
  PARTICLE_COUNT_BREAK_BOX,
  PARTICLE_COUNT_PLACE_TOWER,
  PARTICLE_COUNT_KILL_ENEMY,
  ENEMY_WOBBLE_SPEED,
  PROJECTILE_LIFE,
  PARTICLE_GRAVITY,
  WAVE_TRANSITION_DELAY
} from './game/constants';

// ============ Types / 类型 ============
import type { 
  GameState, 
  Language, 
  Particle,
  Enemy,
  Box, 
  Position, 
  GameStateRef 
} from './game/types';

// ============ i18n / 国际化 ============
import { TEXT } from './game/i18n';

// ============ UI Components / UI 组件 ============
import HUD from './game/components/HUD';
import TowerPanel from './game/components/TowerPanel';
import { StartOverlay, Overlay } from './game/components/Overlay';

// ============ Renderers / 渲染器 ============
import { renderGame } from './game/renderer';

// ============================================
// GAME INITIALIZATION / 游戏初始化
// ============================================

/**
 * 创建初始地图 / Build initial map with path
 * @returns { map, path } - 网格地图和路径坐标
 */
function buildInitialMap(): { map: number[][]; path: Position[] } {
  const map: number[][] = [];
  const path: Position[] = [];
  
  // 初始化空地图 / Initialize empty grid
  for (let y = 0; y < GRID_HEIGHT; y++) {
    map[y] = [];
    for (let x = 0; x < GRID_WIDTH; x++) map[y][x] = TILE.EMPTY;
  }
  
  // 设置路径格子 / Set path tiles
  for (const coord of PATH_COORDS) {
    if (coord.x >= 0 && coord.x < GRID_WIDTH && coord.y >= 0 && coord.y < GRID_HEIGHT) {
      map[coord.y][coord.x] = TILE.PATH;
      // 将路径坐标转换为像素中心 / Convert to pixel center
      path.push({ 
        x: coord.x * TILE_SIZE + TILE_SIZE / 2, 
        y: coord.y * TILE_SIZE + TILE_SIZE / 2 
      });
    }
  }
  
  // 终点标记（金枪鱼罐头）/ Mark base (tuna can)
  const lastPath = PATH_COORDS[PATH_COORDS.length - 1];
  map[lastPath.y][lastPath.x] = TILE.BASE;
  
  return { map, path };
}

/**
 * 生成纸箱障碍物 / Spawn box obstacles
 * @param map - Current map state / 当前地图状态
 * @returns Box[] - 纸箱位置数组
 */
function spawnBoxes(map: number[][]): Box[] {
  const boxes: Box[] = [];
  for (let i = 0; i < BOX_COUNT; i++) {
    let boxX: number, boxY: number;
    // 随机放置，确保不在已有物体上 / Random placement, avoid occupied tiles
    do {
      boxX = Math.floor(Math.random() * GRID_WIDTH);
      boxY = Math.floor(Math.random() * GRID_HEIGHT);
    } while (map[boxY][boxX] !== TILE.EMPTY);
    
    map[boxY][boxX] = TILE.BOX;
    boxes.push({ x: boxX, y: boxY });
  }
  return boxes;
}

// ============================================
// MAIN GAME COMPONENT / 主游戏组件
// ============================================

export default function App() {
  // ============ Canvas Reference / 画布引用 ============
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // ============ Game State / 游戏状态 ============
  const [gameState, setGameState] = useState<GameState>('start');
  const [lang, setLang] = useState<Language>('zh');
  const [gold, setGold] = useState(INITIAL_GOLD);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [selectedTowerType, setSelectedTowerType] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
  
  // 获取本地化文本 / Get localized text
  const t = TEXT(lang);
  
  // ============ Mutable Game State / 可变游戏状态 ============
  const gameRef = useRef<GameStateRef>({
    map: [],
    path: [],
    towers: [],
    enemies: [],
    projectiles: [],
    particles: [],
    boxes: [],
    enemiesToSpawn: [],
    enemySpawnTimer: 0,
    waveInProgress: false,
    hoverTile: { x: -1, y: -1 },
    enemiesLeaked: 0
  });
  
  // 用于游戏循环的ref，避免频繁重建 / Refs for game loop to avoid frequent rebuilds
  const selectedTowerRef = useRef(selectedTowerType);
  const goldRef = useRef(gold);
  const isPausedRef = useRef(isPaused);
  
  // 同步 ref 和 state / Sync ref with state
  selectedTowerRef.current = selectedTowerType;
  goldRef.current = gold;
  isPausedRef.current = isPaused;
  
  const animationRef = useRef<number>(0);
  
  // ============ Particle Factory / 粒子工厂 ============
  const createParticle = (x: number, y: number, color: string): Particle => ({
    x, y,
    vx: (Math.random() - 0.5) * 8,
    vy: (Math.random() - 0.5) * 8 - 3,
    color,
    life: 30 + Math.random() * 20,
    alpha: 1,
    size: 4 + Math.random() * 4
  });
  
  // ============================================
  // WAVE MANAGEMENT / 波次管理
  // ============================================
  
  /**
   * 开始指定波次 / Start specified wave
   * @param waveNum - Wave number (1-15) / 波次号
   */
  const startWave = useCallback((waveNum: number) => {
    const waveData = WAVES[waveNum - 1];
    const enemiesToSpawn: number[] = [];
    
    // 将波次数据转换为敌人队列 / Convert wave data to enemy queue
    for (const enemyGroup of waveData) {
      for (let i = 0; i < enemyGroup.count; i++) {
        enemiesToSpawn.push(enemyGroup.type);
      }
    }
    
    // 随机打乱敌人顺序 / Shuffle enemy order
    for (let i = enemiesToSpawn.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [enemiesToSpawn[i], enemiesToSpawn[j]] = [enemiesToSpawn[j], enemiesToSpawn[i]];
    }
    
    gameRef.current.enemiesToSpawn = enemiesToSpawn;
    gameRef.current.enemySpawnTimer = 0;
    gameRef.current.waveInProgress = true;
  }, []);
  
  // ============================================
  // GAME INITIALIZATION / 游戏初始化
  // ============================================
  
  /**
   * 开始新游戏 / Start new game
   */
  const startGame = useCallback(() => {
    const { map, path } = buildInitialMap();
    const boxes = spawnBoxes(map);
    
    // 重置游戏状态 / Reset game state
    gameRef.current = {
      map, path, towers: [], enemies: [], projectiles: [], particles: [],
      boxes, enemiesToSpawn: [], enemySpawnTimer: 0, waveInProgress: false,
      hoverTile: { x: -1, y: -1 }, enemiesLeaked: 0
    };
    
    // 重置UI状态 / Reset UI state
    setGold(INITIAL_GOLD);
    setLives(INITIAL_LIVES);
    setScore(0);
    setWave(1);
    setSelectedTowerType(-1);
    setIsPaused(false);
    setGameState('playing');
    startWave(1);
  }, [startWave]);
  
  // ============================================
  // USER INPUT HANDLERS / 用户输入处理
  // ============================================
  
  /**
   * 画布点击事件 / Canvas click handler
   * - 打破纸箱 / Break boxes
   * - 放置防御塔 / Place towers
   */
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const tileX = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const tileY = Math.floor((e.clientY - rect.top) / TILE_SIZE);
    const state = gameRef.current;
    
    // 检查是否点击纸箱 / Check if clicking a box
    const boxIdx = state.boxes.findIndex(b => b.x === tileX && b.y === tileY);
    if (boxIdx !== -1) {
      // 打破纸箱 / Break box
      state.boxes.splice(boxIdx, 1);
      state.map[tileY][tileX] = TILE.EMPTY;
      setGold(prev => prev + BOX_GOLD_REWARD); 
      setScore(prev => prev + BOX_SCORE_REWARD);   
      
      // 生成粒子效果 / Spawn particles
      for (let p = 0; p < PARTICLE_COUNT_BREAK_BOX; p++) {
        state.particles.push(createParticle(
          tileX * TILE_SIZE + TILE_SIZE / 2,
          tileY * TILE_SIZE + TILE_SIZE / 2,
          '#8D6E63'
        ));
      }
      return;
    }
    
    // 检查是否放置防御塔 / Check if placing tower
    if (selectedTowerType >= 0) {
      if (tileX < 0 || tileX >= GRID_WIDTH || tileY < 0 || tileY >= GRID_HEIGHT) return;
      if (state.map[tileY][tileX] !== TILE.EMPTY) return;
      
      const towerType = TOWER_TYPES[selectedTowerType];
      if (gold >= towerType.cost) {
        // 扣金币 / Deduct gold
        setGold(prev => prev - towerType.cost);
        
        // 放置防御塔 / Place tower
        state.towers.push({
          x: tileX * TILE_SIZE + TILE_SIZE / 2,
          y: tileY * TILE_SIZE + TILE_SIZE / 2,
          type: selectedTowerType,
          lastAttack: 0,
          angle: 0
        });
        state.map[tileY][tileX] = TILE.TOWER;
        
        // 生成放置粒子 / Spawn placement particles
        for (let p = 0; p < PARTICLE_COUNT_PLACE_TOWER; p++) {
          state.particles.push(createParticle(
            tileX * TILE_SIZE + TILE_SIZE / 2,
            tileY * TILE_SIZE + TILE_SIZE / 2,
            '#FFD700'
          ));
        }
      }
    }
  }, [gameState, selectedTowerType, gold]);
  
  /**
   * 画布悬停事件 / Canvas hover handler
   * 用于预览防御塔放置位置 / Preview tower placement
   */
  const handleCanvasHover = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    gameRef.current.hoverTile = {
      x: Math.floor((e.clientX - rect.left) / TILE_SIZE),
      y: Math.floor((e.clientY - rect.top) / TILE_SIZE)
    };
  }, []);
  
  /**
   * 选择防御塔 / Select tower type
   * 再次点击取消选择 / Click again to deselect
   */
  const handleSelectTower = useCallback((type: number) => {
    setSelectedTowerType(prev => prev === type ? -1 : type);
  }, []);
  
  // ============================================
  // GAME LOOP / 游戏主循环
  // ============================================
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // ============ Enemy Spawning / 敌人生成 ============
    const spawnEnemy = (type: number) => {
      const enemyType = ENEMY_TYPES[type];
      const startPos = gameRef.current.path[0];
      
      // 计算速度倍率 / Calculate speed multiplier
      const waveBonus = (wave - 1) * WAVE_SPEED_BONUS;           // 波次加成
      const leakBonus = gameRef.current.enemiesLeaked * LEAK_SPEED_BONUS; // 漏敌加成
      const towerBonus = gameRef.current.towers.length * TOWER_SPEED_BONUS; // 猫咪加成
      
      // 敌人类型加成：蚊子+50%，老鼠+100% / Enemy type bonus
      let enemyTypeBonus = 0;
      if (type === 2) enemyTypeBonus = MOSQUITO_SPEED_BONUS; // Mosquito: +50%
      if (type === 3) enemyTypeBonus = RAT_SPEED_BONUS;       // Rat: +100%
      
      const speedMultiplier = 1 + waveBonus + leakBonus + towerBonus + enemyTypeBonus;
      const finalSpeed = enemyType.speed * speedMultiplier;
      
      // 奖励也随猫咪数量增加（但敌人类型不影响奖励）/ Reward scales with towers
      const rewardMultiplier = 1 + gameRef.current.towers.length * TOWER_REWARD_BONUS;
      const finalReward = Math.floor(enemyType.reward * rewardMultiplier);
      
      // 生成敌人 / Spawn enemy
      gameRef.current.enemies.push({
        x: startPos.x,
        y: startPos.y,
        type,
        health: enemyType.health,
        maxHealth: enemyType.health,
        speed: finalSpeed,
        reward: finalReward,
        pathIndex: 2,
        wobble: Math.random() * Math.PI * 2
      });
    };
    
    // ============ Enemy Damage / 敌人受伤 ============
    const damageEnemy = (enemy: Enemy, damage: number) => {
      const state = gameRef.current;
      enemy.health -= damage;
      
      if (enemy.health <= 0) {
        const idx = state.enemies.indexOf(enemy);
        if (idx !== -1) {
          // 计算得分（基于速度和奖励）/ Calculate score (based on speed & reward)
          const speedBonus = Math.floor(enemy.speed * SPEED_SCORE_MULTIPLIER);
          const earnedGold = enemy.reward;
          const earnedScore = (enemy.reward + speedBonus) * KILL_SCORE_MULTIPLIER;
          
          setGold(prev => prev + earnedGold);
          setScore(prev => prev + earnedScore);
          
          // 生成击杀粒子 / Spawn kill particles
          for (let p = 0; p < PARTICLE_COUNT_KILL_ENEMY; p++) {
            state.particles.push(createParticle(enemy.x, enemy.y, '#7CB342'));
          }
          
          state.enemies.splice(idx, 1);
        }
      }
    };
    
    // ============ Update Logic / 更新逻辑 ============
    const update = (timestamp: number) => {
      if (gameState !== 'playing' || isPausedRef.current) return;
      const state = gameRef.current;
      
      // 生成敌人 / Spawn enemies
      if (state.enemiesToSpawn.length > 0) {
        state.enemySpawnTimer++;
        if (state.enemySpawnTimer >= ENEMY_SPAWN_INTERVAL) {
          state.enemySpawnTimer = 0;
          spawnEnemy(state.enemiesToSpawn.shift()!);
        }
      }
      
      // 更新敌人位置 / Update enemy positions
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const enemy = state.enemies[i];
        const targetIndex = Math.min(enemy.pathIndex, state.path.length - 1);
        const target = state.path[targetIndex];
        const dx = target.x - enemy.x;
        const dy = target.y - enemy.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < enemy.speed) {
          enemy.pathIndex++;
        } else {
          enemy.x += (dx / dist) * enemy.speed;
          enemy.y += (dy / dist) * enemy.speed;
        }
        
        enemy.wobble += ENEMY_WOBBLE_SPEED;
        
        // 敌人到达终点 / Enemy reached base
        if (enemy.pathIndex >= state.path.length) {
          state.enemies.splice(i, 1);
          state.enemiesLeaked++; // 记录漏掉的敌人
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) setGameState('gameover');
            return newLives;
          });
        }
      }
      
      // 防御塔攻击 / Tower attacks
      for (const tower of state.towers) {
        const towerType = TOWER_TYPES[tower.type];
        if (timestamp - tower.lastAttack < towerType.attackSpeed) continue;
        
        // 寻找目标（最前进的敌人）/ Find target (furthest progressed enemy)
        let target: Enemy | null = null;
        let maxProgress = -1;
        for (const enemy of state.enemies) {
          const dist = Math.hypot(enemy.x - tower.x, enemy.y - tower.y);
          if (dist <= towerType.range && enemy.pathIndex > maxProgress) {
            maxProgress = enemy.pathIndex;
            target = enemy;
          }
        }
        
        // 发射投射物 / Fire projectile
        if (target) {
          tower.lastAttack = timestamp;
          const angle = Math.atan2(target.y - tower.y, target.x - tower.x);
          tower.angle = angle;
          state.projectiles.push({
            x: tower.x,
            y: tower.y,
            angle,
            speed: towerType.type === 'aoe' ? 8 : (tower.type === 0 ? 10 : 15),
            damage: towerType.damage,
            type: towerType.type as 'single' | 'aoe',
            aoeRadius: towerType.aoeRadius,
            life: PROJECTILE_LIFE
          });
        }
      }
      
      // 更新投射物 / Update projectiles
      for (let i = state.projectiles.length - 1; i >= 0; i--) {
        const proj = state.projectiles[i];
        proj.x += Math.cos(proj.angle) * proj.speed;
        proj.y += Math.sin(proj.angle) * proj.speed;
        proj.life--;
        
        // 检查命中 / Check hit
        for (let j = state.enemies.length - 1; j >= 0; j--) {
          const enemy = state.enemies[j];
          if (Math.hypot(proj.x - enemy.x, proj.y - enemy.y) < 25) {
            if (proj.type === 'aoe') {
              // AOE 伤害 / AOE damage
              const aoeRad = proj.aoeRadius || 60;
              for (let k = state.enemies.length - 1; k >= 0; k--) {
                const e = state.enemies[k];
                if (Math.hypot(proj.x - e.x, proj.y - e.y) < aoeRad) {
                  damageEnemy(e, proj.damage);
                }
              }
            } else {
              damageEnemy(enemy, proj.damage);
            }
            state.projectiles.splice(i, 1);
            break;
          }
        }
        
        // 移除过期投射物 / Remove expired projectiles
        if (proj.life <= 0 || 
            proj.x < 0 || proj.x > GRID_WIDTH * TILE_SIZE || 
            proj.y < 0 || proj.y > GRID_HEIGHT * TILE_SIZE) {
          state.projectiles.splice(i, 1);
        }
      }
      
      // 更新粒子 / Update particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += PARTICLE_GRAVITY; // 重力 / Gravity
        p.life--;
        p.alpha = p.life / 30;
        if (p.life <= 0) state.particles.splice(i, 1);
      }
      
      // 检查波次是否完成 / Check if wave is complete
      if (state.waveInProgress && state.enemiesToSpawn.length === 0 && state.enemies.length === 0) {
        state.waveInProgress = false;
        setTimeout(() => {
          if (gameState === 'playing') {
            setWave(prev => {
              const newWave = prev + 1;
              if (newWave > TOTAL_WAVES) {
                setGameState('victory');
              } else {
                startWave(newWave);
              }
              return newWave;
            });
          }
        }, WAVE_TRANSITION_DELAY);
      }
    };
    
    // ============ Render Loop / 渲染循环 ============
    const render = () => {
      const state = gameRef.current;
      
      // 使用 renderGame 统一渲染 / Use renderGame for unified rendering
      renderGame(ctx, {
        map: state.map,
        path: state.path,
        boxes: state.boxes,
        towers: state.towers,
        enemies: state.enemies,
        projectiles: state.projectiles,
        particles: state.particles
      }, gameRef.current.hoverTile, selectedTowerRef.current, goldRef.current);
    };
    
    // ============ Game Loop / 游戏循环 ============
    const gameLoop = (timestamp: number) => {
      update(timestamp);
      render();
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    // 注意：不依赖 gold/selectedTowerType 以避免频繁重建
    // 这些值通过 render 函数内部传递
  }, [gameState, startWave, wave]);
  
  // ============================================
  // UI CALLBACKS / UI 回调
  // ============================================
  
  /**
   * 切换语言 / Toggle language
   */
  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  }, []);

  /**
   * 切换暂停状态 / Toggle pause
   */
  const togglePause = useCallback(() => {
    if (gameState === 'playing') {
      setIsPaused(prev => !prev);
    }
  }, [gameState]);
  
  // ============ Keyboard Handler / 键盘处理 ============
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && gameState === 'playing') {
        togglePause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, togglePause]);
  
  // ============ Derived State / 派生状态 ============
  
  /**
   * 计算敌人速度倍率（用于HUD显示）/ Calculate enemy speed multiplier (for HUD)
   */
  const enemySpeedMultiplier = 1 
    + (wave - 1) * WAVE_SPEED_BONUS 
    + gameRef.current.enemiesLeaked * LEAK_SPEED_BONUS 
    + gameRef.current.towers.length * TOWER_SPEED_BONUS
    + (wave >= 5 ? MOSQUITO_SPEED_BONUS : 0)    // 蚊子类波次
    + (wave >= 10 ? RAT_SPEED_BONUS : 0);       // 老鼠类波次
  
  const towerCount = gameRef.current.towers.length;
  
  // ============================================
  // RENDER UI / 渲染UI
  // ============================================
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      {/* 游戏标题 / Game title */}
      <h1 style={{ 
        fontFamily: 'Fredoka One, cursive', 
        fontSize: '48px', 
        color: '#FF6B9D', 
        textShadow: '3px 3px 0 #FFF, 5px 5px 0 #FFD5E5', 
        letterSpacing: '4px', 
        animation: 'float 3s ease-in-out infinite' 
      }}>
        {t.title}
      </h1>
      
      {/* HUD - 游戏状态显示 / Game stats display */}
      <HUD 
        wave={wave} 
        gold={gold} 
        lives={lives} 
        score={score} 
        towerCount={towerCount} 
        enemySpeedMultiplier={enemySpeedMultiplier} 
        lang={lang} 
        onToggleLang={toggleLang}
        onTogglePause={togglePause}
        isPaused={isPaused}
      />
      
      {/* 游戏画布 / Game canvas */}
      <div style={{ position: 'relative' }}>
        <canvas 
          ref={canvasRef} 
          width={GRID_WIDTH * TILE_SIZE} 
          height={GRID_HEIGHT * TILE_SIZE} 
          onClick={handleCanvasClick} 
          onMouseMove={handleCanvasHover} 
          style={{ 
            border: '6px solid #FFB6C1', 
            borderRadius: '20px', 
            boxShadow: '0 10px 30px rgba(255, 107, 157, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.5)', 
            cursor: 'crosshair', 
            background: '#FFF8E7', 
            display: 'block' 
          }} 
        />
        
        {/* 开始界面 / Start screen */}
        {gameState === 'start' && <StartOverlay onStart={startGame} lang={lang} />}
        
        {/* 游戏结束界面 / Game over screen */}
        {gameState === 'gameover' && (
          <Overlay 
            title={t.gameOver} 
            score={score} 
            buttonText={t.tryAgain} 
            onButtonClick={startGame} 
            lang={lang} 
          />
        )}
        
        {/* 胜利界面 / Victory screen */}
        {gameState === 'victory' && (
          <Overlay 
            title={t.victory} 
            subtitle={t.victorySubtitle} 
            score={score} 
            buttonText={t.playAgain} 
            onButtonClick={startGame} 
            lang={lang} 
          />
        )}

        {/* 暂停界面 / Pause screen */}
        {gameState === 'playing' && isPaused && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '768px',
            height: '512px',
            background: 'rgba(255, 248, 231, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '14px',
            zIndex: 100
          }}>
            <div style={{
              fontFamily: 'Fredoka One, cursive',
              fontSize: '48px',
              color: '#FF9800',
              marginBottom: '20px'
            }}>
              {t.pause}
            </div>
            <button 
              onClick={togglePause} 
              style={{
                fontFamily: 'Fredoka One, cursive',
                fontSize: '24px',
                padding: '12px 40px',
                background: 'linear-gradient(180deg, #4CAF50 0%, #388E3C 100%)',
                color: 'white',
                border: '4px solid #2E7D32',
                borderRadius: '30px',
                cursor: 'pointer',
                boxShadow: '0 6px 0 #1B5E20'
              }}
            >
              {t.resume}
            </button>
          </div>
        )}
      </div>
      
      {/* 防御塔选择面板 / Tower selection panel */}
      <TowerPanel 
        selectedTowerType={selectedTowerType} 
        gold={gold} 
        onSelectTower={handleSelectTower} 
        lang={lang} 
      />
    </div>
  );
}
