/**
 * Automates steps 1 and 2 on https://login.oci.oraclecloud.com/*
 * 1. Click "Sign in with a different user account"
 * 2. Click "Continue"
 */

// Helper (inlined for content script compatibility)
function clickWhenAvailable(selectorOrText, byText = false, maxTries = 50, delay = 200) {
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
    } else if (++tries > maxTries) {
      clearInterval(timer);
    }
  }, delay);
}

// Step 1: "Sign in with a different user account"
clickWhenAvailable('.session-change');

// Step 2: "Continue" (tenancy submit)
clickWhenAvailable('#submit-tenant');
