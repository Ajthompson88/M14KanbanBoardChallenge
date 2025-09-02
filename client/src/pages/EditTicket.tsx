import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { retrieveTicket, updateTicket, type TicketUpsert } from '../api/ticketAPI';
import { retrieveUsers } from '../api/userAPI';
import type { TicketData } from '../interfaces/TicketData';
import type { UserData } from '../interfaces/UserData';

// ✅ Keep helpers local (no exports) to silence react-refresh warnings
const statusOptions = ['Todo', 'In Progress', 'Done'];

function toPayload(form: HTMLFormElement): TicketUpsert {
  const fd = new FormData(form);
  return {
    name: String(fd.get('name') ?? ''),
    description: String(fd.get('description') ?? ''),
    status: String(fd.get('status') ?? 'Todo'),
    assignedUserId: Number(fd.get('assignedUserId') ?? 0),
  };
}

export default function EditTicket() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { ticketId?: number } };
  const ticketId = state?.ticketId;
  const formRef = useRef<HTMLFormElement>(null);

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!ticketId) throw new Error('Missing ticket id');
        const [t, u] = await Promise.all([retrieveTicket(ticketId), retrieveUsers()]);
        setTicket(t);
        setUsers(u);
      } catch (e) {
        console.error(e);
        setError('Failed to load ticket or users');
      }
    })();
  }, [ticketId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (!ticketId || !formRef.current) throw new Error('Invalid edit state');
      const payload = toPayload(formRef.current);
      if (!payload.name) throw new Error('Name is required');
      if (!payload.assignedUserId) throw new Error('Assignee is required');

      await updateTicket(ticketId, payload);
      navigate('/board', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  }

  if (!ticket) return <div className="p-4">Loading…</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Edit Ticket</h2>
      {error && <p className="mb-3 text-red-600">{error}</p>}
      <form ref={formRef} onSubmit={onSubmit} className="space-y-3">
        <input
          name="name"
          className="w-full border rounded px-3 py-2"
          defaultValue={ticket.name ?? ''}
        />
        <textarea
          name="description"
          className="w-full border rounded px-3 py-2"
          defaultValue={ticket.description ?? ''}
        />
        <select
          name="status"
          className="w-full border rounded px-3 py-2"
          defaultValue={ticket.status ?? 'Todo'}
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          name="assignedUserId"
          className="w-full border rounded px-3 py-2"
          defaultValue={ticket.assignedUserId != null ? String(ticket.assignedUserId) : ''}
        >
          {users.map((u) => (
            <option key={u.id} value={String(u.id)}>{u.username}</option>
          ))}
        </select>
        <div className="pt-2">
          <button className="rounded bg-slate-900 text-white px-4 py-2">Save</button>
        </div>
      </form>
    </div>
  );
}
