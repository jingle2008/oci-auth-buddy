/**
 * OCI Auth Buddy background logger (service worker)
 * Receives log messages from content scripts, stores in memory and chrome.storage.local, and prints to console.
 */

const messages = [];

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

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || !msg.type) return;

  if (msg.type === 'WRITE_LOG') {
    const entry = {
      time: new Date().toISOString(),
      page: pageLabel(sender),
      message: msg.payload,
    };
    messages.push(entry);
    chrome.storage.local.set({ authLogs: messages });
    console.log(`${entry.time} [${entry.page}] ${entry.message}`);
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
