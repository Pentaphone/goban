//# Console

function command(input) {
  const parts = input.trim().toLowerCase().split(/\s+/);
  if (parts.length === 0 || parts[0] === "") {return;}

  const cmd = parts[0];

  switch (cmd) {

    case "play":
      if (parts.length !== 2) {
        console.log("Usage: play e3");
        return;
      }
      place(parts[1]);
      break;

    case "board":
      if (parts.length !== 1) {
        console.log("Unknown command, do you mean 'board'?");
        return;
      }
      printPosition(grid);
      break;

    case "pass":
      if (parts.length !== 1) {
        console.log("Unknown command, do you mean 'pass'?");
        return;
      }
      pass();
      break;

    case "resign":
      if (parts.length !== 1) {
        console.log("Unknown command, do you mean 'resign'?");
        return;
      }
      resign();
      break;

    case "undo":
      if (parts.length !== 1) {
        console.log("Unknown command, do you mean 'undo'?");
        return;
      }
      undo();
      break;

    case "?":
    case "help":
      help();
      break;

    default:
      console.log(`Unknown command: ${cmd}.`);
      console.log("Type ? or help for available commands.");
  }
}

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

  const header = "   " + letters.slice(0, size).split("").join(" ");
  lines.push(header);

  for (let y = 0; y < size; y++) {
    const row = [];

    for (let x = 0; x < size; x++) {
      const stone = position[y][x];
      if 			(stone === "black") {row.push("○");}
      else if (stone === "white") {row.push("●");}
      else {row.push(".");}
    }
    const coordinate = String(size - y).padStart(2, " ");
    lines.push(`${coordinate} ${row.join(" ")} ${coordinate}`);
  }
  lines.push(header);

  const output = lines.join("\n");

  console.log(output);
  return output;
}

function undo() {
  if (moveHistory.length === 0) {return;}

  const lastMove = moveHistory[moveHistory.length - 1];
  if (lastMove.type === "play") {undoStone();}
  else if (lastMove.type === "pass") {undoPass();}
  else if (lastMove.type === "resign") {undoResign();}
}

function help() {
  console.log(`
Available commands:
  play e3     Place stone at E3
  pass        Pass
  board       Print board
  resign      Resign game
  undo        Undo last move
  ? / help    Show this help
  `);
}