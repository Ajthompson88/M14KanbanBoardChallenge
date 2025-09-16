// server/src/controllers/user-controller.ts
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/index.js';

/**
 * GET /api/users
 * List all users
 */
export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/users/:id
 * Get a single user by id
 */
export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(Number(id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/users
 * Create (register) a new user
 * Body: { username, email, password }
 */
export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email, and password are required' });
    }

    // Optional: enforce unique email at the app level (DB has UNIQUE constraint too)
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    // NOTE: If you plan to hash passwords, do it here before create(...)
    // const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({ username, email, password /* password: hashed */ });
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Login with email + password
 * Body: { email, password }
 */
export async function loginUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // NOTE: If you hash passwords, compare with bcrypt.compare(password, user.password)
    // const ok = await bcrypt.compare(password, user.password);
    const ok = user.password === password; // plain comparison for now
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    // If you use JWT sessions, issue a token here and set cookie/return token
    // const token = sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    // res.json({ user, token });

    res.json({ message: 'Login successful', user });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/users/:id
 * Update a user
 * Body: { username?, email?, password? }
 */
export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    const user = await User.findByPk(Number(id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (email) {
      // Optional: prevent duplicate emails
      const existing = await User.findOne({ where: { email } });
      if (existing && existing.id !== user.id) {
        return res.status(409).json({ error: 'Email already in use' });
      }
    }

    // If hashing passwords, do it here for `password`
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (password !== undefined) user.password = password; // or hashed

    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/users/:id
 * Delete a user
 */
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(Number(id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
