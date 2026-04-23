import { useState, useCallback, useRef, useEffect } from 'react';
import { TOWER_TYPES, TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, PATH_COORDS, WAVES, ENEMY_TYPES, GameState } from './game/config';

interface Tower { x: number; y: number; type: number; lastAttack: number; angle: number; }
interface Enemy { x: number; y: number; type: number; health: number; maxHealth: number; speed: number; reward: number; pathIndex: number; wobble: number; }
interface Projectile { x: number; y: number; angle: number; speed: number; damage: number; type: 'single' | 'aoe'; aoeRadius?: number; life: number; }
interface Particle { x: number; y: number; vx: number; vy: number; color: string; life: number; alpha: number; size: number; }

function buildInitialMap() {
  const map: number[][] = [];
  const path: { x: number; y: number }[] = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    map[y] = [];
    for (let x = 0; x < GRID_WIDTH; x++) map[y][x] = 0;
  }
  for (const coord of PATH_COORDS) {
    if (coord.x >= 0 && coord.x < GRID_WIDTH && coord.y >= 0 && coord.y < GRID_HEIGHT) {
      map[coord.y][coord.x] = 1;
      path.push({ x: coord.x * TILE_SIZE + TILE_SIZE / 2, y: coord.y * TILE_SIZE + TILE_SIZE / 2 });
    }
  }
  const lastPath = PATH_COORDS[PATH_COORDS.length - 1];
  map[lastPath.y][lastPath.x] = 3;
  return { map, path };
}

function spawnBoxes(map: number[][]) {
  const boxes: { x: number; y: number }[] = [];
  for (let i = 0; i < 5; i++) {
    let boxX: number, boxY: number;
    do { boxX = Math.floor(Math.random() * GRID_WIDTH); boxY = Math.floor(Math.random() * GRID_HEIGHT); } while (map[boxY][boxX] !== 0);
    map[boxY][boxX] = 2;
    boxes.push({ x: boxX, y: boxY });
  }
  return boxes;
}

function HUD({ wave, gold, lives, score }: { wave: number; gold: number; lives: number; score: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '768px', padding: '12px 20px', background: 'linear-gradient(90deg, #FFE4EC, #FFF, #FFE4EC)', borderRadius: '20px', border: '4px solid #FFB6C1', fontFamily: 'Nunito, sans-serif', fontSize: '20px', color: '#5D4037' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.8)', borderRadius: '15px' }}><span style={{ fontSize: '24px' }}>🌊</span><span>Wave</span><span style={{ color: '#FF6B9D', fontFamily: 'Fredoka One, cursive', minWidth: '40px' }}>{wave}/15</span></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.8)', borderRadius: '15px' }}><span style={{ fontSize: '24px' }}>🪙</span><span style={{ color: '#FF6B9D', fontFamily: 'Fredoka One, cursive' }}>{gold}</span></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.8)', borderRadius: '15px' }}><span style={{ fontSize: '24px' }}>❤️</span><span style={{ color: '#FF6B9D', fontFamily: 'Fredoka One, cursive' }}>{lives}</span></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.8)', borderRadius: '15px' }}><span style={{ fontSize: '24px' }}>⭐</span><span style={{ color: '#FF6B9D', fontFamily: 'Fredoka One, cursive' }}>{score}</span></div>
    </div>
  );
}

function TowerPanel({ selectedTowerType, gold, onSelectTower }: { selectedTowerType: number; gold: number; onSelectTower: (type: number) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', padding: '15px', background: 'linear-gradient(180deg, #FFF 0%, #FCE4EC 100%)', borderRadius: '20px', border: '4px solid #FFB6C1', width: '768px' }}>
      {TOWER_TYPES.map((tower, index) => (
        <button key={tower.name} onClick={() => onSelectTower(index)} disabled={gold < tower.cost} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 20px', background: selectedTowerType === index ? 'linear-gradient(180deg, #FF80AB 0%, #FF4081 100%)' : 'linear-gradient(180deg, #FFF 0%, #F8BBD9 100%)', border: `3px solid ${selectedTowerType === index ? '#C51162' : '#FF80AB'}`, borderRadius: '15px', cursor: gold < tower.cost ? 'not-allowed' : 'pointer', opacity: gold < tower.cost ? 0.5 : 1, minWidth: '140px', transition: 'all 0.2s ease', fontFamily: 'Nunito, sans-serif' }}>
          <span style={{ fontSize: '36px', marginBottom: '5px' }}>{index === 0 ? '😸' : index === 1 ? '😺' : '😻'}</span>
          <span style={{ fontFamily: 'Fredoka One, cursive', fontSize: '14px', color: selectedTowerType === index ? 'white' : '#5D4037' }}>{tower.name}</span>
          <span style={{ fontSize: '16px', color: selectedTowerType === index ? 'white' : '#FFA000', fontWeight: 800 }}>🪙 {tower.cost}</span>
        </button>
      ))}
    </div>
  );
}

function Overlay({ title, subtitle, score, buttonText, onButtonClick }: { title: string; subtitle?: string; score?: number; buttonText: string; onButtonClick: () => void }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '768px', height: '512px', background: 'rgba(255, 248, 231, 0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', zIndex: 100 }}>
      <div style={{ fontFamily: 'Fredoka One, cursive', fontSize: '56px', color: '#FF6B9D', textShadow: '4px 4px 0 #FFD5E5', marginBottom: '20px' }}>{title}</div>
      {subtitle && <div style={{ fontSize: '24px', color: '#8D6E63', marginBottom: '30px' }}>{subtitle}</div>}
      {score !== undefined && <div style={{ fontFamily: 'Fredoka One, cursive', fontSize: '36px', color: '#FFA000', margin: '20px 0' }}>Score: {score}</div>}
      <button onClick={onButtonClick} style={{ fontFamily: 'Fredoka One, cursive', fontSize: '28px', padding: '15px 60px', background: 'linear-gradient(180deg, #4CAF50 0%, #388E3C 100%)', color: 'white', border: '4px solid #2E7D32', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 6px 0 #1B5E20' }}>{buttonText}</button>
    </div>
  );
}

function StartOverlay({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '768px', height: '512px', background: 'rgba(255, 248, 231, 0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', zIndex: 100 }}>
      <div style={{ fontFamily: 'Fredoka One, cursive', fontSize: '56px', color: '#FF6B9D', textShadow: '4px 4px 0 #FFD5E5', marginBottom: '20px' }}>🥫 "金金" Defense 🐱</div>
      <div style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '20px', borderRadius: '15px', marginBottom: '30px', textAlign: 'center', maxWidth: '500px' }}>
        <p style={{ color: '#5D4037', fontSize: '16px', margin: '8px 0' }}>🛡️ <strong>Cute cats</strong> vs <strong>Household Pests!</strong></p>
        <p style={{ color: '#5D4037', fontSize: '16px', margin: '8px 0' }}>🐛 <strong>Cucumbers</strong> and <strong>Vacuum Cleaners</strong> are attacking!</p>
        <p style={{ color: '#5D4037', fontSize: '16px', margin: '8px 0' }}>🧀 <strong>Click boxes</strong> to break them and free space!</p>
        <p style={{ color: '#5D4037', fontSize: '16px', margin: '8px 0' }}>🏆 Survive <strong>15 Waves</strong> to win!</p>
      </div>
      <button onClick={onStart} style={{ fontFamily: 'Fredoka One, cursive', fontSize: '28px', padding: '15px 60px', background: 'linear-gradient(180deg, #4CAF50 0%, #388E3C 100%)', color: 'white', border: '4px solid #2E7D32', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 6px 0 #1B5E20' }}>START 🐱</button>
    </div>
  );
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('start');
  const [gold, setGold] = useState(100);
  const [lives, setLives] = useState(10);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [selectedTowerType, setSelectedTowerType] = useState(-1);

  const gameRef = useRef({ map: [] as number[][], path: [] as { x: number; y: number }[], towers: [] as Tower[], enemies: [] as Enemy[], projectiles: [] as Projectile[], particles: [] as Particle[], boxes: [] as { x: number; y: number }[], enemiesToSpawn: [] as number[], enemySpawnTimer: 0, waveInProgress: false, hoverTile: { x: -1, y: -1 } });
  const animationRef = useRef<number>(0);

  const createParticle = (x: number, y: number, color: string): Particle => ({ x, y, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8 - 3, color, life: 30 + Math.random() * 20, alpha: 1, size: 4 + Math.random() * 4 });

  const startWave = useCallback((waveNum: number) => {
    const waveData = WAVES[waveNum - 1];
    const enemiesToSpawn: number[] = [];
    for (const enemyGroup of waveData) for (let i = 0; i < enemyGroup.count; i++) enemiesToSpawn.push(enemyGroup.type);
    for (let i = enemiesToSpawn.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [enemiesToSpawn[i], enemiesToSpawn[j]] = [enemiesToSpawn[j], enemiesToSpawn[i]]; }
    gameRef.current.enemiesToSpawn = enemiesToSpawn;
    gameRef.current.enemySpawnTimer = 0;
    gameRef.current.waveInProgress = true;
  }, []);

  const startGame = useCallback(() => {
    const { map, path } = buildInitialMap();
    const boxes = spawnBoxes(map);
    gameRef.current = { map, path, towers: [], enemies: [], projectiles: [], particles: [], boxes, enemiesToSpawn: [], enemySpawnTimer: 0, waveInProgress: false, hoverTile: { x: -1, y: -1 } };
    setGold(100); setLives(10); setScore(0); setWave(1); setSelectedTowerType(-1); setGameState('playing'); startWave(1);
  }, [startWave]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const tileX = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const tileY = Math.floor((e.clientY - rect.top) / TILE_SIZE);
    const state = gameRef.current;
    const boxIdx = state.boxes.findIndex(b => b.x === tileX && b.y === tileY);
    if (boxIdx !== -1) {
      state.boxes.splice(boxIdx, 1);
      state.map[tileY][tileX] = 0;
      setGold(prev => prev + 5);
      setScore(prev => prev + 10);
      for (let p = 0; p < 10; p++) state.particles.push(createParticle(tileX * TILE_SIZE + TILE_SIZE / 2, tileY * TILE_SIZE + TILE_SIZE / 2, '#8D6E63'));
      return;
    }
    if (selectedTowerType >= 0) {
      if (tileX < 0 || tileX >= GRID_WIDTH || tileY < 0 || tileY >= GRID_HEIGHT) return;
      if (state.map[tileY][tileX] !== 0) return;
      const towerType = TOWER_TYPES[selectedTowerType];
      if (gold >= towerType.cost) {
        setGold(prev => prev - towerType.cost);
        state.towers.push({ x: tileX * TILE_SIZE + TILE_SIZE / 2, y: tileY * TILE_SIZE + TILE_SIZE / 2, type: selectedTowerType, lastAttack: 0, angle: 0 });
        state.map[tileY][tileX] = 4;
        for (let p = 0; p < 15; p++) state.particles.push(createParticle(tileX * TILE_SIZE + TILE_SIZE / 2, tileY * TILE_SIZE + TILE_SIZE / 2, '#FFD700'));
      }
    }
  }, [gameState, selectedTowerType, gold]);

  const handleCanvasHover = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    gameRef.current.hoverTile = { x: Math.floor((e.clientX - rect.left) / TILE_SIZE), y: Math.floor((e.clientY - rect.top) / TILE_SIZE) };
  }, []);

  const handleSelectTower = useCallback((type: number) => { setSelectedTowerType(prev => prev === type ? -1 : type); }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const spawnEnemy = (type: number) => {
      const enemyType = ENEMY_TYPES[type];
      const startPos = gameRef.current.path[0];
      gameRef.current.enemies.push({ x: startPos.x, y: startPos.y, type, health: enemyType.health, maxHealth: enemyType.health, speed: enemyType.speed, reward: enemyType.reward, pathIndex: 2, wobble: Math.random() * Math.PI * 2 });
    };

    const damageEnemy = (enemy: Enemy, damage: number) => {
      const state = gameRef.current;
      enemy.health -= damage;
      if (enemy.health <= 0) {
        const idx = state.enemies.indexOf(enemy);
        if (idx !== -1) {
          setGold(prev => prev + enemy.reward);
          setScore(prev => prev + enemy.reward * 10);
          for (let p = 0; p < 15; p++) state.particles.push(createParticle(enemy.x, enemy.y, '#7CB342'));
          state.enemies.splice(idx, 1);
        }
      }
    };

    const render = () => {
      const state = gameRef.current;
      ctx.fillStyle = '#FFF8E7';
      ctx.fillRect(0, 0, GRID_WIDTH * TILE_SIZE, GRID_HEIGHT * TILE_SIZE);
      for (let y = 0; y < GRID_HEIGHT; y++) for (let x = 0; x < GRID_WIDTH; x++) if (state.map[y]?.[x] === 0) { ctx.fillStyle = (x + y) % 2 === 0 ? '#FFF8E7' : '#FFF1E0'; ctx.fillRect(x * TILE_SIZE + 2, y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4); }

      if (state.path.length > 0) {
        ctx.strokeStyle = '#FFE0B2';
        ctx.lineWidth = TILE_SIZE * 0.6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        for (let i = 0; i < state.path.length; i++) { if (i === 0) ctx.moveTo(state.path[i].x, state.path[i].y); else ctx.lineTo(state.path[i].x, state.path[i].y); }
        ctx.stroke();
        ctx.strokeStyle = '#FFCC80';
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        for (let i = 0; i < state.path.length; i++) { if (i === 0) ctx.moveTo(state.path[i].x, state.path[i].y); else ctx.lineTo(state.path[i].x, state.path[i].y); }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      for (const box of state.boxes) {
        const x = box.x * TILE_SIZE;
        const y = box.y * TILE_SIZE;
        ctx.fillStyle = '#A1887F';
        ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 12);
        ctx.fillStyle = '#BCAAA4';
        ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, 15);
        ctx.fillStyle = '#8D6E63';
        ctx.fillRect(x + TILE_SIZE / 2 - 3, y + 4, 6, TILE_SIZE - 12);
        ctx.fillRect(x + 4, y + TILE_SIZE / 2 - 3, TILE_SIZE - 8, 6);
        ctx.fillStyle = '#FFF';
        ctx.font = '12px Nunito';
        ctx.textAlign = 'center';
        ctx.fillText('🖱️', x + TILE_SIZE / 2, y + TILE_SIZE - 15);
      }

      for (const tower of state.towers) {
        const towerType = TOWER_TYPES[tower.type];
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(tower.x, tower.y + 20, 20, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = towerType.color;
        if (tower.type === 0) {
          ctx.beginPath();
          ctx.ellipse(tower.x, tower.y + 5, 22, 18, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(tower.x, tower.y - 10, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#4E342E';
          ctx.beginPath();
          ctx.arc(tower.x - 7, tower.y - 12, 4, 0, Math.PI * 2);
          ctx.arc(tower.x + 7, tower.y - 12, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FF8A80';
          ctx.beginPath();
          ctx.arc(tower.x, tower.y - 8, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (tower.type === 1) {
          ctx.beginPath();
          ctx.ellipse(tower.x, tower.y + 5, 22, 18, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(tower.x, tower.y - 10, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#1E88E5';
          ctx.beginPath();
          ctx.ellipse(tower.x - 7, tower.y - 12, 5, 6, 0, 0, Math.PI * 2);
          ctx.ellipse(tower.x + 7, tower.y - 12, 5, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.arc(tower.x - 7, tower.y - 12, 2, 0, Math.PI * 2);
          ctx.arc(tower.x + 7, tower.y - 12, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.ellipse(tower.x, tower.y + 8, 26, 22, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(tower.x, tower.y - 8, 20, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFAB91';
          ctx.beginPath();
          ctx.ellipse(tower.x - 12, tower.y - 4, 6, 4, 0, 0, Math.PI * 2);
          ctx.ellipse(tower.x + 12, tower.y - 4, 6, 4, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (const enemy of state.enemies) {
        const enemyY = enemy.y + Math.sin(enemy.wobble) * 2;
        if (enemy.type === 0) {
          ctx.fillStyle = '#7CB342';
          ctx.beginPath();
          ctx.ellipse(enemy.x, enemyY, 20, 12, 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFF';
          ctx.beginPath();
          ctx.ellipse(enemy.x - 8, enemyY - 5, 5, 4, 0, 0, Math.PI * 2);
          ctx.ellipse(enemy.x + 8, enemyY - 5, 5, 4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.ellipse(enemy.x - 8, enemyY - 5, 2, 3, 0, 0, Math.PI * 2);
          ctx.ellipse(enemy.x + 8, enemyY - 5, 2, 3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFCDD2';
          ctx.fillRect(enemy.x - 15, enemyY - 22, 30, 4);
          ctx.fillStyle = '#EF5350';
          ctx.fillRect(enemy.x - 15, enemyY - 22, 30 * (enemy.health / enemy.maxHealth), 4);
        } else {
          ctx.fillStyle = '#607D8B';
          ctx.beginPath();
          ctx.arc(enemy.x, enemyY, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFEB3B';
          ctx.beginPath();
          ctx.ellipse(enemy.x - 8, enemyY - 3, 6, 8, 0, 0, Math.PI * 2);
          ctx.ellipse(enemy.x + 8, enemyY - 3, 6, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.ellipse(enemy.x - 8, enemyY - 3, 3, 5, 0, 0, Math.PI * 2);
          ctx.ellipse(enemy.x + 8, enemyY - 3, 3, 5, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (const proj of state.projectiles) {
        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(proj.angle);
        if (proj.type === 'aoe') { ctx.fillStyle = '#D7CCC8'; ctx.beginPath(); ctx.ellipse(0, 0, 12, 8, 0, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.fillStyle = '#FFF8E1'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      }

      if (state.path.length > 0) {
        const base = state.path[state.path.length - 1];
        const gradient = ctx.createRadialGradient(base.x, base.y, 10, base.x, base.y, 40);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(base.x, base.y, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(base.x, base.y + 5, 25, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFA000';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = '#FFC107';
        ctx.beginPath();
        ctx.ellipse(base.x, base.y, 25, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 10px Nunito';
        ctx.textAlign = 'center';
        ctx.fillText('TUNA', base.x, base.y + 3);
        ctx.font = '12px sans-serif';
        ctx.fillText('🐾', base.x, base.y + 15);
      }

      for (const p of state.particles) { ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;

      if (gameState === 'playing' && selectedTowerType >= 0) {
        const h = state.hoverTile;
        if (h.x >= 0 && h.x < GRID_WIDTH && h.y >= 0 && h.y < GRID_HEIGHT && state.map[h.y]?.[h.x] === 0) {
          const x = h.x * TILE_SIZE;
          const y = h.y * TILE_SIZE;
          const towerType = TOWER_TYPES[selectedTowerType];
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.beginPath();
          ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, towerType.range, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = gold >= towerType.cost ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)';
          ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        }
      }
    };

    const update = (timestamp: number) => {
      if (gameState !== 'playing') return;
      const state = gameRef.current;

      if (state.enemiesToSpawn.length > 0) {
        state.enemySpawnTimer++;
        if (state.enemySpawnTimer >= 60) { state.enemySpawnTimer = 0; spawnEnemy(state.enemiesToSpawn.shift()!); }
      }

      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const enemy = state.enemies[i];
        const targetIndex = Math.min(enemy.pathIndex, state.path.length - 1);
        const target = state.path[targetIndex];
        const dx = target.x - enemy.x;
        const dy = target.y - enemy.y;
        const dist = Math.hypot(dx, dy);
        if (dist < enemy.speed) enemy.pathIndex++;
        else { enemy.x += (dx / dist) * enemy.speed; enemy.y += (dy / dist) * enemy.speed; }
        enemy.wobble += 0.2;
        if (enemy.pathIndex >= state.path.length) { state.enemies.splice(i, 1); setLives(prev => { const newLives = prev - 1; if (newLives <= 0) setGameState('gameover'); return newLives; }); }
      }

      for (const tower of state.towers) {
        const towerType = TOWER_TYPES[tower.type];
        if (timestamp - tower.lastAttack < towerType.attackSpeed) continue;
        let target: Enemy | null = null;
        let maxProgress = -1;
        for (const enemy of state.enemies) { const dist = Math.hypot(enemy.x - tower.x, enemy.y - tower.y); if (dist <= towerType.range && enemy.pathIndex > maxProgress) { maxProgress = enemy.pathIndex; target = enemy; } }
        if (target) { tower.lastAttack = timestamp; const angle = Math.atan2(target.y - tower.y, target.x - tower.x); tower.angle = angle; state.projectiles.push({ x: tower.x, y: tower.y, angle, speed: towerType.type === 'aoe' ? 8 : (tower.type === 0 ? 10 : 15), damage: towerType.damage, type: towerType.type as 'single' | 'aoe', aoeRadius: towerType.aoeRadius, life: 60 }); }
      }

      for (let i = state.projectiles.length - 1; i >= 0; i--) {
        const proj = state.projectiles[i];
        proj.x += Math.cos(proj.angle) * proj.speed;
        proj.y += Math.sin(proj.angle) * proj.speed;
        proj.life--;
        for (let j = state.enemies.length - 1; j >= 0; j--) { const enemy = state.enemies[j]; if (Math.hypot(proj.x - enemy.x, proj.y - enemy.y) < 25) { if (proj.type === 'aoe') { const aoeRad = proj.aoeRadius || 60; for (let k = state.enemies.length - 1; k >= 0; k--) { const e = state.enemies[k]; if (Math.hypot(proj.x - e.x, proj.y - e.y) < aoeRad) damageEnemy(e, proj.damage); } } else damageEnemy(enemy, proj.damage); state.projectiles.splice(i, 1); break; } }
        if (proj.life <= 0 || proj.x < 0 || proj.x > GRID_WIDTH * TILE_SIZE || proj.y < 0 || proj.y > GRID_HEIGHT * TILE_SIZE) state.projectiles.splice(i, 1);
      }

      for (let i = state.particles.length - 1; i >= 0; i--) { const p = state.particles[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life--; p.alpha = p.life / 30; if (p.life <= 0) state.particles.splice(i, 1); }

      if (state.waveInProgress && state.enemiesToSpawn.length === 0 && state.enemies.length === 0) {
        state.waveInProgress = false;
        setTimeout(() => {
          if (gameState === 'playing') {
            setWave(prev => {
              const newWave = prev + 1;
              if (newWave > 15) {
                setGameState('victory');
              } else {
                startWave(newWave);
              }
              return newWave;
            });
          }
        }, 1000);
      }
    };

    const gameLoop = (timestamp: number) => { update(timestamp); render(); animationRef.current = requestAnimationFrame(gameLoop); };
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [gameState, gold, selectedTowerType, startWave]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <h1 style={{ fontFamily: 'Fredoka One, cursive', fontSize: '48px', color: '#FF6B9D', textShadow: '3px 3px 0 #FFF, 5px 5px 0 #FFD5E5', letterSpacing: '4px', animation: 'float 3s ease-in-out infinite' }}>🐱 Hajimi Defense 🥫</h1>
      <HUD wave={wave} gold={gold} lives={lives} score={score} />
      <div style={{ position: 'relative' }}>
        <canvas ref={canvasRef} width={GRID_WIDTH * TILE_SIZE} height={GRID_HEIGHT * TILE_SIZE} onClick={handleCanvasClick} onMouseMove={handleCanvasHover} style={{ border: '6px solid #FFB6C1', borderRadius: '20px', boxShadow: '0 10px 30px rgba(255, 107, 157, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.5)', cursor: 'crosshair', background: '#FFF8E7', display: 'block' }} />
        {gameState === 'start' && <StartOverlay onStart={startGame} />}
        {gameState === 'gameover' && <Overlay title="💔 Game Over 💔" score={score} buttonText="TRY AGAIN 🔄" onButtonClick={startGame} />}
        {gameState === 'victory' && <Overlay title="🎉 YOU WIN! 🎉" subtitle="🐱 The Golden Tuna is Safe! 🥫" score={score} buttonText="PLAY AGAIN 🐱" onButtonClick={startGame} />}
      </div>
      <TowerPanel selectedTowerType={selectedTowerType} gold={gold} onSelectTower={handleSelectTower} />
    </div>
  );
}