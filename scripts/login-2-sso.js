// https://login.us-ashburn-1.oraclecloud.com/

// Wait for the script to run
setTimeout(onPageReady, 500);

function isButtonReady(el) {
  return !el.disabled && el.offsetParent !== null
}

function onPageReady() {
  // Continue SSO with SAML as provider
  const submitBtn = document.querySelector("#submit-federation");
  if (isButtonReady(submitBtn)) {
    clickElement(submitBtn);
  } else {
    // TODO: need to check other buttons
    // This is not hit right now
    waitForElement('#submit-federation', 0, 200, isButtonReady)
      .then(el => clickElement(el));
  }
}

