/**
 * Automates steps 4–7 on https://signon-int.oracle.com/signin*
 * 4. Click "Next"
 * 5. Click "Show other sign-in options"
 * 6. Click "Passkey on chrome"
 * 7. Click "Verify passkey on device chrome"
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

clickWhenAvailable('#idcs-signin-basic-signin-form-submit', false, 50, 200, 'Step4: next');
clickWhenAvailable('.idcs-signin-basic-signin-form-forgot-link', false, 50, 200, 'Step5: show other sign-in options');
clickWhenAvailable('button[data-idcs-device-display-name="chrome"]', false, 50, 200, 'Step6: passkey on chrome');
clickWhenAvailable('#idcs-mfa-mfa-auth-fido-submit-button', false, 50, 200, 'Step7: verify passkey on device chrome');
