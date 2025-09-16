// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { ReactNode } from "react";

type Props = { children: ReactNode };

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-6 text-center">Checking session…</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
