//# Controls

const sizeSelector = document.getElementById("boardSize");
const newGameButton = document.getElementById("new");

const saveGameButton = document.getElementById("save");
const loadGameButton = document.getElementById("load");
const saveSGFButton = document.getElementById("saveSGFFile");
const loadSGFButton = document.getElementById("loadSGFFile");


//### Game Controls
const gameMenuModes = {
	start: document.getElementById("startMode"),
  game: document.getElementById("gameMode"),
  resign: document.getElementById("resignMode"),
  score: document.getElementById("scoreMode"),
  review: document.getElementById("reviewMode"),
  loadGame: document.getElementById("gameArchiveMode")
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

// Game Archive Mode
constPrevGameButton = document.getElementById("prevGame");
constNexGameButton = document.getElementById("nextGame");
reviewGameButton = document.getElementById("reviewGame");


// Mode Control
let gameMenu = null;

function setGameMenu(mode) {
	if (gameMenu !== null) {
		gameMenuModes[gameMenu].classList.remove("shown");
	}
	gameMenu = mode;
	gameMenuModes[mode].classList.add("shown");
}