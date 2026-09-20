//# Goban

//### Config
const koRule = positionalKo;         // simpleKo | positionalKo | null
const allowSelfCapture = false;  // false | true

const theme = "kyoto";


//### Constants, Variables
const info = document.getElementById("info");

const board = document.getElementById("board");

const blackStonesCaptDisplay = document.getElementById("blackStones")
const whiteStonesCaptDisplay = document.getElementById("whiteStones")
const coordsDisplay = document.getElementById("coords")

let   programMode = "play";

let   size = Number(sizeSelector.value);
let   center;
let   grid = newGrid();

let   moveHistory = [];
let   positionHistory = [copyGrid(grid)];
let   blackStonesCaptured = 0;
let   whiteStonesCaptured = 0;
let   captureHistory = [{black: 0, white: 0}];

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

  moveHistory.push({
    player:currentPlayer, type:"play", place:[x, y],
  })
  positionHistory.push(copyGrid(grid));

  move += 1;
  passed = false;
  info.innerHTML = "";

  nextPlayer()
}

function nextPlayer() {
  currentPlayer = (currentPlayer === "black")? "white": "black";
  setGameMenu("game");
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

resignButton.onclick = () => {setGameMenu("resign")}
resignCancelButton.onclick = () => {setGameMenu("game")}

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
  blackStonesCaptDisplay.innerHTML = "";
  whiteStonesCaptDisplay.innerHTML = "";
  setGameMenu("game");

  programMode = "play";
  move = 0;
  moveHistory = [{type:"start"}];
  positionHistory = [copyGrid(grid)];
  captureHistory = [{black: 0, white: 0}];
  blackStonesCaptured = 0;
  whiteStonesCaptured = 0;
  passed = false;

  currentPlayer = "black";
}

newGameButton.onclick = newGame;


//### Display
info.innerHTML = "";

blackStonesCaptDisplay.innerHTML = "";
whiteStonesCaptDisplay.innerHTML = "";

function printCaptures(captures) {
  blackStonesCaptDisplay.innerHTML = `○ captured: ${captures.black}`;
  whiteStonesCaptDisplay.innerHTML = `● captured: ${captures.white}`;
}

function getCoords(x, y) {
  const cols = "ABCDEFGHJKLMNOPQRST";
  const col = cols[x];
  const row = size - y;
  return `${col}${row}`;
}


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