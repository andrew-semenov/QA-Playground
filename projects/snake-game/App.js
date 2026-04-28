const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop;
let isPaused = false;

// BUG: Snake can reverse into itself
function draw() {
  ctx.fillStyle = '#021a02';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

  // Draw snake
  ctx.fillStyle = '#4ade80';
  snake.forEach((segment, index) => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  });
}

function update() {
  if (isPaused) return;

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // BUG: No wall collision - snake can go through walls
  if (head.x < 0) head.x = tileCount - 1;
  if (head.x >= tileCount) head.x = 0;
  if (head.y < 0) head.y = tileCount - 1;
  if (head.y >= tileCount) head.y = 0;

  // BUG: No self-collision check when moving
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
  // BUG: Food can spawn on snake body
}

function gameStep() {
  update();
  draw();
}

document.addEventListener('keydown', (e) => {
  // BUG: Can reverse direction instantly (no check for opposite direction)
  switch(e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      dx = 0; dy = -1; break;
    case 'ArrowDown':
    case 's':
    case 'S':
      dx = 0; dy = 1; break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      dx = -1; dy = 0; break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      dx = 1; dy = 0; break;
    case ' ':
      isPaused = !isPaused; break;
  }
});

// Start game
placeFood();
gameLoop = setInterval(gameStep, 100);
draw();