//# Board

function drawBoard() {
  board.innerHTML = "";

  board.style.gridTemplateColumns =`repeat(${size}, 1fr)`;
  board.style.gridTemplateRows =`repeat(${size}, 1fr)`;

  for (let y=0; y<size; y+=1) {
  for (let x=0; x<size; x+=1) {

	  const intersection = document.createElement("div");
	  intersection.classList.add("intersection");
	  intersection.dataset.x = x;
	  intersection.dataset.y = y;

	  if (isHoshi(x, y)) {
	    const hoshi = document.createElement("div");
	    hoshi.classList.add("hoshi");
	    intersection.appendChild(hoshi);
	  }

	  intersection.addEventListener("click", () => {
	    placeStone(x, y)
	  });

	  intersection.addEventListener("mouseenter", () => {
	    if (! gameOver) {showPreview(x, y)}
	  });

	  intersection.addEventListener("mouseleave", () =>
	    hidePreview()
	  );

	  board.appendChild(intersection);
} }}

function isHoshi(x, y) {
  const dist = {
     9: 2,
    13: 3,
    19: 3,
  }[size]
  const last = size - 1;

  const points = [
    [dist, dist],
    [dist, last - dist],
    [last - dist, dist],
    [last - dist, last - dist],
    center,
  ];

  return points.some(([px, py]) => px === x && py === y);
}

function getIntersection(x, y) {
	const index = y * size + x;
  const intersection = board.children[index];
  return intersection;
}