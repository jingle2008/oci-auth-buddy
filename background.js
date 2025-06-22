/**
 * OCI Auth Buddy background logger (service worker)
 * Receives log messages from content scripts, stores in memory and chrome.storage.local, and prints to console.
 */

const steps = [];

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'STEP_LOG') {
    const entry = { time: new Date().toISOString(), ...msg.payload };
    steps.push(entry);
    chrome.storage.local.set({ authLogs: steps });
    console.debug('AUTH-BUDDY:', entry);
  }
});
