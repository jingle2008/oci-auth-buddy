/**
 * Automates steps 4–7 on https://signon-int.oracle.com/signin*
 * 4. Click "Next"
 * 5. Click "Show other sign-in options"
 * 6. Click "Passkey on chrome"
 * 7. Click "Verify passkey on device chrome"
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

// Step 4: "Next"
clickWhenAvailable('#idcs-signin-basic-signin-form-submit');

// Step 5: "Show other sign-in options"
clickWhenAvailable('.idcs-signin-basic-signin-form-forgot-link');

// Step 6: "Passkey on chrome" (tile)
clickWhenAvailable('button[data-idcs-device-display-name="chrome"]');

// Step 7: "Verify passkey on device chrome"
clickWhenAvailable('#idcs-mfa-mfa-auth-fido-submit-button');
