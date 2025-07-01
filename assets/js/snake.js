// 极简风格贪吃蛇游戏
const canvas = document.getElementById('snake-game');
if (!canvas) return; // 若找不到canvas则不执行
const ctx = canvas.getContext('2d');
const grid = 20;
let snake, direction, food, gameLoop, alive, score;

function resetGame() {
  snake = [{x: 8, y: 10}];
  direction = {x: 1, y: 0};
  food = randomFood();
  alive = true;
  score = 0;
  updateScore();
  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(loop, 100);
}

function randomFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * (canvas.width / grid)),
      y: Math.floor(Math.random() * (canvas.height / grid))
    };
  } while (snake && snake.some(seg => seg.x === pos.x && seg.y === pos.y));
  return pos;
}

function loop() {
  if (!alive) return;
  // 移动蛇
  const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
  // 撞墙或撞自己
  if (
    head.x < 0 || head.x >= canvas.width / grid ||
    head.y < 0 || head.y >= canvas.height / grid ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    alive = false;
    setTimeout(resetGame, 1000);
    return;
  }
  snake.unshift(head);
  // 吃到食物
  if (head.x === food.x && head.y === food.y) {
    food = randomFood();
    score++;
    updateScore();
  } else {
    snake.pop();
  }
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 画边界
  ctx.save();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  // 画蛇
  ctx.fillStyle = '#4A90E2';
  snake.forEach((seg, i) => {
    ctx.fillRect(seg.x * grid, seg.y * grid, grid - 2, grid - 2);
  });
  // 画食物
  ctx.fillStyle = '#FFA94D';
  ctx.fillRect(food.x * grid, food.y * grid, grid - 2, grid - 2);
}

function updateScore() {
  let scoreDiv = document.getElementById('snake-score');
  if (!scoreDiv) {
    scoreDiv = document.createElement('div');
    scoreDiv.id = 'snake-score';
    scoreDiv.style.textAlign = 'center';
    scoreDiv.style.fontSize = '20px';
    scoreDiv.style.fontWeight = 'bold';
    scoreDiv.style.color = '#4A90E2';
    scoreDiv.style.margin = '10px auto 0 auto';
    scoreDiv.style.letterSpacing = '2px';
    canvas.parentNode.insertBefore(scoreDiv, canvas);
  }
  scoreDiv.textContent = `分数：${score}`;
}

window.addEventListener('keydown', e => {
  if (!alive) return;
  const key = e.key || e.code;
  if ((key === 'ArrowUp' || key === 'Up') && direction.y !== 1) direction = {x: 0, y: -1};
  else if ((key === 'ArrowDown' || key === 'Down') && direction.y !== -1) direction = {x: 0, y: 1};
  else if ((key === 'ArrowLeft' || key === 'Left') && direction.x !== 1) direction = {x: -1, y: 0};
  else if ((key === 'ArrowRight' || key === 'Right') && direction.x !== -1) direction = {x: 1, y: 0};
});

resetGame(); 