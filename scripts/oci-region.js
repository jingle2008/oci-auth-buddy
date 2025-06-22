/**
 * Automates step 3 on https://login.us-ashburn-1.oraclecloud.com/*
 * Clicks the "Continue" button (#submit-federation)
 */

clickWhenAvailable(
  '#submit-federation',
  50,
  200,
  'Step3: continue federation/sso',
  el => !el.disabled && el.offsetParent !== null
);
