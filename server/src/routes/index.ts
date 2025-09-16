import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * Keep EVERYTHING under /api so it matches the client baseURL.
 * Make /api/auth public (login/signup), and protect the rest of /api/*.
 */

// Public auth endpoints (no token required):
router.use('/api/auth', authRoutes);

// Protected API (tickets, users, etc.):
router.use('/api', authenticateToken, apiRoutes);

export default router;
