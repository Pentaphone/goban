//# Stones

function drawStones() {
	for (let y=0; y<size; y+=1) {
  for (let x=0; x<size; x+=1) {

    const intersection = getIntersection(x, y);
    const stone = intersection.querySelector(".stone");
    if (stone) {stone.remove()}

    removeLastMoveMark();

    const color = grid[y][x];
    if (color !== null) {
    	drawStone(x, y, color)
    }
  }}
}

function drawStone(x, y, color) {
  const intersection = getIntersection(x, y);

  const stone = document.createElement("div");
  stone.classList.add("stone", color);
  intersection.appendChild(stone);
}

function showPreview(x, y) {
  if (grid[y][x] !== null) {return}
  if (! isLegal(x, y)) {return}
  hidePreview();

  const index = y * size + x;
  const intersection = board.children[index];

  const preview = document.createElement("div");
  preview.classList.add(
    "stone", "preview", currentPlayer
  );

  intersection.appendChild(preview);
}

function hidePreview() {
  const preview = board.querySelector(".preview");
  if (preview) {preview.remove()}
}

function removeLastMoveMark() {
  const mark = board.querySelector(".lastMoveMark");
  if (mark) {mark.remove()}
}

function markLastMove(x, y) {
  const intersection = getIntersection(x, y);

  const marker = document.createElement("div");
  marker.classList.add("lastMoveMark");
  intersection.appendChild(marker);
}