/// <reference types="chrome"/>

const copyBtn = document.querySelector("#copy-btn") as HTMLButtonElement;
const selectorInput = document.querySelector(
  "#selector-input"
) as HTMLInputElement;

copyBtn.addEventListener("click", async () => {
  const selectorInputValue = selectorInput.value;
  if (!selectorInputValue) return;

  await navigator.clipboard.writeText(selectorInputValue);
});

chrome.runtime.onMessage.addListener((message) => {
  console.log(message);
});
