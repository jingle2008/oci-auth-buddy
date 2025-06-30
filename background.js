/**
 * OCI Auth Buddy background logger (service worker)
 * Receives log messages from content scripts, stores in memory and chrome.storage.local, and prints to console.
 */

const messages = [];

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || !msg.type) return;

  if (msg.type === 'WRITE_LOG') {
    const entry = { time: new Date().toISOString(), message: msg.payload };
    messages.push(entry);
    chrome.storage.local.set({ authLogs: messages });
  }
  else if (msg.type === 'CLOSE_ME' && sender.tab && sender.tab.id) {
    chrome.tabs.remove(sender.tab.id);
  }
  else if (msg.type === 'CLOSE_BW') {
    // this is bitwarden chrome extension
    const BW_PREFIX = 'chrome-extension://nngceckbapebfimnlniiiahkandclblb/popup';
    function handler(tab) {
      if (tab.url && tab.url.startsWith(BW_PREFIX)) {
        chrome.tabs.remove(tab.id);
        if (tab.windowId && tab.openerTabId == null) {
          chrome.windows.remove(tab.windowId);
        }
        chrome.tabs.onCreated.removeListener(handler);
      }
    }
    chrome.tabs.onCreated.addListener(handler);
    sendResponse({ ok: true });
    return true;
  }
});
