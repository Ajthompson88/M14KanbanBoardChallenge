// server/src/routes/auth-routes.ts
import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { User } from "../models/index.js";

const router = Router();
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || "devsecret";

/** Helper: sign JWT for a user record */
function signFor(u: { id: number; username: string; email: string }) {
  return jwt.sign(
    { sub: u.id, username: u.username, email: u.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

function isBcryptHash(s: string) {
  return /^\$2[aby]\$/.test(s);
}

/**
 * POST /api/auth/login
 * Body: { username?: string, email?: string, password: string }
 */
router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body ?? {};
    if ((!username && !email) || !password) {
      return res.status(400).json({ message: "username or email, and password are required" });
    }

    const where = username ? { username } : { email };
    const user = await User.findOne({ where });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const hash = user.password_hash ?? "";
    const ok = isBcryptHash(hash) ? await bcrypt.compare(password, hash) : hash === password;
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signFor({ id: user.id, username: user.username, email: user.email });
    return res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

/**
 * POST /api/auth/register
 * Body: { username: string, email: string, password: string }
 * Creates the user (hashed password) and returns { token, user }
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body ?? {};
    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password are required" });
    }

    // uniqueness check
    const exists = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });
    if (exists) {
      return res.status(409).json({ message: "Username or email already in use" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password_hash });

    const token = signFor({ id: user.id, username: user.username, email: user.email });
    return res.status(201).json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Registration failed" });
  }
});

export default router;
