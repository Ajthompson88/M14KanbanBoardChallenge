import { Link } from 'react-router-dom';
import { MouseEventHandler } from 'react';
import { TicketData, ApiMessage } from '../interfaces/index.js';

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
  if (v.includes('progress')) return 'bg-amber-50 text-amber-700 ring-amber-200';
  if (v.includes('done')) return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  return 'bg-blue-50 text-blue-700 ring-blue-200';
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
    <article className="rounded-xl bg-white p-4 shadow-md ring-1 ring-slate-200 transition hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">
          {ticket.name || 'Untitled Ticket'}
        </h3>
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusClass(ticket.status)}`}>
          {ticket.status || 'To Do'}
        </span>
      </div>

      {ticket.description && (
        <p className="mt-2 line-clamp-3 text-sm text-slate-600">{ticket.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            {initials(ticket.assignedUser?.username)}
          </span>
          <span className="text-xs text-slate-500">
            {ticket.assignedUser?.username || 'Unassigned'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/edit/${ticket.id ?? ""}`}
            className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-100"
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
