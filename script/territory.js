//# Territory

function getTerritories() {
  const visited = newGrid();
  const territories = [];

  for (let y=0; y<size; y+=1) {
  for (let x=0; x<size; x+=1) {
    if (scoringGrid[y][x] !== null) {continue;}
    if (visited[y][x]) {continue;}

    const territory = getTerritory(x, y, visited);

    if (territory) {territories.push(territory);}
	}}
  return territories;
}

function getTerritory(x, y, visited) {

	// Flood fill
  const area = [];
  const borderingColors = [];
  const queue = [[x, y]];

  while (queue.length > 0) {
    const [cx, cy] = queue.pop();

    if (visited[cy][cx]) {continue;}
    visited[cy][cx] = true;

    if (scoringGrid[cy][cx] !== null) {continue;}

    area.push([cx, cy]);

    for (const [nx, ny] of getNeighbors(cx, cy)) {
      const neighbor = scoringGrid[ny][nx];
      if (neighbor === null) {
        if (!visited[ny][nx]) {queue.push([nx, ny]);}
      }
      else {  // border
        if (!borderingColors.includes(neighbor)) {
        	borderingColors.push(neighbor);
    } } }
  }
  let owner = null;
  if (borderingColors.length === 1) {
  	owner = borderingColors[0];
  }
  return {
    points: area,
    owner,
  };
}

function drawTerritories() {
	removeTerritoryMarks();
  const territories = getTerritories();

  for (const territory of territories) {
  	const owner = territory.owner;
    if (owner === null) {continue;}

    for (const [x, y] of territory.points) {
    	drawTerritoryMark(x, y, territory.owner);
} } }

function drawTerritoryMark(x, y, color) {
	const intersection = getIntersection(x, y);

  const mark = document.createElement("div");
  mark.classList.add("territoryMark", color);
  intersection.appendChild(mark);
}

function removeTerritoryMarks() {
  const marks = board.querySelectorAll(".territoryMark");
  for (const mark of marks) {mark.remove()}
}