// src/context/AuthContext.ts
import { createContext } from "react";

export type AuthCtx = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthCtx | undefined>(undefined);
