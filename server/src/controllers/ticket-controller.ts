import type { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Ticket, User } from '../models/index.js';
import type { TicketStatus } from '../models/ticket.js'; // <-- import the model's type

function normalizeStatus(input: unknown): TicketStatus | undefined {
  if (typeof input !== 'string') return undefined;
  const s = input.trim().toLowerCase().replace(/\s+/g, '_');
  if (s === 'todo' || s === 'in_progress' || s === 'done') return s as TicketStatus;
  return undefined;
}

// ────────────────────────────────────────────────────────────────────────────────
// CRUD: Tickets
// ────────────────────────────────────────────────────────────────────────────────

export async function listTickets(req: Request, res: Response) {
  try {
    const { q, status, userId } = req.query;

    const where: any = {};
    const norm = normalizeStatus(status);
    if (norm) where.status = norm;
    if (userId) where.userId = Number(userId);

    if (typeof q === 'string' && q.trim()) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
      ];
    }

    const tickets = await Ticket.findAll({
      where,
      order: [['id', 'ASC']],
      include: [{ model: User, as: 'owner', attributes: ['id', 'username', 'email'] }],
    });
    return res.json(tickets);
  } catch (err) {
    console.error('listTickets error:', err);
    return res.status(500).json({ error: 'Failed to fetch tickets' });
  }
}

export async function getTicketById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const ticket = await Ticket.findByPk(id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'username', 'email'] }],
    });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    return res.json(ticket);
  } catch (err) {
    console.error('getTicketById error:', err);
    return res.status(500).json({ error: 'Failed to fetch ticket' });
  }
}

export async function createTicket(req: Request, res: Response) {
  try {
    const {
      title,
      name,
      description = null,
      status,
      assignedUserId,
      userId,
    }: {
      title?: string;
      name?: string;
      description?: string | null;
      status?: string;
      assignedUserId?: number | null;
      userId?: number | null;
    } = req.body ?? {};

    const finalTitle = (title ?? name ?? '').trim();
    if (!finalTitle) return res.status(400).json({ error: 'Title is required' });

    const finalStatus = normalizeStatus(status) ?? 'todo';

    // 🔧 Ensure this is strictly number | null (never undefined)
    let finalUserId: number | null = null;
    if (typeof userId === 'number') finalUserId = userId;
    else if (typeof assignedUserId === 'number') finalUserId = assignedUserId;

    const ticket = await Ticket.create({
      title: finalTitle,
      description: description ?? null,
      status: finalStatus,
      userId: finalUserId, // <- number | null, not undefined
    });

    return res.status(201).json(ticket);
  } catch (err) {
    console.error('createTicket error:', err);
    return res.status(500).json({ error: 'Failed to create ticket' });
  }
}


export async function updateTicket(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    const {
      title,
      name,
      description,
      status,
      assignedUserId,
      userId,
    }: {
      title?: string;
      name?: string;
      description?: string | null;
      status?: string;
      assignedUserId?: number | null;
      userId?: number | null;
    } = req.body ?? {};

    const patch: Partial<{
      title: string;
      description: string | null;
      status: TicketStatus;
      userId: number | null;
    }> = {};

    if (title !== undefined || name !== undefined) {
      const t = (title ?? name ?? '').trim();
      if (!t) return res.status(400).json({ error: 'Title cannot be empty' });
      patch.title = t;
    }
    if (description !== undefined) patch.description = description;
    if (status !== undefined) {
      const norm = normalizeStatus(status);
      if (!norm) return res.status(400).json({ error: 'Invalid status' });
      patch.status = norm;
    }

    // 🔧 Guarantee number | null (avoid undefined)
    if (userId !== undefined || assignedUserId !== undefined) {
      let uid: number | null = null;
      if (typeof userId === 'number') uid = userId;
      else if (typeof assignedUserId === 'number') uid = assignedUserId;
      patch.userId = uid;
    }

    ticket.set(patch);
    await ticket.save();

    return res.json(ticket);
  } catch (err) {
    console.error('updateTicket error:', err);
    return res.status(500).json({ error: 'Failed to update ticket' });
  }
}


export async function deleteTicket(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const count = await Ticket.destroy({ where: { id } });
    if (count === 0) return res.status(404).json({ error: 'Ticket not found' });

    return res.status(204).send();
  } catch (err) {
    console.error('deleteTicket error:', err);
    return res.status(500).json({ error: 'Failed to delete ticket' });
  }
}
