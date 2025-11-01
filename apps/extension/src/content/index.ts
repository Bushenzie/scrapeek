/// <reference types="chrome"/>

import { getCssSelector } from "css-selector-generator";

const pickElement = () => {
  document.body.style.cursor = "pointer";

  document.body.addEventListener("click", (e) => {
    const element = e.target as Element;

    const className = getCssSelector(element);
    alert(className);
  });
};

chrome.runtime.onMessage.addListener((message) => {
  if (message === "pick") {
    pickElement();
  }
});
