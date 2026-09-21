//# Goban

//### Config  *default*
const koRule = simpleKo;         // *simpleKo* | positionalKo | null
const allowSelfCapture = false;  // *false* | true
const komi = 6.5;                // *6.5*

const coordsStyle = japanese;    // *european* | japanese
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

let   passed = false;
let   resignation = false;

let   scoringGrid;
let   deadStones = new Set();
let   score = {};
let   winner = null;
let   scoreInfo = "";

let   move = 0;
let   position = 0;
let   currentPlayer = "black";


//### Gameplay
function placeStone(x, y) {
  if (! isLegal(x, y)) {return;}

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
    move += 1;
    scoreGame();
  }
}

resignButton.onclick = () => {setGameMenu("resign")}
resignCancelButton.onclick = () => {setGameMenu("game")}

resignConfirmButton.onclick = () => {
  resignation = true;
  winner = (currentPlayer === "black")? "white": "black";
  moveHistory.push({
    player:currentPlayer, type:"resign",
  })
  info.innerHTML = `${capitalize(currentPlayer)} resigned`;
  move += 1;
  scoreGame();
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
  resignation = false;

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

function getCoords(x, y) {return coordsStyle(x, y);}


// Coords Styles
function european(x, y) {
  const cols = "ABCDEFGHJKLMNOPQRST";
  const col = cols[x];
  const row = size - y;
  return `${col}${row}`;
}

function japanese(x, y) {
  const kanjiNumbers = [
    "一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
    "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九"
  ];
  const col = x + 1;
  const row = kanjiNumbers[y];
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

