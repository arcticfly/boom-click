let hiddenElements = [];

function hide(event) {
  let element = event.target;
  const prevDisplay = element.style.display;
  element.style.display = "none";
  hiddenElements.push({ element, prevDisplay });
}

function restoreOneItem() {
    const { element, prevDisplay } = hiddenElements.shift();
    element.style.display = prevDisplay;
}

function setHiding(shouldHide) {
  if (shouldHide) {
    document.addEventListener("mousedown", hide, true);
    document.body.style.cursor = "pointer";
  } else {
    document.removeEventListener("mousedown", hide, true);
    document.body.style.cursor = "";
  }
}
