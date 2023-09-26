/* global chrome */
import browser from 'webextension-polyfill';
console.log(
  "started"
)
chrome.action.onClicked.addListener(function(tab) {
  console.log("toggle")
  chrome.tabs.sendMessage(tab.id, "toggle");
});