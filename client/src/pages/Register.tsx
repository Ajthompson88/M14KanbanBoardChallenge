import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/authAPI";

export default function Register() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      await register({ username, email, password });
      nav("/login");
    } catch (err) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as Error).message)
          : "Failed to register.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ss.bg text-ss.ink grid place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-ss.card ring-1 ring-white/10 p-6">
        <h1 className="text-xl font-semibold mb-4">Create your account</h1>
        {error && <div className="mb-3 rounded-lg border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full rounded-lg bg-ss.surface/40 border border-white/10 px-3 py-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input className="w-full rounded-lg bg-ss.surface/40 border border-white/10 px-3 py-2" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full rounded-lg bg-ss.surface/40 border border-white/10 px-3 py-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full rounded-lg bg-ss.brand/90 hover:bg-ss.brand text-white py-2 font-medium disabled:opacity-60">
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
