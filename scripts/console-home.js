/**
 * Automates clicking the "Acknowledge" button on https://cloud.oracle.com/*
 */

const BOAT_TENANCY = "bmc_operator_access";
const TARGET_TENANCY = 'generativeaitest';

waitForElement(
  'button[aria-label="Acknowledge"],button',
  50,
  200,
  el => el.textContent.trim() === 'Acknowledge' && !el.disabled)
  .then(el => {
    if (el) clickElement(el);
    ensureTenancy(TARGET_TENANCY);
  });

function ensureTenancy(tenancy) {
  waitForElement('a[href="/tenancy"]', 50, 200,
    el => /tenancy:/i.test(el.innerText))
    .then(el => {
      if (!el) {
        writeLog('tenancy link not found, aborting');
        return;
      }

      const match = el.innerText.match(/Tenancy:\s*(\S+)/i);
      if (!match) {
        writeLog(`could not parse tenancy from: ${el.innerText}`);
        return;
      }

      const currentTenancy = match[1].trim().toLowerCase();
      writeLog(`Current tenancy: ${currentTenancy}`);

      if (currentTenancy !== BOAT_TENANCY) {
        writeLog('tenancy isn\'t boat, aborting');
        return;
      }

      overrideTenancy(tenancy);
    });
}

// Only override tenancy if not already correct
function overrideTenancy(tenancy) {
  // Open profile menu and click "Override tenancy"
  waitForElement('#user-menu-button', 50, 200,
    el => el.getAttribute('aria-expanded') === 'false')
    .then(el => {
      if (!el) {
        writeLog('profile menu button not found, aborting tenancy override');
        return;
      }

      clickElement(el);

      // Click "Override tenancy" menu
      waitForElement('#user-menu-override-tenancy', 50, 200)
        .then(el => {
          if (!el) {
            writeLog('"Override tenancy" menu item not found, aborting');
            return;
          }

          clickElement(el);

          // Fill input and submit
          waitForElement('input[id^="tenancyOverride-"]', 50, 200)
            .then(el => {
              if (!el) {
                writeLog('tenancy override input not found, aborting');
                return;
              }

              fillInputElement(el, tenancy);

              waitForElement('button[type="submit"]', 50, 200,
                b => b.textContent.trim() === "Override" && !b.disabled)
                .then(el => {
                  if (!el) {
                    writeLog('"Override" submit button not found, aborting');
                    return;
                  }

                  clickElement(el);
                });
            });
        });
    });
}
