# OCI Auth Buddy

A Chrome extension to automate Oracle Cloud authentication tasks.

## Features

Clicks through the authentication screens, one content script per page:

| Page | What it does |
| --- | --- |
| `www.oracle.com/cloud/sign-in.html` | "Next" on the cloud account step |
| `login.oci.oraclecloud.com` | "Sign in with a different user account", then the tenancy submit |
| `login.us-ashburn-1.oraclecloud.com` | the domain or federation submit, whichever the step shows |
| `signon-int.oracle.com`, `signon.oci.oracleiaas.com` | the sign-in submit, then "Verify passkey on device", then closes the Bitwarden popup |
| `localhost:8181` | closes the tab once "Authorization completed!" appears |
| `cloud.oracle.com` | "Acknowledge", then overrides the tenancy when the current one is the operator-access tenancy |

Every action is logged. Click the extension icon to read the log, which
records the page, the element and why a wait gave up.

## Installation

1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions`.
3. Enable **Developer mode** (toggle in the top right).
4. Click **Load unpacked** and select the `oci-auth-buddy` folder.

## Usage

- Navigate through your normal Oracle Cloud authentication flow.
- The extension will automatically click the required buttons/links for you.
- On the final localhost page, the window will close automatically.

## File Structure

```
oci-auth-buddy/
├── manifest.json          page-to-script mapping and permissions
├── helper.js              element waiting, clicking, filling, logging
├── background.js          service worker: log store, tab and popup closing
├── popup.html, popup.js   log viewer
└── scripts/
    ├── console-login.js   www.oracle.com cloud sign-in
    ├── login-1-account.js account selection
    ├── login-2-sso.js     domain and federation submit
    ├── login-3-mfa.js     sign-in and passkey
    ├── login-complete.js  closes the tab at the end of the flow
    └── console-home.js    acknowledge and tenancy override
```

## Notes

- All selectors are based on the provided sample HTML. If Oracle changes their login pages, you may need to update the selectors in the scripts.
- The target tenancy in `scripts/console-home.js` is hardcoded; edit it there.
- No data is sent anywhere; all logic runs locally in your browser.
