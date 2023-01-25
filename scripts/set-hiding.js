let hiddenElements = [];

// determine which element was interacted with in this event
function getTargetFromEvent(e) {
  let target;
  if (!e) e = window.event;
  if (e.target) target = e.target;
  else if (e.srcElement) targ = e.srcElement;
  if (target.nodeType == 3)
    // defeat Safari bug
    target = target.parentNode;
  return target;
}

// keep track of the previous background color for the most recently highlighted element
let prevBackground;
// keep track of which element was highlighted most recently
let prevHighlightedElement;

// Update which element is highlighted and restore the previous element's background color, if another element was highlighted before
function updateHighlight(event) {
  let element = getTargetFromEvent(event);
  // skip highlighting if this is not an element whose background we can change
  if (!element.style) {
    return
  }
  if (prevHighlightedElement) {
    unhighlight(prevHighlightedElement);
  }
  // record prevHighlightedElement to make sure it is unhighlighted when mouse moves over something else
  prevHighlightedElement = element;
  // record prevBackground so we can restore the background color after we're finished highlighting
  prevBackground = element.style.background;
  element.style.background = "lightblue";
}

// restore previous background color to element
function unhighlight(element) {
  element.style.background = prevBackground;
  prevBackground = null;
}

// while we are in hiding mode, we should highlight the element that clicking would hide
function startHighlighting() {
  document.addEventListener("mouseenter", updateHighlight, { capture: true });
}

// after exiting hiding mode, we should stop highlighting elements
function stopHighlighting() {
  document.removeEventListener("mouseenter", updateHighlight, {
    capture: true,
  });
  if (prevHighlightedElement) {
    // ensure that any element highlighted at the time is no longer highlighted
    unhighlight(prevHighlightedElement);
  }
}

// determine which element was clicked and set its display to "none"
function hide(event) {
  let element = getTargetFromEvent(event);
  const prevDisplay = element.style.display;
  element.style.display = "none";
  hiddenElements.push({ element, prevDisplay });
}

// restore previous display settings to the most recently hidden element
function redisplayPrevItem() {
  if (!hiddenElements.length) return // we can't display an element that isn't hidden
  const { element, prevDisplay } = hiddenElements.pop();
  element.style.display = prevDisplay;
}

// toggle hiding on and off
function setHiding(shouldHide) {
  if (shouldHide) {
    document.addEventListener("mousedown", hide, { capture: true });
    document.body.style.cursor = "pointer";
    startHighlighting();
  } else {
    document.removeEventListener("mousedown", hide, { capture: true });
    document.body.style.cursor = "";
    stopHighlighting();
  }
}
