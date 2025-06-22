/**
 * Clicks an element when it becomes available.
 * @param {string} selectorOrText - CSS selector or button/link text (case-insensitive).
 * @param {boolean} [byText=false] - If true, match by text content; else, use querySelector.
 * @param {number} [maxTries=50] - Max attempts before giving up.
 * @param {number} [delay=200] - Delay between attempts (ms).
 */
function logStep(label, extra = {}) {
  try {
    chrome.runtime.sendMessage({ type: 'STEP_LOG', payload: { label, ...extra }});
  } catch (e) {}
}

function clickWhenAvailable(selectorOrText, byText = false, maxTries = 50, delay = 200, label = '') {
  let tries = 0;
  const timer = setInterval(() => {
    let el;
    if (byText) {
      el = [...document.querySelectorAll('button, a, input[type="submit"]')]
        .find(e => e.textContent.trim().toLowerCase() === selectorOrText.toLowerCase());
    } else {
      el = document.querySelector(selectorOrText);
    }
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
