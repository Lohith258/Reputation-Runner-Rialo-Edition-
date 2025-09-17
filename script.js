const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const gameOverEl = document.getElementById("gameOver");
const retryBtn = document.getElementById("retryBtn");

let playerY;
let velocity;
let gravity = -0.5;
let jumpPower = 10;
let score;
let alive;
let obstacleTimeout;
let starTimeout;
let gameSpeed; // speed variable

// Jump control
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && alive) {
    velocity = jumpPower;
  }
});

// Physics / update loop
function updatePlayer() {
  if (!alive) return;

  velocity += gravity;
  playerY += velocity;

  if (playerY < 20) {
    playerY = 20;
    velocity = 0;
  }
  if (playerY > 220) {
    playerY = 220;
    velocity = 0;
  }

  player.style.bottom = playerY + "px";

  requestAnimationFrame(updatePlayer);
}

// Obstacles
function createObstacle() {
  if (!alive) return;
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.style.left = "800px";
  game.appendChild(obstacle);

  let move = setInterval(() => {
    if (!alive) {
      clearInterval(move);
      obstacle.remove();
      return;
    }
    let obstacleLeft = parseInt(obstacle.style.left);
    obstacle.style.left = obstacleLeft - gameSpeed + "px"; // ✅ speed applied

    if (obstacleLeft < 80 && obstacleLeft > 50 && playerY < 50) {
      endGame();
    }

    if (obstacleLeft < -30) {
      clearInterval(move);
      obstacle.remove();
    }
  }, 20);

  // ✅ Faster spawn rate as score increases
  let spawnDelay = Math.max(800, 2000 - score * 20);
  obstacleTimeout = setTimeout(createObstacle, Math.random() * spawnDelay + 800);
}

// Stars
function createStar() {
  if (!alive) return;
  const star = document.createElement("div");
  star.classList.add("star");
  star.style.left = "800px";
  star.style.bottom = Math.random() * 150 + 50 + "px";
  game.appendChild(star);

  let move = setInterval(() => {
    if (!alive) {
      clearInterval(move);
      star.remove();
      return;
    }
    let starLeft = parseInt(star.style.left);
    star.style.left = starLeft - gameSpeed + "px"; // ✅ speed applied

    const starBottom = parseInt(star.style.bottom);
    if (
      starLeft < 80 &&
      starLeft > 50 &&
      playerY + 30 > starBottom &&
      playerY < starBottom + 25
    ) {
      score++;
      scoreEl.innerText = "Score: " + score;

      // ✅ Increase difficulty every 10 points
      if (score % 10 === 0) {
        gameSpeed += 1; // make things faster
      }

      star.remove();
      clearInterval(move);
    }

    if (starLeft < -30) {
      clearInterval(move);
      star.remove();
    }
  }, 20);

  let spawnDelay = Math.max(1200, 3000 - score * 30);
  starTimeout = setTimeout(createStar, Math.random() * spawnDelay + 1000);
}

// End game
function endGame() {
  alive = false;
  gameOverEl.style.display = "block";
  retryBtn.style.display = "inline-block";
  clearTimeout(obstacleTimeout);
  clearTimeout(starTimeout);
}

// Reset + Start
function startGame() {
  alive = true;
  score = 0;
  playerY = 20;        // ✅ set initial Y
  velocity = 0;        // ✅ reset velocity
  gameSpeed = 5;       // ✅ reset speed
  scoreEl.innerText = "Score: 0";
  gameOverEl.style.display = "none";
  retryBtn.style.display = "none";

  document.querySelectorAll(".obstacle, .star").forEach(el => el.remove());

  player.style.bottom = playerY + "px"; // ✅ ensure correct start position

  createObstacle();
  createStar();
  requestAnimationFrame(updatePlayer); // ✅ clean start
}

// Retry button
retryBtn.addEventListener("click", startGame);

// 🚀 Start the first game immediately
startGame();
