import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="panel px-6 py-12 text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-3">
          Welcome to <span className="text-white">ShadowStack Kanban</span>
        </h1>
        <p className="text-[var(--brand-muted)]">
          Plan sprints, track tickets, and keep your work flowing. Sign in to access your board.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/register" className="btn btn-ghost">Create Account</Link>
        </div>
      </div>
    </div>
  );
}
