// https://login.us-ashburn-1.oraclecloud.com/

// The page may render the domain submit or the federation submit button,
// depending on which step of the SSO flow it is on, so wait for either one.
const SUBMIT_SELECTOR = '#submit-domain, #submit-federation';

function isButtonReady(el) {
  return !!el && !el.disabled && el.offsetParent !== null;
}

waitForElement(SUBMIT_SELECTOR, 50, 200, isButtonReady)
  .then(el => clickElement(el));
