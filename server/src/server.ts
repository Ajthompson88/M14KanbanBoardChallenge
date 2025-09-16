// server/src/server.ts
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { initDB } from './config/connection.js';
import routes from './routes/index.js'; // <-- single router that mounts /api/auth (public) and /api/* (protected)

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

// ---- middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- health checks
app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// ---- mount all routes once
// routes/index.ts should do:
//   router.use('/api/auth', authRoutes)                // public
//   router.use('/api', authenticateToken, apiRoutes)   // protected (tickets/users)
app.use('/', routes);

// 404 for unknown API routes (after routers)
app.use('/api/*', (_req, res) => res.status(404).json({ error: 'Not found' }));

// Centralized JSON error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const e = err as { status?: number; message?: string; stack?: string };
  const status = e?.status ?? 500;
  const isDev = process.env.NODE_ENV !== 'production';
  console.error('❌ Express error:', e);
  res.status(status).json({
    error: e?.message ?? 'Internal Server Error',
    ...(isDev ? { stack: e?.stack } : {}),
  });
});

async function start() {
  try {
    await initDB(); // connects, inits models, syncs
    const server = app.listen(PORT, () =>
      console.log(`🚀 Server running on :${PORT}`)
    );

    // graceful shutdown
    ['SIGINT', 'SIGTERM'].forEach((sig) => {
      process.on(sig as NodeJS.Signals, () => {
        console.log('🛑 Received %s, closing server...', sig);
        server.close(() => {
          console.log('✅ Server closed.');
          process.exit(0);
        });
      });
    });
  } catch (e) {
    console.error('💥 Fatal startup error:', e);
    process.exit(1);
  }
}

start();

export default app;
