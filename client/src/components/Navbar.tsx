// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--brand-panel)]/70 backdrop-blur ring-1 ring-white/10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between text-[var(--brand-text)]">
        <Link to="/" className="text-lg font-semibold">ShadowStack</Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-[var(--brand-muted)] hover:text-[var(--brand-text)]">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/board" className="text-sm text-[var(--brand-muted)] hover:text-[var(--brand-text)]">Board</Link>
              <button
                onClick={logout}
                className="rounded px-3 py-1 text-sm border border-white/10 hover:bg-white/5"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded px-3 py-1 text-sm border border-white/10 hover:bg-white/5">Login</Link>
              <Link to="/register" className="text-sm text-[var(--brand-muted)] hover:text-[var(--brand-text)]">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
