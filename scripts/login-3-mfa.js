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

function watchForBitwardenPopup() {
  writeLog('asking the worker to watch for the Bitwarden popup');
  chrome.runtime.sendMessage({ type: 'CLOSE_BW' });
}

// The watch is armed before the click, not after: Bitwarden opens its popup
// as soon as the passkey prompt appears, and a watch armed afterwards can
// miss the tab creation and then wait for a popup that already exists.
function clickPasskey(btn) {
  watchForBitwardenPopup();
  clickElement(btn);
}

// The sign-in step and the passkey step can share one document, since JET
// swaps the form in place without a navigation. So click whichever button is
// ready, and if it was the sign-in button, keep waiting for the passkey one.
waitForElement(`${nativeButton(SIGN_IN_SELECTOR)}, ${nativeButton(FIDO_SELECTOR)}`, 50, 200, isButtonReady)
  .then(btn => {
    if (!btn) return;

    if (btn.closest(FIDO_SELECTOR)) {
      clickPasskey(btn);
      return;
    }

    clickElement(btn);

    return waitForElement(nativeButton(FIDO_SELECTOR), 50, 200, isButtonReady)
      .then(fidoBtn => {
        if (!fidoBtn) {
          writeLog('passkey button never became ready');
          // Signing in can raise the Bitwarden popup on its own.
          watchForBitwardenPopup();
          return;
        }

        clickPasskey(fidoBtn);
      });
  });
