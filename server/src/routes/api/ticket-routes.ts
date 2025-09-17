// server/src/routes/api/tickets-routes.ts
import { Router } from 'express';
import { listTickets, getTicketById, createTicket, updateTicket, deleteTicket } from '../../controllers/ticket-controller.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.use(authenticateToken); // everything below requires a valid token
router.get('/', listTickets);
router.get('/:id', getTicketById);
router.post('/', createTicket);
router.put('/:id', updateTicket);
router.patch('/:id', updateTicket);
router.delete('/:id', deleteTicket);

export default router;
