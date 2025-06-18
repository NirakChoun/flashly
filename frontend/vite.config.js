import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target:
          process.env.VITE_BACKEND_URL ||
          "https://flashly-api-adwh.onrender.com",
        changeOrigin: true,
        secure: process.env.NODE_ENV === "production",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
