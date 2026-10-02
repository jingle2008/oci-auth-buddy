const appTag = '[auth-buddy]';

function writeLog(message) {
  try {
    // Called without a callback, sendMessage returns a promise that rejects
    // when there is no receiving end, e.g. just after the extension reloads.
    // Without this the log line is lost silently and the rejection surfaces
    // as an unhandled error instead of the warning below.
    const sent = chrome.runtime.sendMessage({ type: 'WRITE_LOG', payload: message });
    if (sent && typeof sent.catch === 'function') {
      sent.catch(e => console.warn(appTag, 'Failed to log task:', e));
    }
  } catch (e) {
    console.warn(appTag, 'Failed to log task:', e);
  }
}

/**
 * Builds a short, human readable description of an element for logs,
 * e.g. `button#submit-domain "Continue"`.
 * @param {HTMLElement|null} el
 * @returns {string}
 */
function describeElement(el) {
  if (!el) return 'null element';

  let desc = el.tagName ? el.tagName.toLowerCase() : 'node';
  if (el.id) desc += `#${el.id}`;

  const label = typeof el.getAttribute === 'function' ? el.getAttribute('aria-label') : null;
  if (label) desc += `[aria-label="${label}"]`;

  const text = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
  if (text) desc += ` "${text.length > 40 ? text.slice(0, 40) + '\u2026' : text}"`;

  return desc;
}

/**
 * Waits for an element to exist and satisfy a predicate.
 * @param {string} selector - CSS selector for the element.
 * @param {number} [maxTries=50] - Max attempts before giving up.
 * @param {number} [delay=200] - Delay between attempts (ms).
 * @param {function} [predicate=null] - Optional function to further check the element.
 * @param {AbortSignal} [signal] - Optional AbortSignal to cancel polling.
 * @returns {Promise<HTMLElement|null>}
 */
function waitForElement(selector, maxTries = 50, delay = 200, predicate = null, signal = undefined) {
  return new Promise((resolve, reject) => {
    let tries = 0;
    let finished = false;
    let timer = null;

    function cleanup() {
      finished = true;
      if (timer) clearInterval(timer);
      if (signal) signal.removeEventListener('abort', onAbort);
    }

    function onAbort() {
      cleanup();
      reject(new DOMException('Aborted', 'AbortError'));
    }

    if (signal) {
      if (signal.aborted) return reject(new DOMException('Aborted', 'AbortError'));
      signal.addEventListener('abort', onAbort);
    }

    writeLog(`waiting for "${selector}"`);

    // Log the "present but not ready" state only on the first occurrence,
    // so polling does not flood the log with one entry per attempt.
    let loggedNotReady = false;

    // Immediate first check. Every match is considered, not just the first:
    // a selector can list several candidates, or match a stale hidden copy of
    // the element before the live one, and only the predicate can tell which
    // is the right target.
    const check = () => {
      const found = document.querySelectorAll(selector);
      if (!found.length) return false;

      const el = predicate ? Array.from(found).find(e => predicate(e)) : found[0];
      if (el) {
        writeLog(`matched "${selector}": ${describeElement(el)}`);
        cleanup();
        resolve(el);
        return true;
      }

      if (!loggedNotReady) {
        loggedNotReady = true;
        writeLog(`${found.length} element(s) matched "${selector}", none ready yet: ${describeElement(found[0])}`);
      }
      return false;
    };

    if (check()) return;

    timer = setInterval(() => {
      if (finished) return;
      if (check()) return;

      if (++tries > maxTries) {
        cleanup();
        // One check runs before the interval starts, so the elapsed time is
        // one interval longer than maxTries alone would suggest.
        writeLog(`gave up waiting for "${selector}" after ${(maxTries + 1) * delay}ms`);
        resolve(null);
      }
    }, delay);
  });
}

/**
 * Clicks a given element and logs the task.
 * @param {HTMLElement} el - The element to click.
 */
function clickElement(el) {
  if (!el) {
    writeLog("clickElement called with null element");
    return;
  }

  el.click();
  writeLog(`clicked ${describeElement(el)}`);
}

/**
 * Fills a given input element and logs the task.
 * @param {HTMLElement} el - The input element.
 * @param {string} value - Value to set.
 */
function fillInputElement(el, value) {
  if (!el) {
    writeLog("fillInputElement called with null element");
    return;
  }

  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  writeLog(`filled ${describeElement(el)} with "${value}"`);
}

// Announce the page as soon as the script is injected, before any script's
// own delay, so the log shows the navigation order rather than the order in
// which each script happened to act. The background worker labels the entry
// with the sending tab's URL.
writeLog('content script injected');

// A wait that is still pending when the page navigates away goes silent,
// which previously looked like a stall. Record the teardown instead.
window.addEventListener('pagehide', () => writeLog('page unloaded'));

// Expose globally for all content scripts
window.writeLog = writeLog;
window.describeElement = describeElement;
window.waitForElement = waitForElement;
window.clickElement = clickElement;
window.fillInputElement = fillInputElement;
