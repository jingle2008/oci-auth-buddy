// https://signon-int.oracle.com/signin
// https://signon.oci.oracleiaas.com/signin

// These buttons are Oracle JET <oj-button> custom elements. The id is on the
// wrapper, but the clickable target is the native <button> JET renders inside
// it, so each selector matches that inner button directly: the element handed
// back is then the one clicked, with no second lookup that a re-render could
// invalidate, and a wrapper JET has not upgraded yet simply does not match.
const SIGN_IN_SELECTOR = '#idcs-signin-basic-signin-form-submit';
const FIDO_SELECTOR = '#idcs-mfa-mfa-auth-fido-submit-button';

// Matches the inner native button, or the element itself if the page uses a
// plain <button> under that id.
function nativeButton(selector) {
  return `${selector} button, button${selector}`;
}

function isButtonReady(btn) {
  const wrapper = btn.closest('oj-button');
  return !btn.disabled
    && btn.offsetParent !== null
    && !(wrapper && wrapper.classList.contains('oj-disabled'));
}

function closeBitwardenPopup() {
  writeLog('requesting Bitwarden popup close');
  chrome.runtime.sendMessage({ type: 'CLOSE_BW' });
}

// The sign-in step and the passkey step can share one document, since JET
// swaps the form in place without a navigation. So click whichever button is
// ready, and if it was the sign-in button, keep waiting for the passkey one.
waitForElement(`${nativeButton(SIGN_IN_SELECTOR)}, ${nativeButton(FIDO_SELECTOR)}`, 50, 200, isButtonReady)
  .then(btn => {
    if (!btn) return;

    clickElement(btn);

    if (btn.closest(FIDO_SELECTOR)) {
      closeBitwardenPopup();
      return;
    }

    return waitForElement(nativeButton(FIDO_SELECTOR), 50, 200, isButtonReady)
      .then(fidoBtn => {
        if (fidoBtn) {
          clickElement(fidoBtn);
        } else {
          writeLog('passkey button never became ready');
        }

        // Sent either way: signing in can raise the Bitwarden popup on its
        // own, and leaving it open blocks whatever the flow does next.
        closeBitwardenPopup();
      });
  });
