// server/src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export type UserPayload = { id: number; email: string; username: string };

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;
if (!JWT_SECRET) {
  console.warn(
    '⚠️ ACCESS_TOKEN_SECRET missing at startup — all token checks will fail.'
  );
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.header('authorization') || req.header('Authorization');
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing Bearer token' });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'Server misconfigured: ACCESS_TOKEN_SECRET missing' });
    }

    const token = header.slice(7);

    const decoded = jwt.verify(token, JWT_SECRET);
    const { sub, id, email, username } = decoded as Partial<UserPayload & { sub: number }>;

    // accept either "id" or "sub" claim
    const userId = typeof id === 'number' ? id : typeof sub === 'number' ? sub : undefined;

    if (!userId || !email || !username) {
      return res.status(403).json({ message: 'Invalid token payload' });
    }

    (req as any).user = { id: userId, email, username } satisfies UserPayload;

    return next();
  } catch (err) {
    console.error('JWT verify error:', err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

export function getUser(req: Request): UserPayload | undefined {
  return (req as any).user as UserPayload | undefined;
}
