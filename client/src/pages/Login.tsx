// client/src/pages/Login.tsx
import { useState, type FormEvent } from "react";
import { useNavigate, useLocation, type Location } from "react-router-dom";
import { login as apiLogin } from "../api/authAPI";
import { useAuth } from "../context/useAuth";
import type { AxiosError } from "axios";

/** When ProtectedRoute bounces, it sets state={{ from: location }}. */
type LoginRedirectState = { from?: Location } | null;

// Shape of error bodies your API might return
type ApiErrorBody = { message?: string; error?: string };

// Narrow unknown -> AxiosError<ApiErrorBody>
function isAxiosError(err: unknown): err is AxiosError<ApiErrorBody> {
  return typeof err === "object" && err !== null && "isAxiosError" in err;
}

function extractErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const data = err.response?.data;
    return data?.message ?? data?.error ?? err.message ?? "Login failed";
  }
  if (err instanceof Error) return err.message;
  return "Login failed";
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation() as Location & { state?: LoginRedirectState };
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Please enter username and password.");
      return;
    }

    setIsLoading(true);
    try {
      const { token } = await apiLogin({ username, password });
      if (!token) throw new Error("Login response missing token.");
      login(token);

      const fromPath = location.state?.from?.pathname;
      const dest = fromPath && fromPath !== "/login" ? fromPath : "/board";
      navigate(dest, { replace: true });
    } catch (err: unknown) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--brand-bg)] text-[var(--brand-text)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand-accent)] text-black text-sm font-bold">
            KB
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[var(--brand-text)]">ShadowStack Kanban</h1>
            <p className="text-sm text-[var(--brand-muted)]">Sign in to continue</p>
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--brand-panel)]/80 shadow-lg ring-1 ring-[var(--brand-ring)]">
          <div className="p-6 sm:p-7">
            {error && (
              <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-[var(--brand-muted)]">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 bg-[var(--brand-panel)] px-3 py-2 text-[var(--brand-text)] placeholder-zinc-500 outline-none transition focus:border-[var(--brand-accent)] focus:ring-4 focus:ring-[var(--brand-accent)]/15"
                  placeholder="yourname"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-[var(--brand-muted)]">
                    Password
                  </label>
                  <a href="/forgot" className="text-xs font-medium text-[var(--brand-muted)] hover:text-[var(--brand-text)]">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-white/10 bg-[var(--brand-panel)] px-3 py-2 pr-10 text-[var(--brand-text)] placeholder-zinc-500 outline-none transition focus:border-[var(--brand-accent)] focus:ring-4 focus:ring-[var(--brand-accent)]/15"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 grid w-10 place-items-center text-[var(--brand-muted)] hover:text-[var(--brand-text)]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--brand-accent)] hover:bg-[var(--brand-accent-2)] px-4 py-2.5 text-sm font-medium text-black transition focus:outline-none focus:ring-4 focus:ring-[var(--brand-accent)]/30 disabled:opacity-60"
                >
                  {isLoading ? "Signing in…" : "Sign in"}
                </button>
              </div>
            </form>

            <p className="mt-4 text-center text-xs text-[var(--brand-muted)]">
              Don’t have an account{" "}
              <a href="/signup" className="font-medium text-[var(--brand-text)] hover:opacity-80">
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
