// client/src/api/authAPI.tsx
import axios from 'axios';
console.log('[authAPI] loaded');
type LoginPayload = {
  email?: string;
  username?: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: { id: number; username: string; email: string };
};

// Vite dev proxy will forward /api -> http://localhost:3001
const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // fine to keep even if you use header tokens
});

// ───────────────────────────────────────────────
// Token helpers
// ───────────────────────────────────────────────

const TOKEN_KEY = 'auth_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
  }
}

// Initialize header from any existing token on page load
const existing = getToken();
if (existing) {
  api.defaults.headers.common['Authorization'] = `Bearer ${existing}`;
}

// Optional: auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      setToken(null);
    }
    return Promise.reject(err);
  }
);

// ───────────────────────────────────────────────
// Auth calls
// ───────────────────────────────────────────────

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);

  // Expecting { token, user } from server
  if (!data?.token) {
    console.error('[authAPI] Login response missing token!', data);
    throw new Error('Login succeeded but no token was returned by the server.');
  }

  setToken(data.token);
  return data;
}

export async function logout() {
  setToken(null);
}

export async function me() {
  const { data } = await api.get('/auth/me');
  return data;
}

export { api };
