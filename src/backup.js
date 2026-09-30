import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import crypto from 'crypto';

/**
 * Core Database & File Backup Engine
 */

export function compressData(buffer) {
  return zlib.gzipSync(buffer);
}

export function decompressData(buffer) {
  return zlib.gunzipSync(buffer);
}

export function encryptAES256(buffer, secretKey) {
  const iv = crypto.randomBytes(16);
  // Hash secretKey to 32 bytes
  const key = crypto.createHash('sha256').update(secretKey).digest();
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Prepend IV and Tag to encrypted payload
  return Buffer.concat([iv, tag, encrypted]);
}

export function generateBackupFilename(prefix = 'backup', ext = 'gz') {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-');
  return `${prefix}_${timestamp}.${ext}`;
}

export function validateLicenseKey(key) {
  if (!key || typeof key !== 'string') return false;
  const clean = key.trim().toUpperCase();
  return clean.startsWith('BKUP-PRO-') || clean.startsWith('BPS-PRO-') || /^[0-9]{8,12}$/.test(clean);
}

export function formatTelegramNotification(meta, isPro = false) {
  const sizeKb = (meta.sizeBytes / 1024).toFixed(2);
  let msg = `📦 *Automated Backup Success*\n\n`;
  msg += `• *Database / Target:* \`${meta.target}\`\n`;
  msg += `• *Backup File:* \`${meta.filename}\`\n`;
  msg += `• *Size:* \`${sizeKb} KB\`\n`;
  msg += `• *Timestamp:* \`${meta.timestamp}\`\n`;
  msg += `• *Encryption:* \`${isPro ? 'AES-256-GCM (Active)' : 'Standard GZIP'}\`\n\n`;

  if (isPro) {
    msg += `💎 *Pro License Active* | Multi-cloud dispatch enabled.\n`;
  } else {
    msg += `⚡ *Docker Backup Relay Free Tier*\n`;
    msg += `Unlock AES-256 Hardware Encryption & S3 Relay via Binance Pay ($25 USDT):\n`;
    msg += `*Binance UID: \`1049392123\`* (\`User-79a91\`)\n`;
  }

  return msg;
}
