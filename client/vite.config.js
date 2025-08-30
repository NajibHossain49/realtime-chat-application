import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "mastodon-direct-colt.ngrok-free.app", // added ngrok host here for production check
    ],
  },
});
