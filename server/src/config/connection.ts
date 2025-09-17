// server/src/config/connection.ts
import { sequelize } from '../models/index.js';
import { config } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';


// Load .env no matter where the process starts
const CWD = process.cwd();
const HERE = dirname(fileURLToPath(import.meta.url));  // .../server/dist/config
const SERVER_DIR = resolve(HERE, '..', '..');          // .../server

for (const p of [
  resolve(CWD, 'server/.env'), // running from repo root
  resolve(CWD, '.env'),        // running from /server
  resolve(SERVER_DIR, '.env'), // fallback based on file location
]) {
  config({ path: p, override: false });
}

const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
const shouldUseSSL = isProd || String(process.env.DB_SSL || '').toLowerCase() === 'true';

const URL = process.env.DATABASE_URL || process.env.DB_URL;
if (!URL) {
  throw new Error('DATABASE_URL (or DB_URL) not set. Put your Render **External** connection string in server/.env');
}
if (shouldUseSSL && !URL.includes('sslmode=require') && !URL.includes('sslmode=disable')) {
  // ensure SSL is used if we are in production or DB_SSL=true
  const hasQuery = URL.includes('?');
  const sep = hasQuery ? '&' : '?';
  process.env.DATABASE_URL = URL + sep + 'sslmode=require';
}

export default sequelize;
