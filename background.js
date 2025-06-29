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
});
