import test from 'node:test';
import assert from 'node:assert/strict';
import {
  compressData,
  decompressData,
  encryptAES256,
  generateBackupFilename,
  validateLicenseKey,
  formatTelegramNotification
} from '../src/backup.js';

test('Docker Backup Relay - Core Backup Engine Tests', async (t) => {
  await t.test('compressData and decompressData preserve data integrity', () => {
    const raw = Buffer.from('CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT);');
    const compressed = compressData(raw);
    assert.ok(compressed.length > 0);
    const restored = decompressData(compressed);
    assert.equal(restored.toString(), raw.toString());
  });

  await t.test('encryptAES256 generates encrypted buffer with IV and Tag', () => {
    const data = Buffer.from('SUPER_SECRET_DATABASE_PASSWORD');
    const encrypted = encryptAES256(data, 'passphrase123');
    assert.ok(encrypted.length > data.length);
    assert.notEqual(encrypted.toString(), data.toString());
  });

  await t.test('generateBackupFilename creates timestamped filename', () => {
    const filename = generateBackupFilename('postgres', 'sql.gz');
    assert.ok(filename.startsWith('postgres_'));
    assert.ok(filename.endsWith('.sql.gz'));
  });

  await t.test('validateLicenseKey validates official Binance UID and Pro keys', () => {
    assert.equal(validateLicenseKey('BKUP-PRO-ALPHA-1234'), true);
    assert.equal(validateLicenseKey('1049392123'), true); // Binance UID
    assert.equal(validateLicenseKey(''), false);
    assert.equal(validateLicenseKey('invalid_key'), false);
  });

  await t.test('formatTelegramNotification includes Binance Pay UID in free tier', () => {
    const meta = {
      target: 'Production PostgreSQL',
      filename: 'db_2026.sql.gz',
      sizeBytes: 10240,
      timestamp: '2026-09-30T20:00:00.000Z'
    };
    const msg = formatTelegramNotification(meta, false);
    assert.ok(msg.includes('Automated Backup Success'));
    assert.ok(msg.includes('1049392123'), 'Must feature Binance Pay UID');
  });
});
