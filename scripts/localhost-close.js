/**
 * Closes the window if "Authorization completed!" is detected on http://localhost:8181/*
 */
(function () {
  if (/authorization completed!/i.test(document.body.innerText)) {
    logStep('Step8: Authorization completed, closing tab');
    chrome.runtime.sendMessage({ type: 'CLOSE_ME' });
  }
})();
