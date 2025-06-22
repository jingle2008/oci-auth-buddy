/**
 * Closes the window if "Authorization completed!" is detected on http://localhost:8181/*
 */
(function () {
  function logStep(label, extra = {}) {
    try {
      chrome.runtime.sendMessage({ type: 'STEP_LOG', payload: { label, ...extra }});
    } catch (e) {}
  }
  if (/authorization completed!/i.test(document.body.innerText)) {
    logStep('Step8: Authorization completed, closing window');
    setTimeout(() => window.close(), 300);
  }
})();
