// client/src/components/Navbar.tsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
// If you moved helpers to utils, change the import to: "../utils/auth"
import { getToken } from "../api/authAPI";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Use local storage helper to decide if we're logged in
  const authed = !!getToken();

  const linkBase =
    "px-3 py-1.5 text-sm rounded-md text-[var(--brand-text)] hover:bg-white/5 transition-colors";

  return (
    <nav className="sticky top-0 z-50 bg-[var(--brand-panel)]/70 backdrop-blur-sm ring-1 ring-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-12 flex items-center justify-between">
          {/* Brand (left) */}
          <Link to="/" className="font-semibold tracking-wide">
            ShadowStack
          </Link>

          {/* Right-side links */}
          <div className="flex items-center gap-2">
            {authed ? (
              <>
                <NavLink to="/" className={linkBase}>
                  Home
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login", { replace: true });
                  }}
                  className="px-3 py-1.5 text-sm rounded-md bg-[var(--brand-accent)] text-black hover:bg-[var(--brand-accent-2)] transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkBase}>
                  Login
                </NavLink>
                <NavLink to="/register" className={linkBase}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
