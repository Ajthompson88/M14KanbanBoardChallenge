// server/src/routes/api/index.ts
import { Router } from 'express';
import authRoutes from '../auth-routes.js';
import userRoutes from './user-routes.js';     // <-- default import (rename from userRouter)
import ticketRoutes from './ticket-routes.js';

const router = Router();
router.use('/auth', authRoutes);
router.use('/users', userRoutes);              // <-- use userRoutes
router.use('/tickets', ticketRoutes);

export default router;
