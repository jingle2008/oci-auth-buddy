/**
 * Clicks an element when it becomes available.
 * @param {string} selector - CSS selector for the element to click.
 * @param {number} [maxTries=50] - Max attempts before giving up.
 * @param {number} [delay=200] - Delay between attempts (ms).
 * @param {string} [label=''] - Optional label for logging.
 */
function logStep(label, extra = {}) {
  try {
    chrome.runtime.sendMessage({ type: 'STEP_LOG', payload: { label, ...extra }});
  } catch (e) {}
}

function clickWhenAvailable(selector, maxTries = 50, delay = 200, label = '') {
  let tries = 0;
  const timer = setInterval(() => {
    const el = document.querySelector(selector);
    if (el) {
      el.click();
      clearInterval(timer);
      if (label) logStep(label);
    } else if (++tries > maxTries) {
      clearInterval(timer);
      if (label) logStep(`${label} – NOT FOUND`);
    }
  }, delay);
}

// Expose globally for all content scripts
window.logStep = logStep;
window.clickWhenAvailable = clickWhenAvailable;
