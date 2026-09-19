//# Review

function review() {
  programMode = "review";
  setGameControlMode("review");

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
	move = moveHistory.length - 2;
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
  	info.innerHTML += ` - ${capitalize(player)} passed`;
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
  nextMoveButton.disabled = move >= moveHistory.length - 2;
  skipToEndButton.disabled = move >= moveHistory.length - 2;
}
		