// server/src/controllers/user-controller.ts
import type { Request, Response } from 'express';
import { Op, UniqueConstraintError, ValidationError } from 'sequelize';
import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';

// You can override via env; default is 10 which is a good dev value.
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);

// ────────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────────

async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

function safeUser(u: any) {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
  };
}

// ────────────────────────────────────────────────────────────────────────────────
// Controllers
// ────────────────────────────────────────────────────────────────────────────────

export async function listUsers(req: Request, res: Response) {
  try {
    const { q } = req.query;
    const where: any = {};
    if (typeof q === 'string' && q.trim()) {
      where[Op.or] = [
        { username: { [Op.iLike]: `%${q}%` } },
        { email: { [Op.iLike]: `%${q}%` } },
      ];
    }
    const users = await User.findAll({
      where,
      order: [['id', 'ASC']],
      attributes: ['id', 'username', 'email'], // never send password_hash
    });
    return res.json(users);
  } catch (err) {
    console.error('listUsers error:', err);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const user = await User.findByPk(id, { attributes: ['id', 'username', 'email'] });
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json(user);
  } catch (err) {
    console.error('getUserById error:', err);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body ?? {};
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email, and password are required' });
    }

    // Pre-check for uniqueness (DB unique constraints should also exist)
    const existing = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
      attributes: ['id'],
    });
    if (existing) {
      return res.status(409).json({ error: 'Username or email already in use' });
    }

    const password_hash = await hashPassword(password);

    const user = await User.create({ username, email, password_hash });

    return res.status(201).json(safeUser(user));
  } catch (err: any) {
    if (err instanceof UniqueConstraintError || err instanceof ValidationError) {
      // Defensive: in case the DB unique constraint fired instead of our pre-check
      return res.status(409).json({ error: 'Username or email already in use' });
    }
    console.error('createUser error:', err);
    return res.status(500).json({ error: 'Failed to create user' });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { username, email, password } = req.body ?? {};

    // Uniqueness guard if changing username/email
    if (username || email) {
      const existing = await User.findOne({
        where: {
          [Op.and]: [
            { id: { [Op.ne]: id } },
            {
              [Op.or]: [
                ...(username ? [{ username }] : []),
                ...(email ? [{ email }] : []),
              ],
            },
          ],
        },
        attributes: ['id'],
      });
      if (existing) {
        return res.status(409).json({ error: 'Username or email already in use' });
      }
    }

    const patch: Partial<{ username: string; email: string; password_hash: string }> = {};
    if (username !== undefined) patch.username = username;
    if (email !== undefined) patch.email = email;
    if (password !== undefined) patch.password_hash = await hashPassword(password);

    user.set(patch);
    await user.save();

    return res.json(safeUser(user));
  } catch (err: any) {
    if (err instanceof UniqueConstraintError || err instanceof ValidationError) {
      return res.status(409).json({ error: 'Username or email already in use' });
    }
    console.error('updateUser error:', err);
    return res.status(500).json({ error: 'Failed to update user' });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const count = await User.destroy({ where: { id } });
    if (count === 0) return res.status(404).json({ error: 'User not found' });

    return res.status(204).send();
  } catch (err) {
    console.error('deleteUser error:', err);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
}
