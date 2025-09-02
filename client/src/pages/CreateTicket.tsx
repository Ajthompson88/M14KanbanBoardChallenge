import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket, type TicketUpsert } from '../api/ticketAPI';
import { retrieveUsers } from '../api/userAPI';
import type { UserData } from '../interfaces/UserData';

export default function CreateTicket() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [form, setForm] = useState<Partial<TicketUpsert>>({
    name: '',
    description: '',
    status: 'Todo',
    assignedUserId: undefined,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const u = await retrieveUsers();
        setUsers(u);
        if (!form.assignedUserId && u.length) {
          setForm((f) => ({ ...f, assignedUserId: u[0].id ?? undefined }));
        }
      } catch (e) {
        console.error(e);
        setError('Failed to load users');
      }
    })();
  }, [form.assignedUserId]);

  function onChange<K extends keyof TicketUpsert>(key: K, val: TicketUpsert[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const payload: TicketUpsert = {
        name: form.name ?? '',
        description: form.description ?? '',
        status: form.status ?? 'Todo',
        assignedUserId: Number(form.assignedUserId ?? 0),
      };
      if (!payload.name) throw new Error('Name is required');
      if (!payload.assignedUserId) throw new Error('Assignee is required');

      await createTicket(payload);
      navigate('/board', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Create Ticket</h2>
      {error && <p className="mb-3 text-red-600">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Title"
          value={form.name ?? ''}
          onChange={(e) => onChange('name', e.target.value)}
        />
        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Description"
          value={form.description ?? ''}
          onChange={(e) => onChange('description', e.target.value)}
        />
        <select
          className="w-full border rounded px-3 py-2"
          value={form.status ?? 'Todo'}
          onChange={(e) => onChange('status', e.target.value)}
        >
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <select
          className="w-full border rounded px-3 py-2"
          value={form.assignedUserId ?? ''}
          onChange={(e) => onChange('assignedUserId', Number(e.target.value))}
        >
          {users.map((u) => (
            <option key={u.id} value={String(u.id)}>{u.username}</option>
          ))}
        </select>
        <div className="pt-2">
          <button className="rounded bg-slate-900 text-white px-4 py-2">Create</button>
        </div>
      </form>
    </div>
  );
}
