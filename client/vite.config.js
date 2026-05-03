import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxy /api calls to the backend during development so we avoid CORS issues
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      // Proxy short-code redirects too (only for dev convenience)
    },
  },
});
