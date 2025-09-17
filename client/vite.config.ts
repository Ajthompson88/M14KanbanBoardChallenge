// Vite configuration file
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';

// Dev server on :3000; proxy API & auth to :3001 (your Express server)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1',
    port: 3000,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
      },
    },
  },
  // (Optional) nice defaults for `vite preview`
  preview: {
    port: 4173,
    strictPort: true,
  },
});
