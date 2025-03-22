let WIDTH = 50; // Default to Adventurer
let HEIGHT = 30;
let maze = [];
let playerPosition = { x: 1, y: 1 };
let goalPosition = { x: 48, y: 28 };
let lastMoveTime = 0;
const MOVE_DELAY = 50;
let timerInterval = null;
let timeElapsed = 0;
let hasMoved = false;
let cells = [];

const levels = {
  newbie: { width: 26, height: 16, goal: { x: 24, y: 14 }, baseCellSize: 34 },
  adventurer: {
    width: 50,
    height: 30,
    goal: { x: 48, y: 28 },
    baseCellSize: 18,
  },
  veteran: { width: 100, height: 60, goal: { x: 98, y: 58 }, baseCellSize: 10 },
  legend: { width: 150, height: 90, goal: { x: 148, y: 88 }, baseCellSize: 6 },
};

function initializeMaze() {
  maze = Array(HEIGHT)
    .fill()
    .map(() => Array(WIDTH).fill(1));
}

function generateMaze() {
  initializeMaze();
  const stack = [];
  const start = { x: 1, y: 1 };
  maze[start.y][start.x] = 0;

  stack.push(start);

  const directions = [
    { dx: 0, dy: -2 },
    { dx: 0, dy: 2 },
    { dx: -2, dy: 0 },
    { dx: 2, dy: 0 },
  ];

  while (stack.length > 0) {
    const current = stack.pop();
    const neighbors = [];

    for (const dir of directions) {
      const newX = current.x + dir.dx;
      const newY = current.y + dir.dy;

      if (
        newX > 0 &&
        newX < WIDTH - 1 &&
        newY > 0 &&
        newY < HEIGHT - 1 &&
        maze[newY][newX] === 1
      ) {
        neighbors.push({ x: newX, y: newY });
      }
    }

    if (neighbors.length > 0) {
      stack.push(current);
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      const wallX = (current.x + next.x) / 2;
      const wallY = (current.y + next.y) / 2;
      maze[next.y][next.x] = 0;
      maze[wallY][wallX] = 0;
      stack.push(next);
    }
  }

  connectGoalToMaze();
  maze[goalPosition.y][goalPosition.x] = 2;
}

function connectGoalToMaze() {
  let x = goalPosition.x;
  let y = goalPosition.y;
  maze[y][x] = 0;

  const directions = [
    { dx: -1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
  ];

  for (let i = directions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [directions[i], directions[j]] = [directions[j], directions[i]];
  }

  let connected = false;
  for (const dir of directions) {
    let steps = 0;
    let tempX = x;
    let tempY = y;

    while (
      tempX > 1 &&
      tempX < WIDTH - 1 &&
      tempY > 1 &&
      tempY < HEIGHT - 1 &&
      steps < 5
    ) {
      tempX += dir.dx;
      tempY += dir.dy;
      if (maze[tempY][tempX] === 0) {
        while (tempX !== x || tempY !== y) {
          maze[tempY][tempX] = 0;
          tempX -= dir.dx;
          tempY -= dir.dy;
        }
        connected = true;
        break;
      }
      steps++;
    }
    if (connected) break;
  }

  if (!connected) {
    maze[y - 1][x] = 0;
    maze[y - 1][x - 1] = 0;
    maze[y][x - 1] = 0;
  }

  for (let i = 0; i < 10; i++) {
    const randX = goalPosition.x - Math.floor(Math.random() * 3) - 1;
    const randY = goalPosition.y - Math.floor(Math.random() * 3) - 1;
    if (randX > 1 && randX < WIDTH - 1 && randY > 1 && randY < HEIGHT - 1) {
      maze[randY][randX] = 0;
    }
  }
}

function createMaze() {
  const mazeDiv = document.getElementById("maze");
  mazeDiv.innerHTML = "";
  const level = levels[document.getElementById("level-select").value];
  const isMobile = window.innerWidth < 600;
  const screenWidth = isMobile
    ? window.innerWidth - 20
    : window.innerWidth - 40;
  const screenHeight = isMobile
    ? window.innerHeight - 280
    : window.innerHeight - 250;
  const totalGaps = (level.width - 1) * 1;
  const totalBorders = 4;
  const availableWidth = screenWidth - totalGaps - totalBorders;
  const cellSize = Math.min(
    Math.floor(availableWidth / level.width),
    Math.floor(screenHeight / level.height),
    level.baseCellSize
  );
  mazeDiv.style.gridTemplateColumns = `repeat(${WIDTH}, ${cellSize}px)`;
  cells = [];

  const totalMazeWidth = cellSize * level.width + totalGaps + totalBorders;
  console.log(
    `Level: ${
      document.getElementById("level-select").value
    }, Cell Size: ${cellSize}px, Total Width: ${totalMazeWidth}px, Viewport Width: ${
      window.innerWidth
    }px`
  );

  for (let y = 0; y < HEIGHT; y++) {
    cells[y] = [];
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;
      if (maze[y][x] === 0) cell.classList.add("path");
      if (y === playerPosition.y && x === playerPosition.x)
        cell.classList.add("player");
      if (maze[y][x] === 2) cell.classList.add("goal");
      mazeDiv.appendChild(cell);
      cells[y][x] = cell;
    }
  }
  document.getElementById("timer").textContent = `Time: ${timeElapsed}s`;
}

function updateMaze(oldX, oldY, newX, newY) {
  const oldCell = cells[oldY][oldX];
  oldCell.classList.remove("player");
  if (maze[oldY][oldX] === 0) {
    oldCell.classList.add("path");
  } else if (maze[oldY][oldX] === 2) {
    oldCell.classList.add("goal");
  } else {
    oldCell.classList.remove("path", "goal");
  }

  const newCell = cells[newY][newX];
  newCell.classList.remove("path", "goal");
  newCell.classList.add("player");

  document.getElementById("timer").textContent = `Time: ${timeElapsed}s`;
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    timeElapsed++;
    document.getElementById("timer").textContent = `Time: ${timeElapsed}s`;
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetTimer() {
  stopTimer();
  timeElapsed = 0;
  hasMoved = false;
  document.getElementById("timer").textContent = `Time: 0s`;
}

function movePlayer(direction) {
  const now = Date.now();
  if (now - lastMoveTime < MOVE_DELAY) return;
  lastMoveTime = now;

  let newX = playerPosition.x;
  let newY = playerPosition.y;

  switch (direction) {
    case "ArrowUp":
      newY--;
      break;
    case "ArrowDown":
      newY++;
      break;
    case "ArrowLeft":
      newX--;
      break;
    case "ArrowRight":
      newX++;
      break;
  }

  if (
    newY >= 0 &&
    newY < HEIGHT &&
    newX >= 0 &&
    newX < WIDTH &&
    maze[newY][newX] !== 1
  ) {
    if (!hasMoved) {
      hasMoved = true;
      startTimer();
    }
    const oldX = playerPosition.x;
    const oldY = playerPosition.y;
    playerPosition = { x: newX, y: newY };
    updateMaze(oldX, oldY, newX, newY);
    if (newX === goalPosition.x && newY === goalPosition.y) {
      stopTimer();
      const levelName = document
        .getElementById("level-select")
        .options[
          document.getElementById("level-select").selectedIndex
        ].text.split(" (")[0];
      showCompletionPopup(`Completed ${levelName} in ${timeElapsed} seconds!`);
      shuffleMaze();
    }
  }
}

function shuffleMaze() {
  generateMaze();
  playerPosition = { x: 1, y: 1 };
  resetTimer();
  createMaze();
}

function resetPlayer() {
  playerPosition = { x: 1, y: 1 };
  resetTimer();
  createMaze();
}

function changeLevel() {
  const level = document.getElementById("level-select").value;
  const isMobile =
    /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 600;
  if ((level === "veteran" || level === "legend") && isMobile) {
    document.getElementById("mobile-warning").style.display = "block";
    document.getElementById("level-select").value = "adventurer";
    return;
  }
  WIDTH = levels[level].width;
  HEIGHT = levels[level].height;
  goalPosition = levels[level].goal;
  shuffleMaze();
  document.getElementById("level-select").blur();
}

function closePopup() {
  document.getElementById("mobile-warning").style.display = "none";
}

function showCompletionPopup(message) {
  document.getElementById("completion-message").textContent = message;
  document.getElementById("completion-popup").style.display = "block";
}

function closeCompletionPopup() {
  document.getElementById("completion-popup").style.display = "none";
}

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) movePlayer("ArrowRight");
    else if (dx < -30) movePlayer("ArrowLeft");
  } else {
    if (dy > 30) movePlayer("ArrowDown");
    else if (dy < -30) movePlayer("ArrowUp");
  }
});

changeLevel();
window.onload = createMaze;
document.addEventListener("keydown", (event) => {
  event.preventDefault();
  movePlayer(event.key);
});
