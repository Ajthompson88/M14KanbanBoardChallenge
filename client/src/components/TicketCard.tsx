import { Link } from 'react-router-dom';
import type { MouseEventHandler } from 'react';
import type { TicketData, ApiMessage } from '../interfaces/index.js';

interface TicketCardProps {
  ticket: TicketData;
  deleteTicket: (ticketId: number) => Promise<ApiMessage>;
}

const initials = (name?: string | null) => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
};

const statusClass = (s?: string | null) => {
  const v = (s || '').toLowerCase();
  if (v.includes('progress')) return 'bg-blue-500/15 text-blue-300 ring-blue-500/30';
  if (v.includes('done'))     return 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30';
  return 'bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] ring-[var(--brand-accent)]/30';
};

export default function TicketCard({ ticket, deleteTicket }: TicketCardProps) {
  const handleDelete: MouseEventHandler<HTMLButtonElement> = async (e) => {
    const id = Number((e.currentTarget as HTMLButtonElement).value);
    if (!Number.isFinite(id)) return;
    try {
      await deleteTicket(id);
    } catch (err) {
      console.error('Failed to delete ticket:', err);
    }
  };

  return (
    <article className="rounded-xl bg-[var(--brand-panel)]/70 p-4 shadow-md ring-1 ring-[var(--brand-ring)] transition-colors hover:ring-[var(--brand-accent)]/40">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-[var(--brand-text)]">
          {ticket.name || 'Untitled Ticket'}
        </h3>
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusClass(ticket.status)}`}>
          {ticket.status || 'To Do'}
        </span>
      </div>

      {ticket.description && (
        <p className="mt-2 line-clamp-3 text-sm text-[var(--brand-muted)]">{ticket.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-white/5 text-xs font-semibold text-[var(--brand-text)] ring-1 ring-white/10">
            {initials(ticket.assignedUser?.username)}
          </span>
          <span className="text-xs text-[var(--brand-muted)]">
            {ticket.assignedUser?.username || 'Unassigned'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/edit/${ticket.id ?? ''}`}
            className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-[var(--brand-text)] hover:bg-white/5"
          >
            Edit
          </Link>
          <button
            type="button"
            value={String(ticket.id ?? '')}
            onClick={handleDelete}
            className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-rose-700"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
