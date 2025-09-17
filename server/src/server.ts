// server/src/server.ts
import 'dotenv/config';                 // <- load .env FIRST
import express from 'express';
import cookieParser from 'cookie-parser';
import { sequelize } from './models/index.js'; // models read env already
import apiRoutes from './routes/api/index.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api', apiRoutes);
app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync(); // enable in dev if needed
    app.listen(PORT, () => console.log(`Server running on :${PORT}`));
  } catch (e) {
    console.error('DB bootstrap failed:', e);
    process.exit(1);
  }
})();
