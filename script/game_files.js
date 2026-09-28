//# Game Files

function saveSGFFile() {
	const result = null;
	if (gameOver) {scoreToSGFResult(score)};
	const toPlay = gameOver? null: currentPlayer;
	const sgfString = gameToSGF({
	  date: date,
	  toPlay: toPlay,
	  komi: komi,
	  score: gameOver? score: null
	});

	const filename = `goGame.sgf`;
  const file = new File(
  	[sgfString],
  	filename,
  	{type:"application/x-go-sgf"}
  );
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");	 // anchor
  link.href = url;
  link.download = file.name;
  link.click();
  
  URL.revokeObjectURL(url);
}

function gameToSGF({
	blackName = "",
	whiteName = "",
	date = null,
	toPlay = null,
	komi = null,
	score,
	} = {}) {

	let sgf = `(;GM[1]FF[4]SZ[${size}]`;

	if (blackName) {sgf += `PB[${escapeSGF(blackName)}]`;}
	if (whiteName) {sgf += `PW[${escapeSGF(whiteName)}]`;}
	if (date) {sgf += `DT[${dateToISO(date)}]`;}

	if (toPlay) {
		const player = toPlay === "black"? "B": "W";
		sgf += `PL[${player}]`;
	}

	if (komi) {sgf += `KM[${komi}]`;}
	if (score) {sgf += `RE[${scoreToSGFResult(score)}]`;}

	for (const move of moveHistory) {
    const color = move.player === "black"? "B": "W";

    if (move.type === "play") {
    	const [x, y] = move.place;
      sgf += `;${color}[${sgfCoords(x, y)}]`;
  	}
    else if (move.type === "pass") {
      sgf += `;${color}[]`;
    }
	}
	sgf += ")";

	return sgf;
}

function scoreToSGFResult(score) {
	if (score.resignation) {
		return `${score.winner === "black"? "B": "W"}+R`;
	}
  const difference = score.black - score.white;
  if (difference > 0) {return `B+${difference}`;}
  if (difference < 0) {return `W+${Math.abs(difference)}`;}

  return "0";
}

function escapeSGF(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\]/g, "\\]")
    .replace(/\r?\n/g, "\\n");
}

function unescapeSGF(text) {
  return text
    .replace(/\\n/g, "\n")
    .replace(/\\]/g, "]")
    .replace(/\\\\/g, "\\");
}

function sgfCoords(x, y) {
  return String.fromCharCode(97 + x) + String.fromCharCode(97 + y);
}

function fromSGFCoords(coords) {
  if (coords.length !== 2) {return null;}

  const x = coords.charCodeAt(0) - 97;
  const y = coords.charCodeAt(1) - 97;
  if (x < 0 || x >= size || y < 0 || y >= size) {return null;}

  return [x, y];
}

function dateToISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

async function loadSGFFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const sgfString = await file.text();
  loadSGF(sgfString);
}

function loadSGF(sgfString) {
  sgfString = sgfString.trim();

  const sizeMatch = sgfString.match(/SZ\[(\d+)\]/);
  const blackMatch = sgfString.match(/PB\[((?:\\.|[^\]])*)\]/);
  const whiteMatch = sgfString.match(/PW\[((?:\\.|[^\]])*)\]/);
  const komiMatch = sgfString.match(/KM\[([^\]]*)\]/);
  const dateMatch = sgfString.match(/DT\[([^\]]*)\]/);
  const resultMatch = sgfString.match(/RE\[([^\]]*)\]/);

  const sgfSize = sizeMatch? Number(sizeMatch[1]): 19;
  const blackName = blackMatch? unescapeSGF(blackMatch[1]): "";
  const whiteName = whiteMatch? unescapeSGF(whiteMatch[1]): "";
  const date = dateMatch? dateMatch[1]: "";
  const komi = komiMatch? Number(komiMatch[1]): 6.5;
  const result = resultMatch? resultMatch[1]: "";

  const moves = [];
  const moveRegex = /;([BW])\[([^\]]*)\]/g;
  let   match;

  while ((match = moveRegex.exec(sgfString)) !== null) {
    moves.push({
      player: match[1] === "B"? "black": "white",
      coords: match[2]
    });
  }
  loadGame({
    size: sgfSize,
    blackName, whiteName,
    date,
    komi, result,
    moves
  });
}

function loadGame(game) {
	loadingGame = true;
	gameDate = game.date;
	komi = game.komi;
  newGame(game.size);

  for (const recordedMove of game.moves) {
    currentPlayer = recordedMove.player;
  	if (recordedMove.coords === "") {
			pass();
			continue;
    }
		const coords = fromSGFCoords(recordedMove.coords);
    if (!coords) {
			console.warn(
				"Invalid SGF coordinates: " + recordedMove.coords
			);
			continue;
    }
    const [x, y] = coords;
    placeStone(x, y);
  }
  if (game.result) {
  	gameOver = true;
  	sgfResult = game.result;
  	scoreGame();
  	printSGFResult(game.result);
  }
	loadingGame = false;
}

function printSGFResult(result) {
  if (!result) {console.log("No result recorded"); return;}

  if (result === "0") {
  	info.innerHTML = "Draw";
  	return;
  }
  const match = result.match(/^([BW])\+(.+)$/);
  if (!match) {
  	info.innerHTML = `Result: ${result}`;
    return;
  }
  const winner = match[1] === "B"? "Black" : "White";
  const loser  = match[1] === "B"? "White" : "Black";
  const value = match[2];

  let resultInfo = "";
  if (value === "R") {resultInfo = `${loser} resigned`;}
  else {resultInfo = `${winner}: +${value}`;}

  info.innerHTML = `${resultInfo} – ${winner} won`;
}