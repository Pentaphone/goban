//# Go

//### Constants, Variables
const info = document.getElementById("info");
info.innerHTML = "";

const board = document.getElementById("board");

let   size = Number(sizeSelector.value);
let   center;
let   grid = newGrid();

let   lastMove = null;
let   currentPlayer = "black";
let   gameOver = false;


//### Gameplay
function placeStone(x, y) {
  if (gameOver) {return}
  if (grid[y][x] !== null) {return}

  removeLastMove();

  grid[y][x] = currentPlayer;
  capture(x, y);

  drawStones();
  markLastMove(x, y)
  hidePreview();

  lastMove = {x, y};
  passed = false;
  info.innerHTML = "";

  nextPlayer()
}

function nextPlayer() {
  currentPlayer = (currentPlayer === "black")? "white": "black";
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
newGameButton.onclick = () => {
  size = Number(sizeSelector.value);
  grid = newGrid();
  info.innerHTML = "";
  setGameControlMode("game");
  drawBoard();

  gameOver = false;
  passed = false;
  currentPlayer = "black";
};

drawBoard();