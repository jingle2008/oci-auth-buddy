/**
 * OCI Auth Buddy background logger (service worker)
 * Receives log messages from content scripts, stores in memory and chrome.storage.local, and prints to console.
 */

// Cap the stored history so a long-lived worker cannot grow past the
// chrome.storage.local quota now that entries survive restarts.
const MAX_ENTRIES = 2000;

let messages = [];

// The worker is torn down whenever it goes idle, so the in-memory array has
// to be rebuilt from storage before the first write, or that write would
// replace the whole stored history with a single entry. Every read and write
// is chained onto this promise to keep them ordered.
let queue = chrome.storage.local.get('authLogs')
  .then(result => { messages = Array.isArray(result.authLogs) ? result.authLogs : []; })
  .catch(() => { messages = []; });

function appendLog(entry) {
  queue = queue
    .then(() => {
      messages.push(entry);
      if (messages.length > MAX_ENTRIES) messages = messages.slice(-MAX_ENTRIES);
      return chrome.storage.local.set({ authLogs: messages });
    })
    .catch(e => console.warn('Failed to store log entry:', e));
}

function clearLogs() {
  queue = queue
    .then(() => {
      messages = [];
      return chrome.storage.local.set({ authLogs: messages });
    })
    .catch(e => console.warn('Failed to clear logs:', e));
  return queue;
}

/**
 * Short label for the page a log came from, e.g. `login.oci.oraclecloud.com/v2/ui/signin`.
 * @param {object} sender - chrome.runtime message sender.
 * @returns {string}
 */
function pageLabel(sender) {
  const url = sender && (sender.url || (sender.tab && sender.tab.url));
  if (!url) return 'unknown page';

  try {
    const parsed = new URL(url);
    return parsed.hostname + parsed.pathname;
  } catch (e) {
    return url;
  }
}

// Bitwarden's own extension popup, which steals focus from the passkey
// prompt. Only one listener is ever armed, and only for a short window: a
// leftover listener would close a popup the user opened deliberately, and one
// per passkey attempt would stack up for the life of the worker.
const BW_PREFIX = 'chrome-extension://nngceckbapebfimnlniiiahkandclblb/popup';
const BW_WINDOW_MS = 15000;

let bwHandler = null;
let bwTimer = null;

function disarmBitwardenCloser() {
  if (bwHandler) {
    chrome.tabs.onCreated.removeListener(bwHandler);
    bwHandler = null;
  }
  if (bwTimer) {
    clearTimeout(bwTimer);
    bwTimer = null;
  }
}

function armBitwardenCloser() {
  disarmBitwardenCloser();

  bwHandler = tab => {
    if (!tab.url || !tab.url.startsWith(BW_PREFIX)) return;

    // Removing the tab can already close its window, so both removals are
    // allowed to fail without raising an unhandled rejection.
    Promise.resolve(chrome.tabs.remove(tab.id)).catch(() => {});
    if (tab.windowId && tab.openerTabId == null) {
      Promise.resolve(chrome.windows.remove(tab.windowId)).catch(() => {});
    }
    disarmBitwardenCloser();
  };

  chrome.tabs.onCreated.addListener(bwHandler);
  bwTimer = setTimeout(disarmBitwardenCloser, BW_WINDOW_MS);
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || !msg.type) return;

  if (msg.type === 'WRITE_LOG') {
    const entry = {
      time: new Date().toISOString(),
      page: pageLabel(sender),
      message: msg.payload,
    };
    appendLog(entry);
    console.log(`${entry.time} [${entry.page}] ${entry.message}`);
  }
  else if (msg.type === 'CLEAR_LOGS') {
    // The popup must not write storage directly: this worker holds the array
    // that every later write is built from, so a direct clear would be undone
    // by the next log line.
    clearLogs().then(() => sendResponse({ ok: true }));
    return true;
  }
  else if (msg.type === 'CLOSE_ME' && sender.tab && sender.tab.id) {
    chrome.tabs.remove(sender.tab.id);
  }
  else if (msg.type === 'CLOSE_BW') {
    armBitwardenCloser();
    sendResponse({ ok: true });
    return true;
  }
});
