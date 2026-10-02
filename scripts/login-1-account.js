// https://login.oci.oraclecloud.com/

const CHANGE_SELECTOR = '.session-change';
const SUBMIT_SELECTOR = '#submit-tenant';

function isReady(el) {
  return !el.disabled && el.offsetParent !== null;
}

// The account link is optional: there may be no previous session to change,
// so it gets a short budget to avoid stalling the flow. The tenancy submit
// button is required and may only appear in response to that first click, so
// it is waited for rather than queried in the same tick.
waitForElement(CHANGE_SELECTOR, 10, 200, isReady)
  .then(el => {
    if (el) clickElement(el);
    return waitForElement(SUBMIT_SELECTOR, 50, 200, isReady);
  })
  .then(el => {
    if (el) clickElement(el);
  });
