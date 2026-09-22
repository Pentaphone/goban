//# Controls

const sizeSelector = document.getElementById("boardSize");
const newGameButton = document.getElementById("new");


//### Game Controls
const gameMenuModes = {
  game: document.getElementById("gameMode"),
  resign: document.getElementById("resignMode"),
  score: document.getElementById("scoreMode"),
  review: document.getElementById("reviewMode"),
};

// Game Mode
const passButton = document.getElementById("pass");
const resignButton = document.getElementById("resign");

// Resign Mode
const resignCancelButton = document.getElementById("resignCancel");
const resignConfirmButton = document.getElementById("resignConfirm");

// Score Mode
const continueGameButton = document.getElementById("continueGame");
const scoreConfirmButton = document.getElementById("scoreConfirm");

// Review Mode
const skipToStartButton = document.getElementById("start");
const prevMoveButton = document.getElementById("prev");
const nextMoveButton = document.getElementById("next");
const skipToEndButton = document.getElementById("end");

// Mode Control
let gameMenu = null;

function setGameMenu(mode) {
	if (gameMenu !== null) {
		gameMenuModes[gameMenu].classList.remove("shown");
	}
	gameMenu = mode;
	gameMenuModes[mode].classList.add("shown");
}

setGameMenu("game");