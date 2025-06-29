/**
 * Automates clicking the "Acknowledge" button on https://cloud.oracle.com/*
 */
clickWhenAvailable(
  'button[aria-label="Acknowledge"],button',
  50,
  200,
  'click acknowledge',
  el => el.textContent.trim() === 'Acknowledge' && !el.disabled
);

// Utility to get current tenancy name from DOM
function getCurrentTenancy() {
  // Try user menu first
  const userMenu = document.querySelector('a[href="/tenancy"]');
  if (userMenu) {
    console.log('Found user menu:', userMenu.textContent);
    const match = userMenu.textContent.match(/Tenancy:\s*(\S+)/i);
    if (match) return match[1].trim().toLowerCase();
  }
  else {
    console.log('User menu not found, trying header');
  }

  return null;
}


// Only override tenancy if not already correct
function overrideTenancy(tenancy) {
  // Open profile menu and click "Override tenancy"
  waitForElement('#user-menu-button', 50, 200, 'open profile menu', el => el.getAttribute('aria-expanded') === 'false')
    .then(el => clickElement(el, 'open profile menu'));

  // Click "Override tenancy" menu
  waitForElement('#user-menu-override-tenancy', 50, 200, 'override tenancy')
    .then(el => clickElement(el, 'override tenancy'));

  // Fill input and submit
  waitForElement('input[id^="tenancyOverride-"]', 50, 200, 'filled override input')
    .then(el => fillInputElement(el, tenancy, 'filled override input'));

  waitForElement('button[type="submit"]', 50, 200, 'click override submit', b => b.textContent.trim() === "Override" && !b.disabled)
    .then(el => clickElement(el, 'click override submit'));
}

function ensureTenancy(tenancy) {
  const cur = getCurrentTenancy();
  console.log('Current tenancy:', cur);
  if (cur && cur === tenancy) {
    writeLog('tenancy already correct');
    return;
  }

  // overrideTenancy(tenancy);
}

const TARGET_TENANCY = 'generativeaitest';
ensureTenancy(TARGET_TENANCY);
