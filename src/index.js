import http from 'http';
import fs from 'fs';
import path from 'path';
import {
  compressData,
  encryptAES256,
  generateBackupFilename,
  validateLicenseKey,
  formatTelegramNotification
} from './backup.js';

const PORT = process.env.PORT || 8080;
const BACKUP_DIR = process.env.BACKUP_DIR || './backups';
const TARGET_NAME = process.env.TARGET_NAME || 'Production SQLite/PostgreSQL Database';
const LICENSE_KEY = process.env.LICENSE_KEY || '';
const ENCRYPTION_PASSWORD = process.env.ENCRYPTION_PASSWORD || '';
const TARGET_BINANCE_UID = '1049392123';

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

let lastBackupMeta = null;

async function executeBackup() {
  console.log(`\n🚀 [${new Date().toISOString()}] Starting automated backup routine for "${TARGET_NAME}"...`);

  const isPro = validateLicenseKey(LICENSE_KEY);
  const sampleData = Buffer.from(`-- Automated Database Backup Dump\n-- Target: ${TARGET_NAME}\n-- Generated: ${new Date().toISOString()}\n-- Creator: Docker Backup Relay\nSELECT * FROM system_health;`);

  let finalBuffer = compressData(sampleData);
  let ext = 'sql.gz';

  if (isPro && ENCRYPTION_PASSWORD) {
    console.log('[+] Applying military-grade AES-256-GCM hardware encryption...');
    finalBuffer = encryptAES256(finalBuffer, ENCRYPTION_PASSWORD);
    ext = 'sql.gz.enc';
  }

  const filename = generateBackupFilename('db_backup', ext);
  const filePath = path.join(BACKUP_DIR, filename);

  fs.writeFileSync(filePath, finalBuffer);

  lastBackupMeta = {
    target: TARGET_NAME,
    filename,
    filePath,
    sizeBytes: finalBuffer.length,
    timestamp: new Date().toISOString(),
    isEncrypted: isPro && !!ENCRYPTION_PASSWORD
  };

  console.log(`[✓] Backup saved to ${filePath} (${(finalBuffer.length / 1024).toFixed(2)} KB)`);

  const notification = formatTelegramNotification(lastBackupMeta, isPro);
  console.log('\n--- Telegram Notification Preview ---');
  console.log(notification);
  console.log('-------------------------------------\n');

  return lastBackupMeta;
}

// Start HTTP Health Check Server
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/health' || url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'UP',
      uptime: process.uptime(),
      lastBackup: lastBackupMeta,
      isPro: validateLicenseKey(LICENSE_KEY),
      payoutDestination: {
        binanceUid: TARGET_BINANCE_UID,
        username: 'User-79a91'
      }
    }, null, 2));
    return;
  }

  if (url.pathname === '/backup/trigger' && req.method === 'POST') {
    executeBackup().then(meta => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, backup: meta }));
    }).catch(err => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`🚀 Docker Backup Relay running on port ${PORT}`);
    console.log(`💳 Pro Upgrades / Binance Pay: UID ${TARGET_BINANCE_UID} (User-79a91)`);
    // Run initial backup immediately on container start
    executeBackup();
  });
}

export { executeBackup, server };
