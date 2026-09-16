//# Gameplay Components

function newGrid() {
  const createRow = () => Array(size).fill(null);
  const grid = Array.from({length: size}, createRow);

  center = [Math.floor(size / 2), Math.floor(size / 2)];

  return grid;
}

function getNeighbors(x, y) {
  const neighbors = [];

  if (x > 0) {neighbors.push([x - 1, y])}
  if (x < size - 1) {neighbors.push([x + 1, y])}
  if (y > 0) {neighbors.push([x, y - 1])}
  if (y < size - 1) {neighbors.push([x, y + 1])}
  return neighbors;
}

function getGroup(x, y) {
  const color = grid[y][x];
  if (color === null) {return []}

	// Floodfill
  const group = [];
  const visited = newGrid();
  const queue = [[x, y]];

  while (queue.length > 0) {
    const [cx, cy] = queue.pop();

    if (visited[cy][cx]) {continue}
    visited[cy][cx] = true;

    if (grid[cy][cx] !== color) {continue}

    group.push([cx, cy]);

    for (const [nx, ny] of getNeighbors(cx, cy)) {
    	queue.push([nx, ny]);
    }
  }
  return group;
}


//### Atari, Captures
function getLiberties(x, y) {
  const group = getGroup(x, y);
  const liberties = new Set();

  for (const [sx, sy] of group) {
    for (const [nx, ny] of getNeighbors(sx, sy)) {

      if (grid[ny][nx] === null) {
      	liberties.add(`${nx},${ny}`)}
    }
  }
  const toArray = (str) => {
  	return str.split(",").map(Number)}
  return [...liberties].map(toArray)
}

function isAtari(x, y) {
  return getLiberties(x, y).length === 1;
}
function isCaptured(x, y) {
  return getLiberties(x, y).length === 0;
}

function capture(x, y) {
  const opponent = currentPlayer === "black"? "white": "black";
  for (const [nx, ny] of getNeighbors(x, y)) {
    if (grid[ny][nx] !== opponent) {continue}

    if (isCaptured(nx, ny)) {
    	const capturedStones = captureGroup(nx, ny);
    	if (opponent === "black") {blackStonesCaptured += capturedStones}
    	else if (opponent === "white") {whiteStonesCaptured += capturedStones}
    
    	capturesDisplay.innerHTML = 
    		`○ captured: ${blackStonesCaptured}
    		 <div class="spacing"></div>
				 ● captured: ${whiteStonesCaptured}` 
    }
	}
}

function captureGroup(x, y) {
	const group = getGroup(x, y);

  for (const [gx, gy] of group) {
    grid[gy][gx] = null;
  }
  return group.length;
}