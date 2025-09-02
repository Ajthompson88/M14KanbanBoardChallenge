import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev server on :3000; proxy API & auth to :3001 (your Express server)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
      "/auth": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // (Optional) nice defaults for `vite preview`
  preview: {
    port: 4173,
    strictPort: true,
  },
});
