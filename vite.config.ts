import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In local dev, `vercel dev` serves /api automatically.
      // If you run plain `vite` instead, point this at your running
      // `vercel dev` port (default 3000) so /api/checkin resolves.
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
