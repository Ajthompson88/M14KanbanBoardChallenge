// client/src/pages/EditTicket.tsx
import {
useCallback,
useEffect,
useMemo,
useRef,
useState,
type FormEvent,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
retrieveTicket,
updateTicket,
type TicketUpsert,
type ApiStatus,
type UiTicket,
} from "../api/ticketAPI";
import { retrieveUsers } from "../api/userAPI";
import type { UserData } from "../interfaces/index.js";
import { FieldSelect } from "../components/FieldSelect";

type LocState = { id?: number; ticketId?: number } | undefined;

// UI-facing, human-friendly labels
const STATUS_OPTS = ["Todo", "In Progress", "Done"] as const;
type Status = (typeof STATUS_OPTS)[number];

// UI <-> API status mapping
function toApiStatus(s: Status): ApiStatus {
switch (s) {
case "Todo":
  return "todo";
case "In Progress":
  return "in_progress";
case "Done":
  return "done";
}
}

function fromApiStatus(s: unknown, fallback: Status = "Todo"): Status {
if (s === "todo") return "Todo";
if (s === "in_progress") return "In Progress";
if (s === "done") return "Done";
return fallback;
}

function coerceId(paramsId?: string, state?: LocState): number | null {
const fromParams = paramsId ? Number(paramsId) : NaN;
const fromState =
(state?.id ?? state?.ticketId) != null ? Number(state?.id ?? state?.ticketId) : NaN;
const id = Number.isFinite(fromParams) ? fromParams : fromState;
return Number.isFinite(id) ? id : null;
}

export default function EditTicket() {
const navigate = useNavigate();
const { id: paramsId } = useParams<{ id: string }>();
const { state } = useLocation() as { state?: LocState };
const ticketId = coerceId(paramsId, state);

const formRef = useRef<HTMLFormElement>(null);
const [users, setUsers] = useState<UserData[]>([]);
const [initial, setInitial] = useState<UiTicket | null>(null);

const [name, setName] = useState("");
const [description, setDescription] = useState("");
const [status, setStatus] = useState<Status>("Todo");
const [assignedUserId, setAssignedUserId] = useState<number | "">("");

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState<string | null>(null);

const dirty = useMemo(() => {
if (!initial) return false;
return (
  (name ?? "") !== (initial.name ?? "") ||
  (description ?? "") !== (initial.description ?? "") ||
  (status ?? "Todo") !== fromApiStatus(initial.status ?? "todo") ||
  Number(assignedUserId || 0) !== Number(initial.assignedUserId || 0)
);
}, [initial, name, description, status, assignedUserId]);

// Load ticket + users
useEffect(() => {
let alive = true;
(async () => {
  try {
    setLoading(true);
    setError(null);

    if (!ticketId) throw new Error("Missing ticket id");

    const [t, u] = await Promise.all([retrieveTicket(ticketId), retrieveUsers()]);
    if (!alive) return;

    setUsers(u ?? []);
    setInitial(t);

    setName(t.name ?? "");
    setDescription(t.description ?? "");
    setStatus(fromApiStatus(t.status, "Todo"));

    const currentAssignee =
      t.assignedUserId != null ? Number(t.assignedUserId) : undefined;
    setAssignedUserId(
      typeof currentAssignee === "number" && Number.isFinite(currentAssignee)
        ? currentAssignee
        : (u?.[0]?.id ?? "")
    );
  } catch (e) {
    if (!alive) return;
    setError(e instanceof Error ? e.message : "Failed to load ticket or users");
  } finally {
    if (alive) setLoading(false);
  }
})();
return () => {
  alive = false;
};
}, [ticketId]);

// Unsaved changes guard
useEffect(() => {
const handler = (e: BeforeUnloadEvent) => {
  if (dirty) {
    e.preventDefault();
    e.returnValue = "";
  }
};
window.addEventListener("beforeunload", handler);
return () => window.removeEventListener("beforeunload", handler);
}, [dirty]);

const validate = useCallback((): string | null => {
if (!name.trim()) return "Name is required";
const assigneeOk = assignedUserId !== "" && Number.isFinite(Number(assignedUserId));
if (!assigneeOk) return "Assignee is required";
if (!STATUS_OPTS.includes(status)) return "Invalid status";
return null;
}, [name, status, assignedUserId]);

const submitLogic = useCallback(async () => {
const v = validate();
if (v) {
  setError(v);
  return;
}
if (!ticketId) {
  setError("Missing ticket id");
  return;
}
setSaving(true);
setError(null);
try {
  const payload: TicketUpsert = {
    name: name.trim(),
    description: description.trim(),
    status: toApiStatus(status),          // UI -> API mapping
    assignedUserId: Number(assignedUserId),
  };
  await updateTicket(ticketId, payload);
  navigate("/board", { replace: true });
} catch {
  setError("Update failed");
} finally {
  setSaving(false);
}
}, [validate, ticketId, name, description, status, assignedUserId, navigate]);

function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
e.preventDefault();
void submitLogic();
}

const STATUS_OPTIONS = [
  { label: "Todo", value: "Todo" as const },
  { label: "In Progress", value: "In Progress" as const },
  { label: "Done", value: "Done" as const },
];

// Ctrl/Cmd+S to save
const handleKeySave = useCallback(
(e: KeyboardEvent) => {
  const isMac = navigator.platform.toLowerCase().includes("mac");
  if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "s") {
    e.preventDefault();
    void submitLogic();
  }
},
[submitLogic]
);

useEffect(() => {
window.addEventListener("keydown", handleKeySave);
return () => window.removeEventListener("keydown", handleKeySave);
}, [handleKeySave]);

if (loading) return <div className="p-4">Loading…</div>;

if (error) {
return (
  <div className="max-w-xl mx-auto p-4">
    <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
      <div className="mb-1 text-sm font-semibold">Couldn’t load or save</div>
      <div className="text-sm">{error}</div>
    </div>
    <div className="mt-3">
      <button
        className="rounded bg-slate-900 text-white px-4 py-2"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
    </div>
  </div>
);
}

return (
<div className="max-w-xl mx-auto p-4">
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-xl font-semibold">Edit Ticket</h2>
    <div className="text-xs text-slate-500">
      {dirty ? "Unsaved changes" : "All changes saved"}
    </div>
  </div>

  <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-3">
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">Title</span>
      <input
        className="w-full border rounded px-3 py-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ticket title"
      />
    </label>

    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">Description</span>
      <textarea
        className="w-full border rounded px-3 py-2"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What needs to be done?"
      />
    </label>

    <label className="block">
<span className="mb-1 block text-sm font-medium text-slate-300">Status</span>
<FieldSelect
  value={status}
  onChange={setStatus}
  options={STATUS_OPTIONS}
  className="w-full"
/>
</label>

      <label className="block">
<span className="mb-1 block text-sm font-medium text-slate-300">Assignee</span>
<FieldSelect
  value={assignedUserId === "" ? -1 : Number(assignedUserId)}
  onChange={(v) => setAssignedUserId(v === -1 ? "" : Number(v))}
  searchable
  options={[
    { label: "Select a user…", value: -1, disabled: true },
    ...users.map((u) => ({
      label: u.username ?? `User ${u.id}`,
      value: Number(u.id ?? -1),
    })),
  ]}
  className="w-full"
/>
</label>

    <div className="flex items-center gap-2 pt-2">
      <button
        type="submit"
        disabled={saving}
        className="rounded bg-slate-900 text-white px-4 py-2 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save"}
      </button>
      <button
        type="button"
        className="rounded border px-4 py-2"
        onClick={() => navigate("/board")}
      >
        Cancel
      </button>
      <span className="ml-auto text-xs text-slate-500">Tip: Ctrl/Cmd + S to save</span>
    </div>
  </form>
</div>
);
}
