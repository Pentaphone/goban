//# Score

function scoreGame() {
	programMode = "score";
  setGameMenu("score");

  scoringGrid = copyGrid(grid);
  deadStones = new Set();

  removeLastMoveMark();
  drawTerritories();
}


//### Toggle Dead Groups
function toggleGroup(gx, gy) {
  if (grid[gy][gx] === null) return;

  const group = getGroup(gx, gy);
  const color = grid[gy][gx];
  const isDead = deadStones.has(`${gx},${gy}`);

  for (const [x, y] of group) {

  	if (!isDead) {  // Mark dead
  		scoringGrid[y][x] = null;
  		deadStones.add(`${x},${y}`);
  		addCaptures(1, color);
  	}
  	else {  // Mark alive
  		scoringGrid[y][x] = color;
  		deadStones.delete(`${x},${y}`);
    	drawStone(x, y, color);
    	addCaptures(-1, color);
    }
  }
  drawDeadStones();
  drawTerritories();
}

function drawDeadStones() {
  clearDeadStones();

  for (const key of deadStones) {
    const [x, y] = key.split(",").map(Number);
    const color = grid[y][x];
    removeStone(x, y);
    drawPreview(x, y, color, "dead");
  }
}

function clearDeadStones() {
  const deadStones = board.querySelectorAll(".dead");
  for (const preview of deadStones) {preview.remove();
  }
}


//### Calculate Score
function calculateScore(komi = 6.5) {
  const territories = getTerritories();

  let blackTerritory = 0;
  let whiteTerritory = 0;

  for (const territory of territories) {
    if (territory.owner === "black") {
      blackTerritory += territory.points.length;
    } else if (territory.owner === "white") {
      whiteTerritory += territory.points.length;
    }
  }

  let blackDead = 0;
  let whiteDead = 0;

  for (const key of deadStones) {
    const [x, y] = key.split(",").map(Number);
    if (grid[y][x] === "black") {blackDead += 1;}
    else if (grid[y][x] === "white") {whiteDead += 1;}
  }

  const black =
  		blackTerritory
  	+ whiteStonesCaptured;

  const white =
			whiteTerritory
		+ blackStonesCaptured
		+ komi;

	if (!resignation) {winner = white > black? "white": "black";}
	return {black: black, white: white, komi: komi};
}

scoreConfirmButton.onclick = () => {
	score = calculateScore(komi);
	review();
}