import { useState, useCallback, useRef, useEffect } from 'react';
import { TOWER_TYPES, TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, PATH_COORDS, WAVES, ENEMY_TYPES, GameState, Language } from './game/config';
import { TEXT } from './game/i18n';

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

function HUD({ wave, gold, lives, score, towerCount, enemySpeedMultiplier, lang, onToggleLang }: { wave: number; gold: number; lives: number; score: number; towerCount: number; enemySpeedMultiplier: number; lang: Language; onToggleLang: () => void }) {
  const t = TEXT(lang);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '768px', padding: '10px 16px', background: 'linear-gradient(90deg, #FFE4EC, #FFF, #FFE4EC)', borderRadius: '16px', border: '3px solid #FFB6C1', fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#5D4037', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', background: 'rgba(255,255,255,0.8)', borderRadius: '10px', whiteSpace: 'nowrap' }}><span style={{ fontSize: '16px' }}>🌊</span><span>{t.wave}</span><span style={{ color: '#FF6B9D', fontFamily: 'Fredoka One, cursive', minWidth: '32px' }}>{wave}/15</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', background: 'rgba(255,255,255,0.8)', borderRadius: '10px', whiteSpace: 'nowrap' }}><span style={{ fontSize: '16px' }}>🪙</span><span style={{ color: '#FF6B9D', fontFamily: 'Fredoka One, cursive' }}>{gold}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', background: 'rgba(255,255,255,0.8)', borderRadius: '10px', whiteSpace: 'nowrap' }}><span style={{ fontSize: '16px' }}>❤️</span><span style={{ color: '#FF6B9D', fontFamily: 'Fredoka One, cursive' }}>{lives}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', background: 'rgba(255,255,255,0.8)', borderRadius: '10px', whiteSpace: 'nowrap' }}><span style={{ fontSize: '16px' }}>⭐</span><span style={{ color: '#FF6B9D', fontFamily: 'Fredoka One, cursive' }}>{score}</span></div>
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 8px', background: 'rgba(255,182,193,0.5)', borderRadius: '10px', whiteSpace: 'nowrap' }}><span style={{ fontSize: '14px' }}>🐱</span><span>{t.towerCount}</span><span style={{ color: '#FF6B9D', fontFamily: 'Fredoka One, cursive' }}>{towerCount}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 8px', background: 'rgba(255,152,0,0.3)', borderRadius: '10px', whiteSpace: 'nowrap' }}><span style={{ fontSize: '14px' }}>⚡</span><span>{t.enemySpeed}</span><span style={{ color: '#FF9800', fontFamily: 'Fredoka One, cursive' }}>{(enemySpeedMultiplier * 100).toFixed(0)}%</span></div>
        <button onClick={onToggleLang} style={{ padding: '6px 12px', background: '#FFB6C1', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'Fredoka One, cursive', fontSize: '12px', color: '#FFF', whiteSpace: 'nowrap' }}>
          {lang === 'zh' ? 'EN' : '中'}
        </button>
      </div>
    </div>
  );
}

function TowerPanel({ selectedTowerType, gold, onSelectTower, lang }: { selectedTowerType: number; gold: number; onSelectTower: (type: number) => void; lang: Language }) {
  const t = TEXT(lang);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', padding: '15px', background: 'linear-gradient(180deg, #FFF 0%, #FCE4EC 100%)', borderRadius: '20px', border: '4px solid #FFB6C1', width: '768px' }}>
      {TOWER_TYPES.map((tower, index) => (
        <button key={tower.name} onClick={() => onSelectTower(index)} disabled={gold < tower.cost} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 20px', background: selectedTowerType === index ? 'linear-gradient(180deg, #FF80AB 0%, #FF4081 100%)' : 'linear-gradient(180deg, #FFF 0%, #F8BBD9 100%)', border: `3px solid ${selectedTowerType === index ? '#C51162' : '#FF80AB'}`, borderRadius: '15px', cursor: gold < tower.cost ? 'not-allowed' : 'pointer', opacity: gold < tower.cost ? 0.5 : 1, minWidth: '140px', transition: 'all 0.2s ease', fontFamily: 'Nunito, sans-serif' }}>
          <span style={{ fontSize: '36px', marginBottom: '5px' }}>{index === 0 ? '😸' : index === 1 ? '😺' : '😻'}</span>
          <span style={{ fontFamily: 'Fredoka One, cursive', fontSize: '14px', color: selectedTowerType === index ? 'white' : '#5D4037' }}>{t.towerNames[index]}</span>
          <span style={{ fontSize: '16px', color: selectedTowerType === index ? 'white' : '#FFA000', fontWeight: 800 }}>🪙 {tower.cost}</span>
        </button>
      ))}
    </div>
  );
}

function Overlay({ title, subtitle, score, buttonText, onButtonClick, lang }: { title: string; subtitle?: string; score?: number; buttonText: string; onButtonClick: () => void; lang: Language }) {
  const t = TEXT(lang);
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '768px', height: '512px', background: 'rgba(255, 248, 231, 0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', zIndex: 100 }}>
      <div style={{ fontFamily: 'Fredoka One, cursive', fontSize: '56px', color: '#FF6B9D', textShadow: '4px 4px 0 #FFD5E5', marginBottom: '20px' }}>{title}</div>
      {subtitle && <div style={{ fontSize: '24px', color: '#8D6E63', marginBottom: '30px' }}>{subtitle}</div>}
      {score !== undefined && <div style={{ fontFamily: 'Fredoka One, cursive', fontSize: '36px', color: '#FFA000', margin: '20px 0' }}>{t.finalScore}: {score}</div>}
      <button onClick={onButtonClick} style={{ fontFamily: 'Fredoka One, cursive', fontSize: '28px', padding: '15px 60px', background: 'linear-gradient(180deg, #4CAF50 0%, #388E3C 100%)', color: 'white', border: '4px solid #2E7D32', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 6px 0 #1B5E20' }}>{buttonText}</button>
    </div>
  );
}

function StartOverlay({ onStart, lang }: { onStart: () => void; lang: Language }) {
  const t = TEXT(lang);
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '768px', height: '512px', background: 'rgba(255, 248, 231, 0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', zIndex: 100 }}>
      <div style={{ fontFamily: 'Fredoka One, cursive', fontSize: '56px', color: '#FF6B9D', textShadow: '4px 4px 0 #FFD5E5', marginBottom: '20px' }}>{t.startTitle}</div>
      <div style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '20px', borderRadius: '15px', marginBottom: '30px', textAlign: 'center', maxWidth: '500px' }}>
        {t.instructions.map((text, i) => (
          <p key={i} style={{ color: '#5D4037', fontSize: '16px', margin: '8px 0' }}>{text}</p>
        ))}
      </div>
      <button onClick={onStart} style={{ fontFamily: 'Fredoka One, cursive', fontSize: '28px', padding: '15px 60px', background: 'linear-gradient(180deg, #4CAF50 0%, #388E3C 100%)', color: 'white', border: '4px solid #2E7D32', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 6px 0 #1B5E20' }}>{t.startButton}</button>
    </div>
  );
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('start');
  const [lang, setLang] = useState<Language>('zh');
  const [gold, setGold] = useState(100);
  const [lives, setLives] = useState(10);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [selectedTowerType, setSelectedTowerType] = useState(-1);

  // Get localized text
  const t = TEXT(lang);

  const gameRef = useRef({ map: [] as number[][], path: [] as { x: number; y: number }[], towers: [] as Tower[], enemies: [] as Enemy[], projectiles: [] as Projectile[], particles: [] as Particle[], boxes: [] as { x: number; y: number }[], enemiesToSpawn: [] as number[], enemySpawnTimer: 0, waveInProgress: false, hoverTile: { x: -1, y: -1 }, enemiesLeaked: 0 });
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
    gameRef.current = { map, path, towers: [], enemies: [], projectiles: [], particles: [], boxes, enemiesToSpawn: [], enemySpawnTimer: 0, waveInProgress: false, hoverTile: { x: -1, y: -1 }, enemiesLeaked: 0 };
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
      
      // Speed increases with wave number, enemies leaked, and tower count
      const waveBonus = (wave - 1) * 0.1; // 10% faster per wave
      const leakBonus = gameRef.current.enemiesLeaked * 0.05; // 5% faster per enemy leaked
      const towerBonus = gameRef.current.towers.length * 0.02; // 2% faster per cat
      
      // Enemy type bonus: +50% for mosquito (wave 5+), +100% for rat (wave 10+)
      let enemyTypeBonus = 0;
      if (type === 2) enemyTypeBonus = 0.5; // Mosquito: +50%
      if (type === 3) enemyTypeBonus = 1.0; // Rat: +100%
      
      const speedMultiplier = 1 + waveBonus + leakBonus + towerBonus + enemyTypeBonus;
      const finalSpeed = enemyType.speed * speedMultiplier;
      
      // Reward also increases with tower count (higher tower count = more points)
      // But NO bonus for enemy type (mosquito/rat don't give extra points)
      const rewardMultiplier = 1 + gameRef.current.towers.length * 0.02;
      const finalReward = Math.floor(enemyType.reward * rewardMultiplier);
      
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

    const damageEnemy = (enemy: Enemy, damage: number) => {
      const state = gameRef.current;
      enemy.health -= damage;
      if (enemy.health <= 0) {
        const idx = state.enemies.indexOf(enemy);
        if (idx !== -1) {
          // Score multiplier based on enemy speed (faster = more points)
          const speedBonus = Math.floor(enemy.speed * 10);
          const earnedGold = enemy.reward;
          const earnedScore = (enemy.reward + speedBonus) * 10;
          setGold(prev => prev + earnedGold);
          setScore(prev => prev + earnedScore);
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
        const tx = tower.x;
        const ty = tower.y;
        
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.ellipse(tx, ty + 22, 24, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        if (tower.type === 0) {
          // 😸 Spitting Tabby - Orange tabby cat
          // Body (chibi style)
          ctx.fillStyle = '#FF8C42'; // Orange body
          ctx.beginPath();
          ctx.ellipse(tx, ty + 10, 24, 20, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Stripes
          ctx.strokeStyle = '#E65100';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(tx - 12, ty); ctx.lineTo(tx - 6, ty + 12);
          ctx.moveTo(tx + 12, ty); ctx.lineTo(tx + 6, ty + 12);
          ctx.moveTo(tx, ty - 4); ctx.lineTo(tx, ty + 10);
          ctx.stroke();
          
          // Head (round)
          ctx.fillStyle = '#FF8C42';
          ctx.beginPath();
          ctx.arc(tx, ty - 8, 20, 0, Math.PI * 2);
          ctx.fill();
          
          // Ears (small triangles)
          ctx.fillStyle = '#FF8C42';
          ctx.beginPath();
          ctx.moveTo(tx - 14, ty - 20); ctx.lineTo(tx - 10, ty - 32); ctx.lineTo(tx - 4, ty - 22);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(tx + 14, ty - 20); ctx.lineTo(tx + 10, ty - 32); ctx.lineTo(tx + 4, ty - 22);
          ctx.fill();
          
          // Inner ears (pink)
          ctx.fillStyle = '#FFAB91';
          ctx.beginPath();
          ctx.moveTo(tx - 12, ty - 22); ctx.lineTo(tx - 10, ty - 28); ctx.lineTo(tx - 6, ty - 22);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(tx + 12, ty - 22); ctx.lineTo(tx + 10, ty - 28); ctx.lineTo(tx + 6, ty - 22);
          ctx.fill();
          
          // Eyes (big kawaii)
          ctx.fillStyle = '#4E342E';
          ctx.beginPath();
          ctx.ellipse(tx - 7, ty - 10, 4, 5, 0, 0, Math.PI * 2);
          ctx.ellipse(tx + 7, ty - 10, 4, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          // Eye shine
          ctx.fillStyle = '#FFF';
          ctx.beginPath();
          ctx.arc(tx - 8, ty - 12, 2, 0, Math.PI * 2);
          ctx.arc(tx + 6, ty - 12, 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Blush
          ctx.fillStyle = '#FFAB91';
          ctx.beginPath();
          ctx.ellipse(tx - 14, ty - 2, 5, 3, 0, 0, Math.PI * 2);
          ctx.ellipse(tx + 14, ty - 2, 5, 3, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Nose
          ctx.fillStyle = '#FF8A80';
          ctx.beginPath();
          ctx.arc(tx, ty - 4, 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Mouth (small smile)
          ctx.strokeStyle = '#4E342E';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(tx, ty, 4, 0.2 * Math.PI, 0.8 * Math.PI);
          ctx.stroke();
          
        } else if (tower.type === 1) {
          // 😺 Siamese Sniper - Grey cat with blue eyes
          // Body
          ctx.fillStyle = '#B0BEC5';
          ctx.beginPath();
          ctx.ellipse(tx, ty + 10, 24, 20, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Head
          ctx.beginPath();
          ctx.arc(tx, ty - 8, 20, 0, Math.PI * 2);
          ctx.fill();
          
          // Pointed ears
          ctx.fillStyle = '#B0BEC5';
          ctx.beginPath();
          ctx.moveTo(tx - 14, ty - 20); ctx.lineTo(tx - 8, ty - 34); ctx.lineTo(tx - 2, ty - 22);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(tx + 14, ty - 20); ctx.lineTo(tx + 8, ty - 34); ctx.lineTo(tx + 2, ty - 22);
          ctx.fill();
          
          // Inner ears
          ctx.fillStyle = '#FFE0B2';
          ctx.beginPath();
          ctx.moveTo(tx - 12, ty - 22); ctx.lineTo(tx - 8, ty - 30); ctx.lineTo(tx - 4, ty - 22);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(tx + 12, ty - 22); ctx.lineTo(tx + 8, ty - 30); ctx.lineTo(tx + 4, ty - 22);
          ctx.fill();
          
          // Blue eyes (sniper eyes - serious)
          ctx.fillStyle = '#1E88E5';
          ctx.beginPath();
          ctx.ellipse(tx - 7, ty - 10, 5, 6, 0, 0, Math.PI * 2);
          ctx.ellipse(tx + 7, ty - 10, 5, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Pupil
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.arc(tx - 7, ty - 10, 2, 0, Math.PI * 2);
          ctx.arc(tx + 7, ty - 10, 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Eye shine
          ctx.fillStyle = '#FFF';
          ctx.beginPath();
          ctx.arc(tx - 9, ty - 12, 2, 0, Math.PI * 2);
          ctx.arc(tx + 5, ty - 12, 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Blush
          ctx.fillStyle = '#FFAB91';
          ctx.beginPath();
          ctx.ellipse(tx - 14, ty - 2, 5, 3, 0, 0, Math.PI * 2);
          ctx.ellipse(tx + 14, ty - 2, 5, 3, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Triangle nose
          ctx.fillStyle = '#FF8A80';
          ctx.beginPath();
          ctx.moveTo(tx, ty - 3);
          ctx.lineTo(tx - 3, ty);
          ctx.lineTo(tx + 3, ty);
          ctx.fill();
          
          // Serious mouth
          ctx.strokeStyle = '#4E342E';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(tx - 3, ty + 4);
          ctx.lineTo(tx, ty + 3);
          ctx.lineTo(tx + 3, ty + 4);
          ctx.stroke();
          
        } else {
          // 😻 Orange Bread Fat Cat - Fat orange cat
          // FAT body (really round)
          ctx.fillStyle = '#FF9800';
          ctx.beginPath();
          ctx.ellipse(tx, ty + 12, 28, 24, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Belly (lighter)
          ctx.fillStyle = '#FFB74D';
          ctx.beginPath();
          ctx.ellipse(tx, ty + 14, 18, 14, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Head (also round)
          ctx.beginPath();
          ctx.arc(tx, ty - 6, 22, 0, Math.PI * 2);
          ctx.fill();
          
          // Tiny ears (due to being fat)
          ctx.beginPath();
          ctx.moveTo(tx - 12, ty - 20); ctx.lineTo(tx - 6, ty - 28); ctx.lineTo(tx, ty - 22);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(tx + 12, ty - 20); ctx.lineTo(tx + 6, ty - 28); ctx.lineTo(tx, ty - 22);
          ctx.fill();
          
          // Inner ears (pink)
          ctx.fillStyle = '#FFAB91';
          ctx.beginPath();
          ctx.moveTo(tx - 10, ty - 22); ctx.lineTo(tx - 6, ty - 26); ctx.lineTo(tx - 2, ty - 22);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(tx + 10, ty - 22); ctx.lineTo(tx + 6, ty - 26); ctx.lineTo(tx + 2, ty - 22);
          ctx.fill();
          
          // Happy closed eyes ^_^
          ctx.strokeStyle = '#5D4037';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(tx - 8, ty - 8, 6, Math.PI, 0);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(tx + 8, ty - 8, 6, Math.PI, 0);
          ctx.stroke();
          
          // Big blush
          ctx.fillStyle = '#FFAB91';
          ctx.beginPath();
          ctx.ellipse(tx - 14, ty, 8, 5, 0, 0, Math.PI * 2);
          ctx.ellipse(tx + 14, ty, 8, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Happy nose
          ctx.fillStyle = '#FF8A80';
          ctx.beginPath();
          ctx.arc(tx, ty, 4, 0, Math.PI * 2);
          ctx.fill();
          
          // Happy mouth
          ctx.strokeStyle = '#5D4037';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(tx, ty + 2, 6, 0.2 * Math.PI, 0.8 * Math.PI);
          ctx.stroke();
          
          // Bread in paw
          ctx.fillStyle = '#D7CCC8';
          ctx.beginPath();
          ctx.ellipse(tx + 18, ty + 12, 14, 10, 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#8D6E63';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      for (const enemy of state.enemies) {
        const enemyY = enemy.y + Math.sin(enemy.wobble) * 2;
        
        if (enemy.type === 0) {
          // 🥒 Cucumber - Cute green veggie
          const ex = enemy.x;
          const ey = enemyY;
          
          // Body (cucumber shape)
          ctx.fillStyle = '#8BC34A'; // Light green
          ctx.beginPath();
          ctx.ellipse(ex, ey, 22, 14, 0.2, 0, Math.PI * 2);
          ctx.fill();
          
          // Darker stripes
          ctx.strokeStyle = '#689F38';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(ex - 8, ey, 4, 10, -0.3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(ex + 8, ey, 4, 10, 0.3, 0, Math.PI * 2);
          ctx.stroke();
          
          // Cute face (angry but kawaii)
          // White of eyes
          ctx.fillStyle = '#FFF';
          ctx.beginPath();
          ctx.ellipse(ex - 6, ey - 4, 5, 5, 0, 0, Math.PI * 2);
          ctx.ellipse(ex + 6, ey - 4, 5, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Pupils (angry diagonal)
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.arc(ex - 5, ey - 3, 2, 0, Math.PI * 2);
          ctx.arc(ex + 7, ey - 3, 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Angry eyebrows
          ctx.strokeStyle = '#689F38';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ex - 10, ey - 10);
          ctx.lineTo(ex - 3, ey - 8);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(ex + 10, ey - 10);
          ctx.lineTo(ex + 3, ey - 8);
          ctx.stroke();
          
          // Small mouth
          ctx.beginPath();
          ctx.arc(ex, ey + 4, 3, Math.PI, 0);
          ctx.stroke();
          
          // Health bar
          ctx.fillStyle = '#C8E6C9';
          ctx.fillRect(ex - 18, ey - 24, 36, 5);
          ctx.fillStyle = '#EF5350';
          ctx.fillRect(ex - 18, ey - 24, 36 * (enemy.health / enemy.maxHealth), 5);
          
        } else if (enemy.type === 1) {
          // 🧹 Vacuum - Cute household appliance
          const ex = enemy.x;
          const ey = enemyY;
          
          // Body (round vacuum)
          ctx.fillStyle = '#90A4AE'; // Grey
          ctx.beginPath();
          ctx.arc(ex, ey, 24, 0, Math.PI * 2);
          ctx.fill();
          
          // Inner circle
          ctx.fillStyle = '#78909C';
          ctx.beginPath();
          ctx.arc(ex, ey, 18, 0, Math.PI * 2);
          ctx.fill();
          
          // Handle
          ctx.fillStyle = '#546E7A';
          ctx.beginPath();
          ctx.roundRect(ex - 4, ey - 32, 8, 16, 3);
          ctx.fill();
          
          // Handle top (grip)
          ctx.beginPath();
          ctx.arc(ex, ey - 34, 6, 0, Math.PI * 2);
          ctx.fill();
          
          // LED eyes (cute robot eyes)
          ctx.fillStyle = '#00E676'; // Green LED
          ctx.beginPath();
          ctx.arc(ex - 8, ey - 2, 5, 0, Math.PI * 2);
          ctx.arc(ex + 8, ey - 2, 5, 0, Math.PI * 2);
          ctx.fill();
          
          // LED shine
          ctx.fillStyle = '#B9F6CA';
          ctx.beginPath();
          ctx.arc(ex - 10, ey - 4, 2, 0, Math.PI * 2);
          ctx.arc(ex + 6, ey - 4, 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Robot mouth
          ctx.fillStyle = '#546E7A';
          ctx.beginPath();
          ctx.roundRect(ex - 6, ey + 6, 12, 6, 2);
          ctx.fill();
          
          // Teeth
          ctx.fillStyle = '#FFF';
          ctx.fillRect(ex - 4, ey + 8, 3, 3);
          ctx.fillRect(ex + 1, ey + 8, 3, 3);
          
          // Wheels
          ctx.fillStyle = '#37474F';
          ctx.beginPath();
          ctx.arc(ex - 14, ey + 20, 5, 0, Math.PI * 2);
          ctx.arc(ex + 14, ey + 20, 5, 0, Math.PI * 2);
          ctx.fill();
          
          // Health bar
          ctx.fillStyle = '#C8E6C9';
          ctx.fillRect(ex - 20, ey - 32, 40, 5);
          ctx.fillStyle = '#EF5350';
          ctx.fillRect(ex - 20, ey - 32, 40 * (enemy.health / enemy.maxHealth), 5);
          
        } else if (enemy.type === 2) {
          // 🦟 Mosquito - Fast and annoying
          const ex = enemy.x;
          const ey = enemyY;
          
          // Body (small dark oval)
          ctx.fillStyle = '#37474F';
          ctx.beginPath();
          ctx.ellipse(ex, ey, 12, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Wings (fluttering)
          ctx.fillStyle = 'rgba(200, 200, 200, 0.6)';
          const wingOffset = Math.sin(enemy.wobble * 3) * 5;
          ctx.beginPath();
          ctx.ellipse(ex - 8, ey - 8 + wingOffset, 10, 5, -0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(ex + 8, ey - 8 - wingOffset, 10, 5, 0.5, 0, Math.PI * 2);
          ctx.fill();
          
          // Eyes (big red)
          ctx.fillStyle = '#F44336';
          ctx.beginPath();
          ctx.arc(ex - 5, ey - 2, 4, 0, Math.PI * 2);
          ctx.arc(ex + 5, ey - 2, 4, 0, Math.PI * 2);
          ctx.fill();
          
          // Eye shine
          ctx.fillStyle = '#FFF';
          ctx.beginPath();
          ctx.arc(ex - 6, ey - 3, 1.5, 0, Math.PI * 2);
          ctx.arc(ex + 4, ey - 3, 1.5, 0, Math.PI * 2);
          ctx.fill();
          
          // Proboscis (needle)
          ctx.strokeStyle = '#212121';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ex, ey + 6);
          ctx.lineTo(ex, ey + 14);
          ctx.stroke();
          
          // Legs
          ctx.strokeStyle = '#37474F';
          ctx.lineWidth = 1;
          for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(ex - 6, ey + 4);
            ctx.lineTo(ex - 12, ey + 8 + i * 4);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(ex + 6, ey + 4);
            ctx.lineTo(ex + 12, ey + 8 + i * 4);
            ctx.stroke();
          }
          
          // Health bar
          ctx.fillStyle = '#C8E6C9';
          ctx.fillRect(ex - 12, ey - 16, 24, 4);
          ctx.fillStyle = '#EF5350';
          ctx.fillRect(ex - 12, ey - 16, 24 * (enemy.health / enemy.maxHealth), 4);
          
        } else {
          // 🐀 Rat - Slow but tough
          const ex = enemy.x;
          const ey = enemyY;
          
          // Body (elongated oval)
          ctx.fillStyle = '#8D6E63';
          ctx.beginPath();
          ctx.ellipse(ex, ey, 20, 14, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Belly (lighter)
          ctx.fillStyle = '#A1887F';
          ctx.beginPath();
          ctx.ellipse(ex, ey + 3, 12, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Head
          ctx.fillStyle = '#8D6E63';
          ctx.beginPath();
          ctx.arc(ex - 18, ey - 2, 10, 0, Math.PI * 2);
          ctx.fill();
          
          // Ears (round)
          ctx.fillStyle = '#BCAAA4';
          ctx.beginPath();
          ctx.arc(ex - 22, ey - 10, 5, 0, Math.PI * 2);
          ctx.arc(ex - 14, ey - 10, 5, 0, Math.PI * 2);
          ctx.fill();
          
          // Eyes (small red, sneaky)
          ctx.fillStyle = '#F44336';
          ctx.beginPath();
          ctx.arc(ex - 20, ey - 3, 3, 0, Math.PI * 2);
          ctx.arc(ex - 16, ey - 3, 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Eye shine
          ctx.fillStyle = '#FFF';
          ctx.beginPath();
          ctx.arc(ex - 21, ey - 4, 1, 0, Math.PI * 2);
          ctx.arc(ex - 17, ey - 4, 1, 0, Math.PI * 2);
          ctx.fill();
          
          // Nose
          ctx.fillStyle = '#FFAB91';
          ctx.beginPath();
          ctx.arc(ex - 28, ey, 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Whiskers
          ctx.strokeStyle = '#5D4037';
          ctx.lineWidth = 1;
          for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.moveTo(ex - 26, ey);
            ctx.lineTo(ex - 34, ey - 4 + i * 3);
            ctx.stroke();
          }
          
          // Tail (long and curly)
          ctx.strokeStyle = '#BCAAA4';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(ex + 20, ey);
          ctx.quadraticCurveTo(ex + 30, ey - 5, ex + 35, ey + 5);
          ctx.quadraticCurveTo(ex + 40, ey + 15, ex + 32, ey + 10);
          ctx.stroke();
          
          // Feet
          ctx.fillStyle = '#5D4037';
          ctx.beginPath();
          ctx.ellipse(ex - 8, ey + 12, 4, 3, 0, 0, Math.PI * 2);
          ctx.ellipse(ex + 8, ey + 12, 4, 3, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Health bar
          ctx.fillStyle = '#C8E6C9';
          ctx.fillRect(ex - 16, ey - 22, 32, 5);
          ctx.fillStyle = '#EF5350';
          ctx.fillRect(ex - 16, ey - 22, 32 * (enemy.health / enemy.maxHealth), 5);
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
        if (enemy.pathIndex >= state.path.length) { 
        state.enemies.splice(i, 1); 
        state.enemiesLeaked++; // Track leaked enemies
        setLives(prev => { const newLives = prev - 1; if (newLives <= 0) setGameState('gameover'); return newLives; }); 
      }
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

  const toggleLang = useCallback(() => { setLang(prev => prev === 'zh' ? 'en' : 'zh'); }, []);

  // Calculate enemy speed multiplier for HUD
  // Base: wave bonus + leak bonus + tower bonus
  let enemyTypeBonus = 0;
  if (wave >= 5) enemyTypeBonus = 0.5; // Mosquito from wave 5: +50%
  if (wave >= 10) enemyTypeBonus = 1.0; // Rat from wave 10: +100%
  const enemySpeedMultiplier = 1 + (wave - 1) * 0.1 + gameRef.current.enemiesLeaked * 0.05 + gameRef.current.towers.length * 0.02 + enemyTypeBonus;

  // Get tower count
  const towerCount = gameRef.current.towers.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <h1 style={{ fontFamily: 'Fredoka One, cursive', fontSize: '48px', color: '#FF6B9D', textShadow: '3px 3px 0 #FFF, 5px 5px 0 #FFD5E5', letterSpacing: '4px', animation: 'float 3s ease-in-out infinite' }}>{t.title}</h1>
      <HUD wave={wave} gold={gold} lives={lives} score={score} towerCount={towerCount} enemySpeedMultiplier={enemySpeedMultiplier} lang={lang} onToggleLang={toggleLang} />
      <div style={{ position: 'relative' }}>
        <canvas ref={canvasRef} width={GRID_WIDTH * TILE_SIZE} height={GRID_HEIGHT * TILE_SIZE} onClick={handleCanvasClick} onMouseMove={handleCanvasHover} style={{ border: '6px solid #FFB6C1', borderRadius: '20px', boxShadow: '0 10px 30px rgba(255, 107, 157, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.5)', cursor: 'crosshair', background: '#FFF8E7', display: 'block' }} />
        {gameState === 'start' && <StartOverlay onStart={startGame} lang={lang} />}
        {gameState === 'gameover' && <Overlay title={t.gameOver} score={score} buttonText={t.tryAgain} onButtonClick={startGame} lang={lang} />}
        {gameState === 'victory' && <Overlay title={t.victory} subtitle={t.victorySubtitle} score={score} buttonText={t.playAgain} onButtonClick={startGame} lang={lang} />}
      </div>
      <TowerPanel selectedTowerType={selectedTowerType} gold={gold} onSelectTower={handleSelectTower} lang={lang} />
    </div>
  );
}