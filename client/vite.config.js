import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react-swc'
export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
        ws: true, // Required for Socket.io WebSocket transport
      },
    },
  },
});
