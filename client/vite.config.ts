import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {config} from "./src/config/config"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    // strictPort: true,
    port: 3000, // config.server.port
    allowedHosts: ["ourstory.fly.dev"]
  },
});
