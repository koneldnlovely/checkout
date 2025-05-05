
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { mockApiPlugin } from "./src/mocks/mockPlugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/", // Use root-relative paths for assets
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    // Ensure proper output directory
    outDir: "dist",
    // Generate manifest for better asset tracking
    manifest: true,
    // Optimize chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Put big dependencies in a vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    // Set a reasonable chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Minify for production
    minify: mode === 'production',
  },
  plugins: [
    react(),
    mode === 'development' && mockApiPlugin(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add specific optimizations for date-fns
  optimizeDeps: {
    include: ['date-fns'],
    esbuildOptions: {
      target: 'es2020'
    }
  },
}));
