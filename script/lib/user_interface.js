//# User Interface

//### Dropdown Menus
const dropdowns = document.querySelectorAll(".dropdown");

// To use, dropdown button must have class "dropdown-button".
// Put dropdown-button into division with class "dropdown".
// Put buttons in dropdown-menu into division with class "dropdown-menu".

dropdowns.forEach(dropdown => {
  const button = dropdown.querySelector(".dropdown-button");
  button.addEventListener("click", event =>
  	toggleDropdown(event, dropdown)
  )
});

function toggleDropdown(event, dropdown) {
	dropdowns.forEach(other => {
    if (other !== dropdown) {other.classList.remove("open");}
  });
  dropdown.classList.toggle("open");
}

function closeDropdowns() {
	dropdowns.forEach(dropdown => {
    dropdown.classList.remove("open");
  });
}

// Close dropdown menu when clicked somwhere else
document.addEventListener("click", event => {
  if (!event.target.closest(".dropdown")) {
    closeDropdowns()
  }
});