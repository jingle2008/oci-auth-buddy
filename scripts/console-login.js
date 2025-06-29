/**
 * Automates clicking the "Next" button on https://www.oracle.com/cloud/sign-in.html*
 */
waitForElement(
  '#cloudAccountButton',
  50,
  200,
  el => !el.classList.contains('inActive'))
  .then(el => clickElement(el));
