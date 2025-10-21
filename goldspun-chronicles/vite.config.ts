import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React and React DOM
          'react-vendor': ['react', 'react-dom'],
          // React Router
          'router': ['react-router-dom'],
          // UI Libraries
          'ui-vendor': ['@radix-ui/react-slot', '@radix-ui/react-toast', '@radix-ui/react-tooltip', '@radix-ui/react-switch', '@radix-ui/react-select', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          // Data fetching and state management
          'data-vendor': ['@tanstack/react-query'],
          // Chart libraries
          'chart-vendor': ['recharts'],
          // Utility libraries
          'utils-vendor': ['clsx', 'tailwind-merge', 'class-variance-authority', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}));
