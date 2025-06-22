/**
 * Closes the window if "Authorization completed!" is detected on http://localhost:8181/*
 */

function lookForCompletion() {
  if (/authorization completed!/i.test(document.body.innerText)) {
    logStep('Step8: Authorization completed, closing tab');
    chrome.runtime.sendMessage({ type: 'CLOSE_ME' });
    return true;
  }
  return false;
}

(function () {
  let tries = 0;
  const poll = setInterval(() => {
    if (lookForCompletion()) {
      clearInterval(poll);
    } else if (++tries > 20) {
      clearInterval(poll);
      logStep('Step8: completion text not found in 5s');
    }
  }, 250);
})();
