// "2026-10-02T17:06:38.389Z" -> "17:06:38.389"
function formatTime(time) {
  if (typeof time !== 'string') return '';
  const match = time.match(/T(\d{2}:\d{2}:\d{2}\.\d{3})/);
  return match ? match[1] : time;
}

function renderLogs(logs) {
  const logsDiv = document.getElementById('logs');
  logsDiv.textContent = '';

  if (!logs || !logs.length) {
    logsDiv.textContent = 'No logs found.';
    return;
  }

  // Built with textContent rather than innerHTML: log messages quote text
  // from the page being automated, which must not be parsed as markup.
  for (const entry of logs) {
    const row = document.createElement('div');
    row.className = 'log-entry';

    const meta = document.createElement('div');
    meta.className = 'timestamp';
    meta.textContent = [formatTime(entry.time), entry.page].filter(Boolean).join('  ');

    const body = document.createElement('div');
    body.textContent = entry.message || JSON.stringify(entry);

    row.append(meta, body);
    logsDiv.append(row);
  }
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
