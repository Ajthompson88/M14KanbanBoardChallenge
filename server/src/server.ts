// server/src/server.ts
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { sequelize } from './models/index.js';
import apiRoutes from './routes/api/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
app.use(express.json());
app.use(cookieParser());

// API routes first
app.use('/api', apiRoutes);
app.get('/health', (_req, res) => res.json({ ok: true }));

// Serve the React build (client/dist) from the same service
const __dirname = path.dirname(fileURLToPath(import.meta.url));      // .../server/dist
const clientDist = path.resolve(__dirname, '../../client/dist');     // adjust path
app.use(express.static(clientDist));
app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.authenticate();

    // First deploy or schema changes (temporary): set DB_SYNC=true in Render env
    if (String(process.env.DB_SYNC || '').toLowerCase() === 'true') {
      console.log('Syncing DB schema (DB_SYNC=true)…');
      await sequelize.sync(); // or sync({ alter: true }) during dev
    }

    app.listen(PORT, () => console.log(`Server running on :${PORT}`));
  } catch (err) {
    console.error('DB bootstrap failed:', err);
    process.exit(1);
  }
})();
