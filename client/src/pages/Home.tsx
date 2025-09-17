import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen bg-[var(--brand-bg)] text-[var(--brand-text)]">
      <section className="mx-auto max-w-6xl px-4 py-12 text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to ShadowStack Kanban</h1>
        <p className="text-[var(--brand-muted)] max-w-2xl mx-auto">
          Plan sprints, track tickets, and keep your work flowing. Sign in to access your board.
        </p>
        <div className="flex justify-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/board"
              className="rounded-md px-5 py-2 bg-[var(--brand-accent)] hover:bg-[var(--brand-accent-2)] text-black"
            >
              Go to Board
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-5 py-2 bg-[var(--brand-accent)] hover:bg-[var(--brand-accent-2)] text-black"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md px-5 py-2 border border-white/10 hover:bg-white/5"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
