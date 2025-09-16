// src/context/AuthProvider.tsx
import React, { useMemo, useState, useEffect } from "react";
import { AuthContext, type AuthCtx } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setToken(localStorage.getItem("auth_token"));
    setLoading(false);
  }, []);

  const value = useMemo<AuthCtx>(() => ({
    isAuthenticated: !!token,
    loading,
    login: (t) => { localStorage.setItem("auth_token", t); setToken(t); },
    logout: () => { localStorage.removeItem("auth_token"); setToken(null); },
  }), [token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
