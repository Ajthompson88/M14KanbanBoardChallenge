/* eslint-disable react-refresh/only-export-components */
// src/context/AuthContext.tsx
import React, { createContext, useContext, useMemo, useState } from "react";

type AuthCtx = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token"));

  const value = useMemo<AuthCtx>(() => ({
    isAuthenticated: !!token,
    login: (t) => { localStorage.setItem("auth_token", t); setToken(t); },
    logout: () => { localStorage.removeItem("auth_token"); setToken(null); },
  }), [token]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
};
