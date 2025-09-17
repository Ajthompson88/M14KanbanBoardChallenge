// server/src/routes/auth-routes.ts
import { Router } from 'express';
import { User } from '../models/index.js'; // adjust path if under routes/api
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authenticateToken, getUser } from '../middleware/auth.js';

const router = Router();

router.get('/me', authenticateToken, (req, res) => {
  const u = getUser(req);
  return res.json(u); // { id, email, username }
});

router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body ?? {};
    if (!password || (!email && !username)) {
      return res.status(400).json({ message: 'Username/email and password are required' });
    }

    const where: { email?: string; username?: string } = {};
    if (email) where.email = email;
    if (username) where.username = username;

    const user = await User.findOne({ where });
    if (!user) return res.status(401).json({ message: 'Invalid username/email or password' });

    const stored = String(user.get('password_hash') ?? '');
    const ok = stored.startsWith('$2') ? await bcrypt.compare(password, stored) : stored === password;
    if (!ok) return res.status(401).json({ message: 'Invalid username/email or password' });

    const secret = process.env.ACCESS_TOKEN_SECRET!;
    const payload = { sub: user.get('id'), username: user.get('username'), email: user.get('email') };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    return res.json({
      token,
      user: { id: user.get('id'), username: user.get('username'), email: user.get('email') },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
