// client/src/api/authAPI.tsx
import axios from "axios";

console.log("[authAPI] loaded");

export type LoginPayload = {
  email?: string;
  username?: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: { id: number; username: string; email: string };
};

// Axios instance — dev proxy will forward /api → http://localhost:3001
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// ── Token helpers ───────────────────────────────────────────────
const TOKEN_KEY = "auth_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common["Authorization"];
  }
}

// Initialize header on load if a token exists
const existing = getToken();
if (existing) {
  api.defaults.headers.common["Authorization"] = `Bearer ${existing}`;
}

// Optional: auto-clear token on 401s
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) setToken(null);
    return Promise.reject(err);
  }
);

// ── Auth calls ──────────────────────────────────────────────────
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  if (!data?.token) throw new Error("Login succeeded but no token was returned by the server.");
  setToken(data.token);
  return data;
}

export async function register(payload: RegisterPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/register", payload);
  if (!data?.token) throw new Error("Register succeeded but no token was returned by the server.");
  setToken(data.token);
  return data;
}

export async function logout() {
  setToken(null);
}

export async function me() {
  const { data } = await api.get("/auth/me");
  return data;
}
