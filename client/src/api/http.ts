// src/api/http.ts
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: "/api",          // Vite proxy → server
  withCredentials: false,   // using Bearer tokens, not cookies
});

// Attach Authorization header if we have a token (typed, no `any`)
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    const value = `Bearer ${token}`;
    // Axios v1 headers can be an AxiosHeaders instance or a plain object
    if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers ?? {});
    }
    (config.headers as AxiosHeaders).set("Authorization", value);
  }
  return config;
});
