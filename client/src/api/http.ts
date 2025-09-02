import axios from "axios";

// All calls go through the same origin; Vite proxies in dev,
// and in prod you’ll reverse-proxy /api and /auth behind the same domain.
export const api = axios.create({
  baseURL: "/",             // key: use relative paths → no CORS
  withCredentials: true,    // future-proof if you switch to cookies
  headers: { "Content-Type": "application/json" },
});

// Attach stored Bearer token (your authAPI sets localStorage after login)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
