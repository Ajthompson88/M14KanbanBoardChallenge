import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swimlane from "../components/Swimlane";
import { api, getToken } from "../api/authAPI";

// ---- Server-side ticket shape (backend contract) ----
type ServerStatus = "todo" | "in_progress" | "done";
type ServerOwner = { id: number; username: string; email: string };
type ServerTicket = {
  id?: number;
  title: string;
  description: string | null;
  status: ServerStatus;
  userId: number | null;
  createdAt?: string;
  updatedAt?: string;
  owner?: ServerOwner | null;
};

// ---- UI ticket shape (what Swimlane expects) ----
import type { TicketData as UiTicket } from "../interfaces";

// Map server status -> UI status literal
function toUiStatus(s: ServerStatus): UiTicket["status"] {
  if (s === "in_progress") return "In Progress";
  if (s === "done") return "Done";
  return "Todo";
}

// Convert a server ticket to the UI ticket shape
function toUiTicket(t: ServerTicket): UiTicket {
  const assigned =
    t.owner ? { id: t.owner.id, username: t.owner.username, email: t.owner.email } : null;

  return {
    id: t.id ?? 0,
    name: t.title,
    description: t.description ?? "",
    status: toUiStatus(t.status),
    assignedUserId: t.userId,
    assignedUser: assigned,
  } as UiTicket;
}

export default function Board() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<ServerTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New-ticket mini form
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  function authHeader() {
    const t = getToken();
    return t ? { Authorization: `Bearer ${t}` } : {};
  }

  async function fetchAllTickets() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<ServerTicket[]>("/tickets", { headers: authHeader() });
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      type HttpErrorLike = { response?: { status?: number } };
      const status = (err as HttpErrorLike).response?.status;
      if (status === 401) {
        setError("Please sign in to view the board.");
      } else {
        setError("Failed to load tickets.");
        console.error("fetchAllTickets error:", err);
      }
    } finally {
      setLoading(false);
    }
  }

  async function createTicket() {
    const title = newTitle.trim();
    if (!title) return;

    try {
      const payload = { title, description: newDesc || null }; // server defaults status='todo'
      const { data } = await api.post<ServerTicket>("/tickets", payload, {
        headers: authHeader(),
      });
      setTickets((prev) => [data, ...prev]);
      setNewTitle("");
      setNewDesc("");
      setShowAdd(false);
    } catch (err) {
      console.error("createTicket error:", err);
      setError("Failed to create ticket.");
    }
  }

  async function deleteTicket(ticketId: number) {
    try {
      await api.delete(`/tickets/${ticketId}`, { headers: authHeader() });
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
      return { message: "Deleted" as const };
    } catch (err) {
      console.error("deleteTicket error:", err);
      setError("Failed to delete ticket.");
      return { message: "Failed" as const };
    }
  }

  useEffect(() => {
    if (!getToken()) {
      setError("Please sign in to view the board.");
      setLoading(false);
      return;
    }
    fetchAllTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Group into lanes (server shape first)
  const lanes = useMemo(() => {
    const groups: Record<ServerStatus, ServerTicket[]> = {
      todo: [],
      in_progress: [],
      done: [],
    };
    for (const t of tickets) {
      const key: ServerStatus = t.status ?? "todo";
      (groups[key] ?? groups.todo).push(t);
    }
    return groups;
  }, [tickets]);

  // Convert each lane to UI tickets that Swimlane expects
  const uiLanes: Record<ServerStatus, UiTicket[]> = useMemo(
    () => ({
      todo: lanes.todo.map(toUiTicket),
      in_progress: lanes.in_progress.map(toUiTicket),
      done: lanes.done.map(toUiTicket),
    }),
    [lanes]
  );

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-[var(--brand-muted)]">Loading board…</div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--brand-bg)] text-[var(--brand-text)]">
      <header className="flex items-center justify-between px-6 py-4 bg-[var(--brand-panel)]/60 backdrop-blur-sm ring-1 ring-white/10">
        <div className="flex items-center gap-3">
          <div className="inline-grid h-9 w-9 place-items-center rounded-lg bg-[var(--brand-accent)] text-black text-xs font-bold ring-1 ring-white/10">
            KB
          </div>
          <h1 className="text-lg font-semibold">ShadowStack Kanban Board</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdd((v) => !v)}
            className="rounded-lg bg-[var(--brand-accent)] px-3 py-1.5 text-sm font-medium text-black hover:bg-[var(--brand-accent-2)] transition-colors"
          >
            {showAdd ? "Close" : "Add"}
          </button>
        </div>
      </header>

      {error && (
        <div className="mx-6 mt-3 mb-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
          {error}{" "}
          {error.includes("sign in") && (
            <button
              onClick={() => navigate("/login")}
              className="font-medium underline underline-offset-2"
            >
              Go to login
            </button>
          )}
        </div>
      )}

      {showAdd && (
        <div className="mx-6 mb-4 rounded-xl bg-[var(--brand-panel)]/70 ring-1 ring-[var(--brand-ring)] shadow-sm p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label className="mb-1 block text-sm text-[var(--brand-muted)]">Title</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[var(--brand-panel)] px-3 py-2 outline-none text-[var(--brand-text)] placeholder-zinc-500 focus:border-[var(--brand-accent)] focus:ring-4 focus:ring-[var(--brand-accent)]/15"
                placeholder="Short summary"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="mb-1 block text-sm text-[var(--brand-muted)]">Description</label>
              <input
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[var(--brand-panel)] px-3 py-2 outline-none text-[var(--brand-text)] placeholder-zinc-500 focus:border-[var(--brand-accent)] focus:ring-4 focus:ring-[var(--brand-accent)]/15"
                placeholder="Optional details"
              />
            </div>
          </div>
          <div className="mt-3">
            <button
              onClick={createTicket}
              className="rounded-lg bg-[var(--brand-accent)] px-3 py-1.5 text-sm font-medium text-black hover:bg-[var(--brand-accent-2)]"
            >
              Create
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-6 pb-10">
        <div className="grid gap-6 md:grid-cols-3">
          <Swimlane title="To Do"        tickets={uiLanes.todo}        deleteTicket={deleteTicket} />
          <Swimlane title="In Progress"  tickets={uiLanes.in_progress} deleteTicket={deleteTicket} />
          <Swimlane title="Done"         tickets={uiLanes.done}        deleteTicket={deleteTicket} />
        </div>
      </main>
    </div>
  );
}
