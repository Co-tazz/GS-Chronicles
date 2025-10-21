const fs = require('fs');
const path = require('path');
const COLORS = {
  INFO: '\x1b[32m', // green
  WARN: '\x1b[33m', // yellow
  ERROR: '\x1b[31m', // red
  RESET: '\x1b[0m',
};

const LOG_FILE = process.env.LOG_FILE || path.join(process.cwd(), 'logs', 'app.log');
let logFileReady = false;
function ensureLogFileReady() {
  if (logFileReady) return true;
  try {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, '');
    logFileReady = true;
    return true;
  } catch (_) {
    logFileReady = false;
    return false;
  }
}

function log(level, message, meta) {
  const ts = new Date().toISOString();
  const payload = meta ? ` ${JSON.stringify(meta)}` : '';
  const color = COLORS[level] || COLORS.INFO;
  const icon = level === 'INFO' ? '✅' : level === 'WARN' ? '⚠️' : '❌';
  console.log(`${color}[${ts}] [${level}] ${icon} ${message}${payload}${COLORS.RESET}`);
  // Write structured JSON line to file
  if (ensureLogFileReady()) {
    const line = JSON.stringify({ timestamp: ts, level, message, ...(meta ? { meta } : {}) }) + '\n';
    try {
      fs.appendFile(LOG_FILE, line, () => {});
    } catch (_) {
      // ignore file write errors
    }
  }
}

module.exports = {
  info: (msg, meta) => log('INFO', msg, meta),
  warn: (msg, meta) => log('WARN', msg, meta),
  error: (msg, meta) => log('ERROR', msg, meta),
};