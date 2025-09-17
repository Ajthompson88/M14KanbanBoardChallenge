// server/src/routes/api/users-routes.ts
import { Router } from 'express';
import { listUsers, getUserById, createUser, updateUser, deleteUser } from '../../controllers/user-controller.js';

const router = Router();
router.get('/', listUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
