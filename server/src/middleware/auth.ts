// server/src/middleware/auth.ts
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export type UserPayload = { id: number; email: string; username: string };

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization") || req.header("Authorization");
  if (!header?.startsWith("Bearer ")) return res.sendStatus(401);

  const token = header.slice(7);
  if (!JWT_SECRET) {
    console.error("Missing ACCESS_TOKEN_SECRET");
    return res.status(500).json({ message: "Server misconfigured" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    const { id, email, username } = (decoded ?? {}) as Partial<UserPayload>;
    if (typeof id !== "number" || !email || !username) return res.sendStatus(403);
    (req as any).user = { id, email, username } as UserPayload;
    next();
  });
}

export function getUser(req: Request): UserPayload | undefined {
  return (req as any).user as UserPayload | undefined;
}
