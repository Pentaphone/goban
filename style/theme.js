//# Theme

function setTheme(theme) {
  for (const sheet of document.querySelectorAll("link[data-theme]")) {
    sheet.disabled = sheet.dataset.theme !== theme;
  }
}