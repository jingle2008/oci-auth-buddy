/**
 * Automates steps 4–7 on https://signon-int.oracle.com/signin*
 * 4. Click "Next"
 * 5. Click "Show other sign-in options"
 * 6. Click "Passkey on chrome"
 * 7. Click "Verify passkey on device chrome"
 */

clickWhenAvailable('#idcs-signin-basic-signin-form-submit', 50, 200, 'Step4: next');
clickWhenAvailable('.idcs-signin-basic-signin-form-forgot-link', 50, 200, 'Step5: show other sign-in options');
clickWhenAvailable('button[data-idcs-device-display-name="chrome"]', 50, 200, 'Step6: passkey on chrome');
clickWhenAvailable('#idcs-mfa-mfa-auth-fido-submit-button', 50, 200, 'Step7: verify passkey on device chrome');
