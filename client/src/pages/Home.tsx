// src/pages/Home.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to Your Kanban</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Plan sprints, track tickets, and keep your work flowing. Sign in to access your board.
        </p>
        <div className="flex justify-center gap-3">
          {isAuthenticated ? (
            <Link to="/board" className="rounded-md px-5 py-2 border">
              Go to Board
            </Link>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-5 py-2 border">Login</Link>
              <Link to="/register" className="rounded-md px-5 py-2 border">Create Account</Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
