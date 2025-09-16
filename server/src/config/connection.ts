// server/src/config/connection.ts
import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initModels } from '../models/index.js';

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

export const sequelize = new Sequelize(URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: shouldUseSSL ? { ssl: { require: true, rejectUnauthorized: false } } : undefined,
});

export async function initDB(): Promise<void> {
  console.log('🔌 Connecting DB...');
  await sequelize.authenticate();
  initModels(sequelize);   // <-- initialize models here
  await sequelize.sync();  // or { alter: true } while developing
  console.log('✅ DB ready');
}

export default sequelize;
