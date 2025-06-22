/**
 * Automates step 3 on https://login.us-ashburn-1.oraclecloud.com/*
 * Clicks the "Continue" button (#submit-federation)
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

// Step 3: "Continue" (federation submit)
clickWhenAvailable('#submit-federation');
