// https://login.oci.oraclecloud.com/

// Sign in with a different user account
waitForElement('.session-change', 50, 200)
  .then(el => clickElement(el));

// Continue with default tenant
waitForElement('#submit-tenant', 50, 200)
  .then(el => clickElement(el));
