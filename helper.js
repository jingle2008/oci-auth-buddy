const appTag = '[auth-buddy]';

function writeLog(message) {
  try {
    chrome.runtime.sendMessage({ type: 'WRITE_LOG', payload: message });
  } catch (e) {
    console.warn(appTag, 'Failed to log task:', e);
  }
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

    // Immediate first check
    const qs = sel => document.querySelector(sel);
    const check = () => {
      const el = qs(selector);
      writeLog(`waiting for element with selector: ${selector}`);
      if (el && (!predicate || predicate(el))) {
        cleanup();
        resolve(el);
        return true;
      }
      return false;
    };

    if (check()) return;

    timer = setInterval(() => {
      if (finished) return;

      if (check()) return;

      if (++tries > maxTries) {
        cleanup();
        writeLog(`element with selector ${selector} not found after ${maxTries * delay}ms`);
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
  writeLog("clicked element successfully");
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
  writeLog("filled input element successfully", { value });
}

// Expose globally for all content scripts
window.writeLog = writeLog;
window.waitForElement = waitForElement;
window.clickElement = clickElement;
window.fillInputElement = fillInputElement;
