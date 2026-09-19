//# Goban

//### Config
const koRule = positionalKo;         // simpleKo | positionalKo | null
const allowSelfCapture = false;  // false | true

const theme = "kyiv";


//### Constants, Variables
const info = document.getElementById("info");
info.innerHTML = "";

const board = document.getElementById("board");

const capturesDisplay = document.getElementById("captures")

let   programMode = "play";

let   size = Number(sizeSelector.value);
let   center;
let   grid = newGrid();

let   moveHistory = [];
let   positionHistory = [copyGrid(grid)];
let   blackStonesCaptured = 0;
let   whiteStonesCaptured = 0;

let   move = 0;
let   position = 0;
let   currentPlayer = "black";


//### Gameplay
function placeStone(x, y) {
  if (! isLegal(x, y)) {remove}

  grid[y][x] = currentPlayer;
  capture(x, y);
  if (allowSelfCapture) {selfCapture(x, y)};

  drawStones();
  markLastMove(x, y)
  hidePreview();

  positionHistory.push(copyGrid(grid));
  moveHistory.push({
    player:currentPlayer, type:"play", place:[x, y],
  })

  move += 1;
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
  moveHistory.push({
    player:currentPlayer, type:"pass",
  })
  if (!passed) {
    passed = true;
    info.innerHTML = `${capitalize(currentPlayer)} passed`;
    move += 1;
    nextPlayer();
  }
  else {
    info.innerHTML =
      `${capitalize(currentPlayer)} passed. Game over`;
    review()
  }
}

resignButton.onclick = () => {setGameControlMode("resign")}
resignCancelButton.onclick = () => {setGameControlMode("game")}

resignConfirmButton.onclick = () => {
  moveHistory.push({
    player:currentPlayer, type:"resign",
  })
  info.innerHTML = `${capitalize(currentPlayer)} resigned`
  review();
}


//### New Game
function newGame() {
  size = Number(sizeSelector.value);
  grid = newGrid();
  drawBoard();

  info.innerHTML = "";
  captures.innerHTML = "";
  setGameControlMode("game");

  programMode = "play";
  move = 0;
  moveHistory = [{type:"start"}];
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
    if (sheet.dataset.theme === "chang-an") {sheet.disabled = false}
  }
}
setTheme(theme);

moveHistory.push({type:"start"});
drawBoard();