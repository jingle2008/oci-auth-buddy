/**
 * Automates clicking the "Acknowledge" button on https://cloud.oracle.com/*
 */
clickWhenAvailable(
  'button[aria-label="Acknowledge"],button',
  50,
  200,
  'Click acknowledge button in OCI Cloud Console',
  el => el.textContent.trim() === 'Acknowledge' && !el.disabled
);
