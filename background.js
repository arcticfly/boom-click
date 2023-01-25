// initialize badge text to represent that the extension does not hide things by default
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});


// these functions call code in the set-hiding.js content script, which will be loaded in the browser
function startHiding() {
  setHiding(true);
}
function stopHiding() {
  setHiding(false);
}
function redisplayItem() {
  redisplayPrevItem();
}

// when the extension is clicked, toggle hiding and highlighting
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab) return; // only run in Chrome tabs
  // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  // Next state will always be the opposite
  const nextState = prevState === "ON" ? "OFF" : "ON";

  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === "ON") {
    // Start hiding elements when the user turns the browser extension on
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: startHiding,
    });
  } else if (nextState === "OFF") {
    // Stop hiding elements when the user turns the browser extension off
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: stopHiding,
    });
  }
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === "redisplay-item") {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: redisplayItem,
    });
  }
});
