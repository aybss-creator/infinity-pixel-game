const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const messageEl = document.getElementById('message');
const jumpButton = document.getElementById('jumpButton');

const groundY = canvas.height - 94;
const gravity = 0.72;
const jumpForce = -13.5;
const baseSpeed = 5;

let lastTime = 0;
let gameState = 'ready';
let score = 0;
let bestScore = Number(localStorage.getItem('pixel-infinity-best')) || 0;
let worldSpeed = baseSpeed;
let spawnTimer = 0;
let cloudTimer = 0;
let particles = [];

const player = {
  x: 110,
  y: groundY - 34,
  w: 32,
  h: 34,
  vy: 0,
  grounded: true,
};

const obstacles = [];
const clouds = [];

function resetGame() {
  worldSpeed = baseSpeed;
  score = 0;
  spawnTimer = 0;
  cloudTimer = 0;
  particles = [];
  obstacles.length = 0;
  clouds.length = 0;
  player.y = groundY - player.h;
  player.vy = 0;
  player.grounded = true;
  scoreEl.textContent = '0';
  messageEl.classList.add('visible');
  messageEl.innerHTML = 'Tap or press <strong>Space</strong> to jump<br />Press <strong>Enter</strong> to restart';
}

function startGame() {
  if (gameState === 'dead') {
    resetGame();
  }
  gameState = 'playing';
  messageEl.classList.remove('visible');
}

function jump() {
  if (gameState === 'ready') {
    startGame();
  }

  if (player.grounded) {
    player.vy = jumpForce;
    player.grounded = false;
  }
}

function handleJumpInput(event) {
  if (event) {
    event.preventDefault();
  }
  jump();
}

function createCloud() {
  clouds.push({
    x: canvas.width + 20,
    y: 40 + Math.random() * 130,
    w: 40 + Math.random() * 60,
    h: 18 + Math.random() * 18,
    speed: 0.3 + Math.random() * 0.7,
  });
}

function createObstacle() {
  const typeRoll = Math.random();
  const height = typeRoll > 0.7 ? 34 + Math.random() * 28 : 22 + Math.random() * 50;
  obstacles.push({
    x: canvas.width + 40,
    y: groundY - height,
    w: 22 + Math.random() * 18,
    h: height,
    color: typeRoll > 0.85 ? '#ff6f91' : '#74f7d5',
  });
}

function addParticles(x, y, color) {
  for (let i = 0; i < 8; i += 1) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      life: 30 + Math.random() * 18,
      color,
      size: 3 + Math.random() * 4,
    });
  }
}

function collision(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function update(dt) {
  if (gameState !== 'playing') return;

  worldSpeed += 0.0025;
  score += dt * 0.05;
  scoreEl.textContent = Math.floor(score);

  const floor = groundY;
  player.vy += gravity;
  player.y += player.vy;

  if (player.y + player.h >= floor) {
    player.y = floor - player.h;
    player.vy = 0;
    player.grounded = true;
  }

  spawnTimer += dt;
  cloudTimer += dt;

  if (cloudTimer > 1300) {
    createCloud();
    cloudTimer = 0;
  }

  if (spawnTimer > Math.max(700, 1200 - Math.floor(score / 12) * 30)) {
    createObstacle();
    spawnTimer = 0;
  }

  for (let i = clouds.length - 1; i >= 0; i -= 1) {
    const cloud = clouds[i];
    cloud.x -= cloud.speed * dt * 0.06;
    if (cloud.x + cloud.w < 0) clouds.splice(i, 1);
  }

  for (let i = obstacles.length - 1; i >= 0; i -= 1) {
    const obstacle = obstacles[i];
    obstacle.x -= worldSpeed * dt * 0.06;

    if (collision(player, obstacle)) {
      gameState = 'dead';
      bestScore = Math.max(bestScore, Math.floor(score));
      localStorage.setItem('pixel-infinity-best', String(bestScore));
      bestEl.textContent = String(bestScore);
      messageEl.innerHTML = `Game over!<br />Score: <strong>${Math.floor(score)}</strong><br />Press <strong>Enter</strong> to play again`;
      messageEl.classList.add('visible');
      addParticles(player.x + player.w / 2, player.y + player.h / 2, '#ff6f91');
      return;
    }

    if (obstacle.x + obstacle.w < 0) {
      obstacles.splice(i, 1);
    }
  }

  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawPixelRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, '#234d7f');
  sky.addColorStop(0.45, '#1a365d');
  sky.addColorStop(1, '#0d1d2f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 7; i += 1) {
    const x = (i * 170 + (score * 2) % 180) % (canvas.width + 120) - 60;
    const y = 60 + (i % 3) * 36;
    drawPixelRect(x, y, 36, 14, 'rgba(255,255,255,0.15)');
    drawPixelRect(x + 12, y - 10, 22, 10, 'rgba(255,255,255,0.12)');
  }

  for (const cloud of clouds) {
    drawPixelRect(cloud.x, cloud.y, cloud.w, 14, 'rgba(255,255,255,0.15)');
    drawPixelRect(cloud.x + 14, cloud.y - 10, cloud.w - 20, 8, 'rgba(255,255,255,0.12)');
  }
}

function drawGround() {
  ctx.fillStyle = '#1b5e3d';
  ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

  ctx.fillStyle = '#2c8b57';
  for (let x = -((score * 2) % 32); x < canvas.width + 32; x += 32) {
    ctx.fillRect(x, groundY, 16, 18);
    ctx.fillRect(x + 16, groundY + 16, 14, 14);
  }

  ctx.fillStyle = '#183f2c';
  ctx.fillRect(0, groundY + 40, canvas.width, 16);
}

function drawPlayer() {
  const px = player.x;
  const py = player.y;

  drawPixelRect(px, py + 8, player.w, player.h - 8, '#ffbf69');
  drawPixelRect(px + 8, py, 12, 10, '#ffcf7d');
  drawPixelRect(px + 4, py + 12, 6, 14, '#282f3c');
  drawPixelRect(px + 18, py + 12, 6, 14, '#282f3c');
  drawPixelRect(px + 9, py + 20, 5, 8, '#0d141b');
  drawPixelRect(px + 18, py + 20, 5, 8, '#0d141b');
  drawPixelRect(px + 4, py + 28, 8, 6, '#ff7a59');
  drawPixelRect(px + 18, py + 28, 8, 6, '#ff7a59');
}

function drawObstacle(obstacle) {
  drawPixelRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h, obstacle.color);
  drawPixelRect(obstacle.x + 4, obstacle.y + 4, obstacle.w - 8, obstacle.h - 8, 'rgba(0,0,0,0.18)');
}

function drawParticles() {
  for (const p of particles) {
    drawPixelRect(p.x, p.y, p.size, p.size, p.color);
  }
}

function draw() {
  drawBackground();
  drawGround();

  for (const obstacle of obstacles) {
    drawObstacle(obstacle);
  }

  drawPlayer();
  drawParticles();

  if (gameState === 'ready') {
    messageEl.classList.add('visible');
  }
}

function loop(timestamp) {
  const dt = Math.min(32, timestamp - lastTime || 16);
  lastTime = timestamp;

  update(dt);
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'KeyW') {
    event.preventDefault();
    if (gameState === 'ready') startGame();
    jump();
  }

  if (event.code === 'Enter' && gameState === 'dead') {
    resetGame();
    startGame();
  }
});

canvas.addEventListener('pointerdown', (event) => {
  if (event.target === jumpButton) return;
  handleJumpInput(event);
});

jumpButton.addEventListener('pointerdown', handleJumpInput);

bestEl.textContent = String(bestScore);
resetGame();
requestAnimationFrame(loop);
