import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";

// Check if we are running inside a Docker container
const isDocker = fs.existsSync("/.dockerenv");

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/api": {
        target: isDocker ? "http://backend:3000" : "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        ws: true, // Required for Socket.io WebSocket transport
      },
    },
  },
});
