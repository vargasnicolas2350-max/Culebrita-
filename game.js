const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");

const grid = 20;
let count = 0;
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreElement.innerText = highScore;

let snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};

let apple = { x: 320, y: 320 };

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function resetGame() {
  snake.x = 160;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = grid;
  snake.dy = 0;
  score = 0;
  scoreElement.innerText = score;
  apple.x = getRandomInt(0, 20) * grid;
  apple.y = getRandomInt(0, 20) * grid;
}

// Bucle principal del juego
function loop() {
  requestAnimationFrame(loop);

  if (++count < 6) return;
  count = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  // Envolver serpiente en bordes
  if (snake.x < 0) snake.x = canvas.width - grid;
  else if (snake.x >= canvas.width) snake.x = 0;

  if (snake.y < 0) snake.y = canvas.height - grid;
  else if (snake.y >= canvas.height) snake.y = 0;

  snake.cells.unshift({ x: snake.x, y: snake.y });

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // Dibujar manzana
  ctx.fillStyle = "#f85149";
  ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  // Dibujar culebrita
  ctx.fillStyle = "#2ea043";
  snake.cells.forEach((cell, index) => {
    ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    // Comer la manzana
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score += 10;
      scoreElement.innerText = score;

      if (score > highScore) {
        highScore = score;
        highScoreElement.innerText = highScore;
        localStorage.setItem("snakeHighScore", highScore);
      }

      apple.x = getRandomInt(0, 20) * grid;
      apple.y = getRandomInt(0, 20) * grid;
    }

    // Colisión consigo misma
    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        resetGame();
      }
    }
  });
}

// Lógica de cambio de dirección
function moveUp() {
  if (snake.dy === 0) { snake.dy = -grid; snake.dx = 0; }
}
function moveDown() {
  if (snake.dy === 0) { snake.dy = grid; snake.dx = 0; }
}
function moveLeft() {
  if (snake.dx === 0) { snake.dx = -grid; snake.dy = 0; }
}
function moveRight() {
  if (snake.dx === 0) { snake.dx = grid; snake.dy = 0; }
}

// 1. Controles por teclado
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") moveLeft();
  else if (e.key === "ArrowUp" || e.key === "w") moveUp();
  else if (e.key === "ArrowRight" || e.key === "d") moveRight();
  else if (e.key === "ArrowDown" || e.key === "s") moveDown();
});

// 2. Controles por Botones Táctiles en pantalla
document.getElementById("btn-up").addEventListener("click", moveUp);
document.getElementById("btn-down").addEventListener("click", moveDown);
document.getElementById("btn-left").addEventListener("click", moveLeft);
document.getElementById("btn-right").addEventListener("click", moveRight);

// 3. Controles por Gestos (Swipe) en la pantalla táctil
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, false);

canvas.addEventListener("touchend", (e) => {
  let touchEndX = e.changedTouches[0].clientX;
  let touchEndY = e.changedTouches[0].clientY;

  let diffX = touchEndX - touchStartX;
  let diffY = touchEndY - touchStartY;

  // Detectar la dirección con mayor desplazamiento
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 20) moveRight();
    else if (diffX < -20) moveLeft();
  } else {
    if (diffY > 20) moveDown();
    else if (diffY < -20) moveUp();
  }
}, false);

requestAnimationFrame(loop);
