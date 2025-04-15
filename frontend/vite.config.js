import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Enable HMR (Hot Module Replacement) for fast updates in development
    hmr: true,
    
    // Optionally, you can set up a proxy to handle API requests to the backend
    proxy: {
      "/api": "http://localhost:8000", // example of API proxying for development
    },
  },
  build: {
    // Optional: you can adjust build settings for development here, though typically you wouldn't need to
    sourcemap: true,  // Helpful for debugging during development
    minify: false,    // Disable minification in development for easier debugging
    outDir: "dist",   // Default output folder for builds (can be customized if needed)
  },
});
