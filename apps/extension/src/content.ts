/// <reference types="chrome"/>

import { getCssSelector } from "css-selector-generator";

const pickElement = (e: PointerEvent) => {
  const element = e.target as Element;

  const selector = getCssSelector(element);
  chrome.runtime.sendMessage({ action: "selected", data: { selector } });
};

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "pick") {
    document.body.style.cursor = message.data.isActive ? "auto" : "pointer";

    if (message.data.isActive) {
      document.body.removeEventListener("click", pickElement);
    } else {
      document.body.addEventListener("click", pickElement);
    }
  }
});
