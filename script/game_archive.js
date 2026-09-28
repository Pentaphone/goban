//# Game Archive

loadGameButton.onclick = () => {
	setGameMenu("loadGame");
	saveGameButton.disabled = true;

	closeDropdowns()
}

saveGameButton.onclick = () => {
	saved = true;
	saveGameButton.disabled = true;

	closeDropdowns();
}

saveSGFButton.onclick = saveSGFFile;

loadSGFButton.addEventListener("change", async (event) => {
	await loadSGFFile(event);

	if (gameOver) {
		programMode = "review";
		setGameMenu("review");
	  updateButtons();
	}
	else {
		programMode = "play";
		setGameMenu("game");
	}

	closeDropdowns();
});

reviewGameButton.onclick = () => {
  programMode = "review";
	setGameMenu("review");
  updateButtons();
}
