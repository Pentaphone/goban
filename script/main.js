//# Goban

//### Config                     *default*
const koRule = simpleKo;         // *simpleKo* | positionalKo | null
const allowSelfCapture = false;  // *false* | true
const komi = 6.5;                // *6.5*

const coordsStyle = european;    // *european* | japanese
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
  currentPlayer = opponent();
  setGameMenu("game");
}

function opponent() {
  return (currentPlayer === "black")? "white": "black";
}

function undoStone() {
  if (positionHistory.length <= 1) {return;}

  moveHistory.pop();
  positionHistory.pop();
  captureHistory.pop();

  grid = copyGrid(positionHistory.at(-1));
  const captures = captureHistory.at(-1);

  blackStonesCaptured = captures.black;
  whiteStonesCaptured = captures.white;
  updateCapturesDisplay();

  drawStones();
  hidePreview();

  move -= 1;
  passed = false;
  currentPlayer = opponent();

  info.innerHTML = "";

  const prevMove = moveHistory[moveHistory.length - 1];

  if (prevMove?.type === "play") {
    const [x, y] = prevMove.place;
    markLastMove(x, y);
  }
  else if (prevMove?.type === "pass") {
    print(`${capitalize(prevMove.player)} passed`)
  }
}


//### Pass, Resign
function pass() {
  moveHistory.push({
    player:currentPlayer, type:"pass",
  })
  if (!passed) {
    passed = true;
    print(`${capitalize(currentPlayer)} passed`);
    move += 1;
    nextPlayer();
  }
  else {
    print(`${capitalize(currentPlayer)} passed. Game over`);
    move += 1;
    scoreGame();
  }
}

function undoPass() {
  if (moveHistory.length === 0) {return;}
  const lastMove = moveHistory.at(-1);
  if (lastMove.type !== "pass") {return;}

  moveHistory.pop();
  move -= 1;
  currentPlayer = lastMove.player;

  const prevMove = moveHistory.at(-1);
  passed = prevMove?.type === "pass";

  if (programMode === "score") {
    console.log("Game continues")
    continueGame();
  }
  info.innerHTML = "";
}

passButton.onclick = pass;

function resign() {
  if (moveHistory.length === 0) {return;}

  resignation = true;
  winner = opponent();
  moveHistory.push({
    player:currentPlayer, type:"resign",
  })
  print(`${capitalize(currentPlayer)} resigned`);
  move += 1;
  scoreGame();
}

function undoResign() {
  if (moveHistory.length === 0) {return;}
  const lastMove = moveHistory.at(-1);
  if (lastMove.type !== "resign") {return;}

  moveHistory.pop();
  move -= 1;
  currentPlayer = lastMove.player;

  resignation = false;
  winner = null;

  if (programMode === "score") {
    console.log("Game continues")
    continueGame();
  }
}

resignButton.onclick = () => {setGameMenu("resign")}
resignCancelButton.onclick = () => {setGameMenu("game")}
resignConfirmButton.onclick = resign;


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

function print(text) {
  info.innerHTML = text;
  console.log(text);
}

function updateCapturesDisplay() {
  printCaptures({
    black: blackStonesCaptured,
    white: whiteStonesCaptured
  });
}

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

