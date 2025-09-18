// client/src/components/Navbar.tsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getToken } from "../api/authAPI"; // <-- your authAPI.tsx

function linkCls({ isActive }: { isActive: boolean }) {
  return [
    "px-3 py-1.5 rounded-md text-sm transition-colors",
    "text-[var(--brand-text)]/80 hover:text-[var(--brand-text)]",
    isActive ? "bg-white/5 ring-1 ring-white/10" : "",
  ].join(" ");
}

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const authed = !!getToken(); // derive from token stored by authAPI.tsx

  return (
    <nav className="sticky top-0 z-50 bg-[var(--brand-panel)]/70 backdrop-blur-md ring-1 ring-white/10">
      <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6">
        <Link to="/" className="text-base font-semibold tracking-wide text-[var(--brand-text)]">
          ShadowStack
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {authed ? (
            <>
              <NavLink to="/" className={linkCls}>Home</NavLink>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="px-3 py-1.5 rounded-lg text-sm font-medium
                           bg-[var(--brand-accent)] text-black
                           hover:bg-[var(--brand-accent-2)] transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkCls}>Login</NavLink>
              <NavLink to="/register" className={linkCls}>Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
