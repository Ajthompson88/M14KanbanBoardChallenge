// server/src/routes/auth-routes.ts
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js'; // ESM: keep the .js extension in TS sources when using NodeNext

const router = Router();
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = (req.body ?? {}) as {
      email?: string;
      username?: string;
      password?: string;
    };

    if (!password || (!email && !username)) {
      return res.status(400).json({ message: 'Username/email and password are required' });
    }

    // Build a safe where clause (no undefined values)
    const where: Record<string, unknown> = {};
    if (email && email.trim()) where.email = email.trim();
    if (!('email' in where) && username && username.trim()) where.username = username.trim();

    const user = await User.findOne({ where });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Replace with bcrypt.compare(...) once passwords are hashed
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!JWT_SECRET) {
      console.error('Missing ACCESS_TOKEN_SECRET');
      return res.status(500).json({ message: 'Server misconfigured' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({ token }); // <-- what your frontend expects
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
});

// Optional: quick identity check for debugging
router.get('/me', (req, res) => {
  try {
    const auth = req.headers['authorization'];
    const token = auth?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number; email: string; username: string;
    };
    return res.json(decoded);
  } catch {
    return res.status(403).json({ message: 'Invalid token' });
  }
});

export default router;
