/// <reference types="chrome"/>

chrome.tabs.onActivated.addListener((e) => {
  chrome.commands.onCommand.addListener(async (command) => {
    if (command === "pick") {
      chrome.tabs.sendMessage(e.tabId, "pick");
    }
  });
});
