//# Controls

const sizeSelector = document.getElementById("boardSize");
const newGameButton = document.getElementById("new");


//### Game Controls
const gameControlModes = {
  game: document.getElementById("gameMode"),
  resign: document.getElementById("resignMode"),
  review: document.getElementById("reviewMode"),
};

// Game Mode
const passButton = document.getElementById("pass");
const resignButton = document.getElementById("resign");

// Resign Mode
const resignCancelButton = document.getElementById("resignCancel");
const resignConfirmButton = document.getElementById("resignConfirm");

// Review Mode
const skipToStartButton = document.getElementById("start");
const prevMoveButton = document.getElementById("prev");
const nextMoveButton = document.getElementById("next");
const skipToEndButton = document.getElementById("end");

// Mode Control
let gameControlMode = null;

function setGameControlMode(mode) {
	if (gameControlMode !== null) {
		gameControlModes[gameControlMode].classList.remove("shown");
	}
	gameControlMode = mode;
	gameControlModes[mode].classList.add("shown");
}

setGameControlMode("game");