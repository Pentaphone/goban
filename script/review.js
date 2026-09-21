//# Review

function review() {
  programMode = "review";
  setGameMenu("review");

	scoreInfo =`
		Black: ${score.black},
		White: ${score.white} (${score.white - score.komi} + ${score.komi})
		 – ${capitalize(winner)} wins`;
  info.innerHTML = scoreInfo;

  drawStones();
  drawDeadStones();

  updateButtons();
}

prevMoveButton.onclick = () => {
	move -= 1;
	showMove(move);
}

nextMoveButton.onclick = () => {
	move += 1;
	showMove(move);
}

skipToStartButton.onclick = () => {
	move = 0;
	showMove(move);
}

skipToEndButton.onclick = () => {
	move = moveHistory.length - 1;
	showMove(move);
}

function showMove(moveIndex) {
  const moveToShow = moveHistory[moveIndex];
  const player = moveToShow.player;

  const positionIndex = getPositionIndex(moveIndex);
  restoreGrid(positionHistory[positionIndex]);
  drawStones();
  removeLastMoveMark();

  info.innerHTML = `Move ${moveIndex}`;

  if (moveToShow.type === "play") {
  	const [x, y] = moveToShow.place;
    markLastMove(x, y);
  }
  if (moveToShow.type === "pass") {
  	info.innerHTML += ` – ${capitalize(player)} passed`;
  }
  if (moveToShow.type === "resign") {
  	info.innerHTML = `${capitalize(player)} resigned`;
  }

  const isFinalMove = moveIndex === moveHistory.length - 1;

  if (isFinalMove) {
  	drawDeadStones();
  	drawTerritories();
  	info.innerHTML += " | " + scoreInfo;
  }
  else {removeTerritoryMarks();}

  if (blackStonesCaptured || whiteStonesCaptured) {
  	printCaptures(captureHistory[positionIndex]);
  }

  updateButtons();
}

function getPositionIndex(moveIndex) {
  let positionIndex = 0;
  for (let i=1; i<=moveIndex; i+=1) {
    if (moveHistory[i].type === "play") {positionIndex += 1}
  }
  return positionIndex;
}

function updateButtons() {
	prevMoveButton.disabled = move <= 0;
	skipToStartButton.disabled = move <= 0;
  nextMoveButton.disabled = move >= moveHistory.length - 1;
  skipToEndButton.disabled = move >= moveHistory.length - 1;
}