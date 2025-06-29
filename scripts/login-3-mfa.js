// https://signon-int.oracle.com/signin

// Continue with default email
waitForElement('#idcs-signin-basic-signin-form-submit', 50, 200)
  .then(el => clickElement(el));

// Continue with default passkey
waitForElement('#idcs-mfa-mfa-auth-fido-submit-button', 50, 200)
  .then(el => clickElement(el));


/**
 * url: chrome-extension://nngceckbapebfimnlniiiahkandclblb/popup/index.html?uilocation=popout&singleActionPopout=vault_Fido2Popout_21669ce1-2ace-4b8a-84cc-e71c40efa1a9#/fido2?sessionId=21669ce1-2ace-4b8a-84cc-e71c40efa1a9&fallbackSupported=true&senderTabId=1339369976&senderUrl=https:%2F%2Flogin.us-phoenix-1.idp.mc1.oracleiaas.com%2Fsignin.html
 * el: div.auth-flow
 * text: No passkeys found for this application.
 */