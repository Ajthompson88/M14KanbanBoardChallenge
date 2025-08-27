import { useState, FormEvent } from 'react';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (!username || !password) throw new Error('Please enter username and password.');
      // TODO: call your real login API here
      // await login({ username, password });
      // navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white text-sm font-bold">
            KB
          </div>
          <div>
            <h1 className="text-xl center font-semibold text-slate-900">Krazy Kanban Board</h1>
            <p className="text-sm text-slate-500">Sign in to continue</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
          <div className="p-6 sm:p-7">
            {/* Optional: Tailwind alive banner */}
            {/* <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-emerald-700">Tailwind v4 ACTIVE ✅</div> */}

            {error && (
              <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  placeholder="yourname"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <a href="/forgot" className="text-xs font-medium text-slate-600 hover:text-slate-900">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-slate-900 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v: boolean) => !v)}
                    className="absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-500 hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                  className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:opacity-60"
                >
                  {isLoading ? 'Signing in…' : 'Sign in'}
                </button>
              </div>
            </form>

            <p className="mt-4 text-center text-xs text-slate-500">
              Don’t have an account?{' '}
              <a href="/signup" className="font-medium text-slate-700 hover:text-slate-900">
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
