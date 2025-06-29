/**
 * Automates clicking the "Acknowledge" button on https://cloud.oracle.com/*
 */

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
      const match = el.textContent.match(/Tenancy:\s*(\S+)/i);
      const currentTenancy = match[1].trim().toLowerCase();
      writeLog(`Current tenancy: ${currentTenancy}`);

      if (currentTenancy === tenancy) {
        writeLog('tenancy already correct, aborting');
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
      clickElement(el);

      // Click "Override tenancy" menu
      waitForElement('#user-menu-override-tenancy', 50, 200)
        .then(el => {
          clickElement(el);

          // Fill input and submit
          waitForElement('input[id^="tenancyOverride-"]', 50, 200)
            .then(el => {
              fillInputElement(el, tenancy);

              waitForElement('button[type="submit"]', 50, 200,
                b => b.textContent.trim() === "Override" && !b.disabled)
                .then(el => clickElement(el));
            });
        });
    });
}



