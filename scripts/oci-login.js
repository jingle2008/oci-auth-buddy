/**
 * Automates steps 1 and 2 on https://login.oci.oraclecloud.com/*
 * 1. Click "Sign in with a different user account"
 * 2. Click "Continue"
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

clickWhenAvailable('.session-change', false, 50, 200, 'Step1: diff-account');
clickWhenAvailable('#submit-tenant', false, 50, 200, 'Step2: continue tenancy');
