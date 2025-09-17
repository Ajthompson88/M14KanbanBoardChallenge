// server/src/routes/api/auth-routes.ts
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// 👇 IMPORTANT: from routes/api to models is two levels up
// NodeNext ESM: keep the .js extension in TS for compiled modules
import { User } from '../../models/index.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET as string;

function requireSecret(): string {
  if (!JWT_SECRET || JWT_SECRET.trim() === '') {
    // Keep it JSON so the client doesn't choke
    throw Object.assign(new Error('JWT secret missing'), { status: 500 });
  }
  return JWT_SECRET;
}

/**
 * POST /auth/login
 * Body: { email?: string, username?: string, password: string }
 * Returns: { token }
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, username, password } = (req.body ?? {}) as {
      email?: string;
      username?: string;
      password?: string;
    };

    if (!password || (!email && !username)) {
      return res.status(400).json({ error: 'username/email and password are required' });
    }

    // Build a safe WHERE object (no undefineds)
    const where: Record<string, unknown> = {};
    if (email && email.trim()) where.email = email.trim();
    if (!('email' in where) && username && username.trim()) where.username = username.trim();

    const user = await User.findOne({ where });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // If your seed stored plaintext, bcrypt.compare will still return false.
    // For development: allow plaintext match if hash compare fails AND stored pw equals input.
    const stored = user.password as string;

    let ok = false;
    try {
      ok = await bcrypt.compare(password, stored);
    } catch {
      ok = false;
    }
    if (!ok && stored === password) ok = true; // dev-only fallback; remove once all passwords are hashed

    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      requireSecret(),
      { expiresIn: '1d' }
    );

    return res.json({ token });
  } catch (err: any) {
    const status = err?.status ?? 500;
    const msg = status === 500 ? 'Login failed' : err?.message || 'Login failed';
    if (status === 500) console.error('Login error:', err);
    return res.status(status).json({ error: msg });
  }
});

/**
 * GET /auth/me
 * Reads Authorization: Bearer <token>
 */
router.get('/me', (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing token' });
    }
    const token = auth.slice(7);
    const decoded = jwt.verify(token, requireSecret()) as {
      id: number; email: string; username: string; iat: number; exp: number;
    };
    return res.json(decoded);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// Export BOTH ways so your server can import named or default
export const authRouter = router;
export default router;
