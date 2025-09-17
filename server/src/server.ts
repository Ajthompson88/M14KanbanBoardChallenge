// server/src/server.ts
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// --- DB init (your existing connection bootstrap) ---
import './config/connection.js';

// --- Routers ---
import { ticketRouter } from './routes/api/ticket-routes.js';
import { userRouter } from './routes/api/user-routes.js';
import  authRouter  from './routes';  // This should now work

// ----- App setup -----
const app = express();

// Render/Proxies
app.set('trust proxy', 1);

// CORS:
// If you deploy client & API together (same origin), you can leave origin: true.
// If separate, list allowed origins explicitly.
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ----- Health checks -----
app.get('/health', (_req, res) => res.status(200).json({ ok: true }));
app.get('/ready', (_req, res) => res.status(200).json({ ready: true }));

// ----- API routes (mount BEFORE static) -----
app.use('/tickets', ticketRouter);
app.use('/users',   userRouter);
app.use('/auth',    authRouter);

// If you like a common prefix, you can instead do:
// app.use('/api/tickets', ticketsRouter); etc.
// and adjust the client to call /api/*

// ----- Error handling: always JSON -----
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message =
    err.message ||
    (status === 401 ? 'Unauthorized' : 'Something went wrong');
  res.status(status).json({ error: message });
});

// ===== Serve React build (client/dist) =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// When compiled, this file sits at server/dist/server.js
// So client/dist relative path is: ../../client/dist
const clientDist = path.join(__dirname, '../../client/dist');

// Serve static files
app.use(express.static(clientDist));

// SPA fallback for any non-API route
app.get('*', (req, res, next) => {
  // allow API 404s to pass through
  if (
    req.path.startsWith('/tickets') ||
    req.path.startsWith('/users') ||
    req.path.startsWith('/auth') ||
    req.path.startsWith('/health') ||
    req.path.startsWith('/ready')
  ) {
    return next();
  }
  res.sendFile(path.join(clientDist, 'index.html'));
});

// ----- Start server -----
const PORT = Number(process.env.PORT) || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on :${PORT}`);
});
