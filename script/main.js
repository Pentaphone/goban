//# Goban

//### Config
const koRule = simpleKo;         // simpleKo | positionalKo | null
const allowSelfCapture = false;  // false | true

const theme = "kyoto";


//### Constants, Variables
const info = document.getElementById("info");
info.innerHTML = "";

const board = document.getElementById("board");

const capturesDisplay = document.getElementById("captures")

let   size = Number(sizeSelector.value);
let   center;
let   grid = newGrid();

let   positionHistory = [copyGrid(grid)];
let   blackStonesCaptured = 0;
let   whiteStonesCaptured = 0;

let   gameOver = false;

let   currentPlayer = "black";


//### Gameplay
function placeStone(x, y) {
  if (! isLegal(x, y)) {return}

  removeLastMove();

  grid[y][x] = currentPlayer;
  capture(x, y);
  selfCapture(x, y);
  positionHistory.push(copyGrid(grid));

  drawStones();
  markLastMove(x, y)
  hidePreview();

  passed = false;
  info.innerHTML = "";

  nextPlayer()
}

function nextPlayer() {
  currentPlayer = (currentPlayer === "black")? "white": "black";
  setGameControlMode("game");
}


//### Pass, Resign
let passed = false;

passButton.onclick = () => {
  if (!passed) {
    passed = true;
    info.innerHTML = `${capitalize(currentPlayer)} passed`;
    nextPlayer();
  }
  else {
    info.innerHTML =
      `${capitalize(currentPlayer)} passed. Game over`;
    endGame()
  }
}

resignButton.onclick = () => {setGameControlMode("resign")}
resignCancelButton.onclick = () => {setGameControlMode("game")}

resignConfirmButton.onclick = () => {
  info.innerHTML = `${capitalize(currentPlayer)} resigned`
  endGame()
}

function endGame() {
  gameOver = true;
  setGameControlMode("review")
}


//### New Game
function newGame() {
  size = Number(sizeSelector.value);
  grid = newGrid();
  drawBoard();

  info.innerHTML = "";
  captures.innerHTML = "";
  setGameControlMode("game");

  gameOver = false;
  positionHistory = [copyGrid(grid)];
  blackStonesCaptured = 0;
  whiteStonesCaptured = 0;
  passed = false;

  currentPlayer = "black";
}

newGameButton.onclick = newGame;


//### Theme
function setTheme(theme) {
  for (const sheet of document.querySelectorAll("link[data-theme]")) {
    sheet.disabled = sheet.dataset.theme !== theme;
  }
}
setTheme(theme);

drawBoard();