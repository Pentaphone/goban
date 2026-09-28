//# Console

function place(coords) {
  const [x, y] = parseCoordinate(coords);

  if (x === null || y === null) {
    console.log(`Invalid coordinates: ${coords}`);
    return;
  }
  placeStone(x, y);
}

function parseCoordinate(coordinate) {
  coordinate = coordinate.toUpperCase();
  const letters = "ABCDEFGHJKLMNOPQRST";

  const match = coordinate.match(/^([A-T])(\d+)$/);
  if (!match) {return [null, null];}

  const x = letters.indexOf(match[1]);
  const y = size - Number(match[2]);

  if (x < 0 || x >= size || y < 0 || y >= size) {
    return [null, null];
  }
  return [x, y];
}

function printPosition(position = null) {
	position = position? position: grid;

  const letters = "ABCDEFGHJKLMNOPQRST";
  const lines = [];

  const headerLetters = letters.slice(0, size);
  const header = "   " + headerLetters.split("").join(" ");
  lines.push(header);

  for (let y = 0; y < size; y++) {
    const row = [];

    for (let x = 0; x < size; x++) {
      if 			(position[y][x] === "black") {row.push("○");}
      else if (position[y][x] === "white") {row.push("●");}
      else if (isHoshi(x, y)) {row.push(",");}
      else {row.push(".");}
    }
    const lineContent = row.join(" ");
    const coordinate = String(size - y).padStart(2, " ");
    lines.push(`${coordinate} ${lineContent} ${coordinate}`);
  }
  lines.push(header);

  const output = lines.join("\n");

  console.log(output);
  return output;
}

function printBoard() {printPosition(grid);}

function undo() {
  if (moveHistory.length === 0) {return;}

  const lastMove = moveHistory[moveHistory.length - 1];
  if (lastMove.type === "play") {undoStone();}
  else if (lastMove.type === "pass") {undoPass();}
  else if (lastMove.type === "resign") {undoResign();}
}