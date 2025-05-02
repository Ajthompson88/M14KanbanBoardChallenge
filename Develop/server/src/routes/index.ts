import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public auth endpoints
router.use('/auth', authRoutes);

// All /api routes now require a valid JWT
router.use('/api', authenticateToken, apiRoutes);

export default router;
