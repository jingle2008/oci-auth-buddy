// https://login.oci.oraclecloud.com/

// Wait for the script to run
setTimeout(onPageReady, 500);

function onPageReady() {
  // Sign in with a different user account
  const changeBtn = document.querySelector('.session-change');
  clickElement(changeBtn);

  const submitBtn = document.querySelector('#submit-tenant');
  clickElement(submitBtn);
}
