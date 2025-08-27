// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="w-full border-b bg-white/70 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">Kanban</Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:underline">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/board" className="hover:underline">Board</Link>
              <button onClick={logout} className="rounded px-3 py-1 border">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded px-3 py-1 border">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
