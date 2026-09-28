//# Display

const info = document.getElementById("info");
info.innerHTML = "";

const blackStonesCaptDisplay = document.getElementById("blackStones")
const whiteStonesCaptDisplay = document.getElementById("whiteStones")
const coordsDisplay = document.getElementById("coords")

blackStonesCaptDisplay.innerHTML = "";
whiteStonesCaptDisplay.innerHTML = "";


function print(text) {
  info.innerHTML = text;
  console.log(text);
}

function updateCapturesDisplay() {
  printCaptures({
    black: blackStonesCaptured,
    white: whiteStonesCaptured
  });
}

function printCaptures(captures) {
  blackStonesCaptDisplay.innerHTML = `○ captured: ${captures.black}`;
  whiteStonesCaptDisplay.innerHTML = `● captured: ${captures.white}`;
}

function getCoords(x, y) {return coordsStyle(x, y);}


//### Coords Styles
function european(x, y) {
  const cols = "ABCDEFGHJKLMNOPQRST";
  const col = cols[x];
  const row = size - y;
  return `${col}${row}`;
}

function japanese(x, y) {
  const kanjiNumbers = [
    "一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
    "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九"
  ];
  const col = x + 1;
  const row = kanjiNumbers[y];
  return `${col}${row}`;
}