/**
 * Closes the window if "Authorization completed!" is detected on http://localhost:8181/*
 */

waitForElement("body", 5, 200,
  el => el.innerText.length > 0)
  .then(el => {
    // The waiter resolves to null when it gives up, which happens whenever
    // the page renders its text later than the poll budget allows.
    if (!el) {
      writeLog('body text never appeared, leaving the tab open');
      return;
    }

    if (/authorization completed!/i.test(el.innerText)) {
      writeLog('Authorization completed, closing tab');
      chrome.runtime.sendMessage({ type: 'CLOSE_ME' });
    } else {
      writeLog(`Unexpected body text: ${el.innerText}`)
    }
  });
