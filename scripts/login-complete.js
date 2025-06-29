/**
 * Closes the window if "Authorization completed!" is detected on http://localhost:8181/*
 */

waitForElement("body", 50, 200,
  el => el.innerText.length > 0)
  .then(el => {
    if (/authorization completed!/i.test(el.innerText)) {
      writeLog('Authorization completed, closing tab');
      chrome.runtime.sendMessage({ type: 'CLOSE_ME' });
    } else {
      writeLog(`Unexpected body text: ${el.innerText}`)
    }
  });