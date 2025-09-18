// client/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "127.0.0.1",
    port: 3000,
    proxy: {
      "/api": { target: "http://127.0.0.1:3001", changeOrigin: true },
      // (you don’t need a separate /auth proxy; it’s /api/auth/…)
    },
  },
  preview: { port: 4173, strictPort: true },
});
