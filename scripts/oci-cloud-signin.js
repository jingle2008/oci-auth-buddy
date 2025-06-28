/**
 * Automates clicking the "Next" button on https://www.oracle.com/cloud/sign-in.html*
 */
clickWhenAvailable(
  '#cloudAccountButton',
  50,
  200,
  'Sign in to Oracle Cloud using default account',
  el => !el.classList.contains('inActive')
);
