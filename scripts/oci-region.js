/**
 * Automates step 3 on https://login.us-ashburn-1.oraclecloud.com/*
 * Clicks the "Continue" button (#submit-federation)
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

clickWhenAvailable('#submit-federation', false, 50, 200, 'Step3: continue federation');
