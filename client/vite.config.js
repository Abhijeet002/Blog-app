import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
  },
  server: {
    proxy: {
      // Any request starting with /api or /auth will be proxied
      "/auth": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/posts": "http://localhost:5000",
    },
  },
});
