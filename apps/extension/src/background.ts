/// <reference types="chrome"/>

let isActive = false;

chrome.tabs.onActivated.addListener(({ tabId, windowId }) => {
  chrome.commands.onCommand.addListener((command) => {
    if (command === "pick") {
      const msg = {
        action: "pick",
        data: { isActive },
      };
      chrome.tabs.sendMessage(tabId, msg);
      isActive = !isActive;
    }
  });
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "selected") {
      const msg = {
        action: "insert",
        data: { selector: message.selector },
      };
      isActive = false;
      chrome.runtime.sendMessage(msg);
      chrome.action.openPopup({ windowId });
    }
  });
});
