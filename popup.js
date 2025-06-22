function renderLogs(logs) {
  const logsDiv = document.getElementById('logs');
  if (!logs || !logs.length) {
    logsDiv.textContent = 'No logs found.';
    return;
  }
  logsDiv.innerHTML = logs.map(entry => `
    <div class="log-entry">
      <div class="timestamp">${entry.time}</div>
      <div>${entry.label ? entry.label : JSON.stringify(entry)}</div>
    </div>
  `).join('');
}

function loadLogs() {
  chrome.storage.local.get('authLogs', (result) => {
    renderLogs(result.authLogs || []);
  });
}

function clearLogs() {
  chrome.storage.local.set({ authLogs: [] }, loadLogs);
}

document.getElementById('refresh').onclick = loadLogs;
document.getElementById('clear').onclick = clearLogs;

loadLogs();
