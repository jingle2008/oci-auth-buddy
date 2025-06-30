// https://signon-int.oracle.com/signin

// Wait for the script to run
setTimeout(onPageReady, 500);

function onPageReady() {
  // Continue with default email
  const signInBtn = document.querySelector("'#idcs-signin-basic-signin-form-submit'");
  clickElement(signInBtn);

  // Continue with default passkey
  const fidoBtn = document.querySelector('#idcs-mfa-mfa-auth-fido-submit-button');
  clickElement(fidoBtn);

  // Close Bitwarden popup
  chrome.runtime.sendMessage({ type: 'CLOSE_BW' });
}
