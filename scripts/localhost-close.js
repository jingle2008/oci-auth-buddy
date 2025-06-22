/**
 * Closes the window if "Authorization completed!" is detected on http://localhost:8181/*
 */
(function () {
  if (/authorization completed!/i.test(document.body.innerText)) {
    setTimeout(() => window.close(), 300);
  }
})();
