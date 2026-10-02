// https://signon-int.oracle.com/signin
// https://signon.oci.oracleiaas.com/signin

// These are Oracle JET <oj-button> custom elements. The id sits on the
// wrapper, but the clickable target is the native <button> that JET renders
// inside it, and that inner button only exists once JET has upgraded the
// wrapper. Clicking the wrapper before then does nothing, and clicking the
// wrapper at all does not necessarily raise the component's action event.
const SIGN_IN_SELECTOR = '#idcs-signin-basic-signin-form-submit';
const FIDO_SELECTOR = '#idcs-mfa-mfa-auth-fido-submit-button';

function innerButton(el) {
  return el.matches('button') ? el : el.querySelector('button');
}

function isButtonReady(el) {
  const btn = innerButton(el);
  return !!btn
    && !btn.disabled
    && !el.classList.contains('oj-disabled')
    && el.offsetParent !== null;
}

function clickButton(el) {
  clickElement(innerButton(el));
}

function closeBitwardenPopup() {
  writeLog('requesting Bitwarden popup close');
  chrome.runtime.sendMessage({ type: 'CLOSE_BW' });
}

// The sign-in step and the passkey step can share one document, since JET
// swaps the form in place without a navigation. So click whichever button is
// ready, and if it was the sign-in button, keep waiting for the passkey one.
waitForElement(`${SIGN_IN_SELECTOR}, ${FIDO_SELECTOR}`, 50, 200, isButtonReady)
  .then(el => {
    if (!el) return;

    clickButton(el);

    if (el.matches(FIDO_SELECTOR)) {
      closeBitwardenPopup();
      return;
    }

    waitForElement(FIDO_SELECTOR, 50, 200, isButtonReady)
      .then(fidoEl => {
        if (!fidoEl) return;

        clickButton(fidoEl);
        closeBitwardenPopup();
      });
  });
