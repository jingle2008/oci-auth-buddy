// https://login.us-ashburn-1.oraclecloud.com/

// Continue SSO with SAML as provider
waitForElement('#submit-federation', 50, 200,
  el => !el.disabled && el.offsetParent !== null)
  .then(el => clickElement(el));
