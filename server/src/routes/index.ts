import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public auth endpoints (no token required):
router.use('/auth', authRoutes);

// Protected API (tickets, users, etc.):
router.use('/api', authenticateToken, apiRoutes);

export default router;
