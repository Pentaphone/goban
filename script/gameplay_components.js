//# Gameplay Components

//### Grid
function newGrid() {
  const createRow = () => Array(size).fill(null);
  const grid = Array.from({length: size}, createRow);

  center = [Math.floor(size / 2), Math.floor(size / 2)];

  return grid;
}

function copyGrid(grid) {
  return grid.map(row => [...row]);
}

function restoreGrid(savedGrid) {
  for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
      grid[y][x] = savedGrid[y][x];
  }}
}

function gridsEqual(a, b) {
  if (a === null || b === null) {return false}

  for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    if (a[y][x] !== b[y][x]) {
        return false;
    }
  }}
  return true;
}


//### Neighbours, Groups
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

function capture(x, y, count=true) {
  const opponent = currentPlayer === "black"? "white": "black";
  for (const [nx, ny] of getNeighbors(x, y)) {
    if (grid[ny][nx] !== opponent) {continue}

    if (isCaptured(nx, ny)) {
    	const capturedStones = captureGroup(nx, ny);
      if (count) {addCaptures(capturedStones, opponent)}
    }
  }
  if (count) {
    captureHistory.push({
      black: blackStonesCaptured, white: whiteStonesCaptured
    });
  }
}

function selfCapture(x, y, count=true) {
  if (grid[y][x] !== currentPlayer) {return}
  if (isCaptured(x, y)) {
    const selfCapturedStones = captureGroup(x, y)
  }
  if (count) {
    addCaptures(selfCapturedStones, currentPlayer);
    captureHistory.push({
      black: blackStonesCaptured, white: whiteStonesCaptured
    });
  }
} 

function captureGroup(x, y) {
  const group = getGroup(x, y);

  for (const [gx, gy] of group) {
    grid[gy][gx] = null;
  }
  return group.length;
}

function addCaptures(capturedStones, color) {
  if (color === "black") {
    blackStonesCaptured += capturedStones
  }
  else if (color === "white") {
    whiteStonesCaptured += capturedStones
  }
  printCaptures({
    black: blackStonesCaptured,
    white: whiteStonesCaptured
  });
}


//### Ko Rules, Move Permission
function simpleKo() {
  if (positionHistory.length < 2) {return false;}

  return gridsEqual(
    grid, positionHistory[positionHistory.length - 2]
  );
}

function positionalKo() {
  for (position of positionHistory) {
    if (gridsEqual(grid, position)) {return true}
  }
  return false;
}

function isLegal(x, y) {
  if (grid[y][x] !== null) {return false}

  const opponent = currentPlayer === "black"? "white": "black";
  
  const savedGrid = copyGrid(grid);

  grid[y][x] = currentPlayer;
  capture(x, y, false);

  const isSelfCapture = allowSelfCapture === false? isCaptured(x, y): false;
  const isKo = koRule? koRule(): false;
  const legal = !(isSelfCapture || isKo);

  restoreGrid(savedGrid);
  return legal;
}