let hiddenElements = [];

// determine which element was interacted with in this event
function getTargetFromEvent(e) {
  let target;
  if (!e) e = document.event;
  if (e.target) target = e.target;
  else if (e.srcElement) target = e.srcElement;
  if (target.nodeType == 3)
    // defeat Safari bug
    target = target.parentNode;
  return target;
}

// keep track of the previous background color for the most recently highlighted element
let prevBackground;
// keep track of currently highlighted element
let highlightedElement;
// keep track of colored highlight div so we can remove it later
let highlight;
// keep track of the highlighted element's previous click listener so we can restore it when the element is no longer highlighted
let prevOnClick;

// Update which element is highlighted and restore the previous element's background color, if another element was highlighted before
function updateHighlight(event) {
  let element = getTargetFromEvent(event);
  // skip highlighting if this is not an element whose background we can change
  if (!element?.getBoundingClientRect) {
    return;
  }
  removeHighlight();

  const rect = element.getBoundingClientRect();
  const {height, width, left, top} = rect;

  // record highlightedElement to make sure it is unhighlighted when mouse moves over something else
  highlightedElement = element;
  prevOnClick = highlightedElement.onclick
  highlightedElement.onclick = (event) => hide(event)

  // show highlight on the screen
  highlight = document.createElement("div");
  highlight.style.position = "absolute";
  highlight.style.top = top + window.scrollY + "px";
  highlight.style.left = left + window.scrollX + "px";
  highlight.style.width = width + "px";
  highlight.style.height = height + "px";
  highlight.style.backgroundColor = "orange";
  highlight.style.opacity = "50%";
  highlight.style.pointerEvents = "none";
  highlight.style.zIndex = 1000;
  document.body.appendChild(highlight);
}

// remove any highlight and restore the original onclick functionality of the highlighted element
function removeHighlight() {
  if (!highlightedElement) return // only remove highlight if there was one to begin with
  highlight.remove()
  highlightedElement.onclick = prevOnClick;
  prevOnClick = null;
}

// while we are in hiding mode, we should highlight the element that clicking would hide
function startHighlighting() {
  document.addEventListener("mouseover", updateHighlight, { capture: true });
}

// after exiting hiding mode, we should stop highlighting elements
function stopHighlighting() {
  document.removeEventListener("mouseover", updateHighlight, {
    capture: true,
  });
  // ensure that any element highlighted at the time is no longer highlighted
  removeHighlight()
}

// determine which element was clicked and set its display to "none"
function hide(event) {
  const prevDisplay = highlightedElement.style.display;
  highlightedElement.style.display = "none";
  hiddenElements.push({ element: highlightedElement, prevDisplay });
  // Prevent user from navigating while deleting a link from the page
  event.preventDefault();
  event.stopImmediatePropagation();
}

// restore previous display settings to the most recently hidden element
function redisplayPrevItem() {
  if (!hiddenElements.length) return; // we can't display an element that isn't hidden
  const { element, prevDisplay } = hiddenElements.pop();
  element.style.display = prevDisplay;
}

// toggle hiding on and off
function setHiding(shouldHide) {
  if (shouldHide) {
    document.body.style.cursor = "pointer";
    startHighlighting();
  } else {
    document.body.style.cursor = "";
    stopHighlighting();
  }
}
