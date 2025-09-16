// FILE: server/src/controllers/ticket-controller.ts
import type { Request, Response } from "express";
import type { FindAttributeOptions } from "sequelize";
import { Ticket, User } from "../models/index.js";

const STATUS_OPTS = new Set(["Todo", "In Progress", "Done"]);
const userAttrs: FindAttributeOptions = ["id", "username", "email"]; // ← mutable, not readonly

function bad(res: Response, code: number, message: string) {
  return res.status(code).json({ message });
}

export async function listTickets(_req: Request, res: Response) {
  try {
    const tickets = await Ticket.findAll({
      include: [{ model: User, as: "assignedUser", attributes: userAttrs }],
      order: [["id", "ASC"]],
    });
    res.json(tickets);
  } catch (e) {
    console.error(e);
    bad(res, 500, "Failed to fetch tickets");
  }
}

export async function getTicket(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return bad(res, 400, "Invalid id");

    const ticket = await Ticket.findByPk(id, {
      include: [{ model: User, as: "assignedUser", attributes: userAttrs }],
    });
    if (!ticket) return bad(res, 404, "Not found");
    res.json(ticket);
  } catch (e) {
    console.error(e);
    bad(res, 500, "Failed to fetch ticket");
  }
}

export async function createTicket(req: Request, res: Response) {
  try {
    const {
      name,
      description = "",
      status = "Todo",
      assignedUserId = null,
    } = (req.body ?? {}) as {
      name?: string;
      description?: string;
      status?: string;
      assignedUserId?: number | null;
    };

    if (!name?.trim()) return bad(res, 400, "Name is required");
    if (!STATUS_OPTS.has(status)) return bad(res, 400, "Invalid status");

    const created = await Ticket.create({
      name: name.trim(),
      description: String(description ?? ""),
      status: status as "Todo" | "In Progress" | "Done",
      assignedUserId: assignedUserId ?? null,
    });

    const full = await Ticket.findByPk(created.id, {
      include: [{ model: User, as: "assignedUser", attributes: userAttrs }],
    });
    res.status(201).json(full);
  } catch (e) {
    console.error(e);
    bad(res, 500, "Failed to create ticket");
  }
}

export async function updateTicket(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return bad(res, 400, "Invalid id");

    const t = await Ticket.findByPk(id);
    if (!t) return bad(res, 404, "Not found");

    const { name, description, status, assignedUserId } = (req.body ?? {}) as {
      name?: string;
      description?: string;
      status?: string;
      assignedUserId?: number | null;
    };

    const patch: Partial<{
      name: string;
      description: string;
      status: "Todo" | "In Progress" | "Done";
      assignedUserId: number | null;
    }> = {};

    if (name != null) {
      if (!name.trim()) return bad(res, 400, "Name cannot be empty");
      patch.name = name.trim();
    }
    if (description != null) patch.description = String(description);
    if (status != null) {
      if (!STATUS_OPTS.has(status)) return bad(res, 400, "Invalid status");
      patch.status = status as "Todo" | "In Progress" | "Done";
    }
    if (assignedUserId !== undefined) {
      patch.assignedUserId = assignedUserId ?? null;
    }

    await t.update(patch);

    const full = await Ticket.findByPk(id, {
      include: [{ model: User, as: "assignedUser", attributes: userAttrs }],
    });
    res.json(full);
  } catch (e) {
    console.error(e);
    bad(res, 500, "Failed to update ticket");
  }
}

export async function deleteTicket(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return bad(res, 400, "Invalid id");
    const t = await Ticket.findByPk(id);
    if (!t) return bad(res, 404, "Not found");
    await t.destroy();
    res.json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    bad(res, 500, "Failed to delete ticket");
  }
}
