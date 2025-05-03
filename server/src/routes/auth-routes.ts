import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (_req: Request, _res: Response) => {
  const { username, password } = _req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) {
    return _res.status(400).json({ message: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return _res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: '1h' }
  );

 // _res.json({ token });
  return _res.json({ token });
};

const router = Router();
// POST /auth/login
router.post('/login', login);

export default router;
