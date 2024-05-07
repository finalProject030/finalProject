import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Update the target URL
        secure: false,
        changeOrigin: true, // Add this option if needed
      },
    },
  },
  plugins: [react()],
});
