
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      jsxImportSource: 'react',
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react/jsx-runtime',
      '@supabase/supabase-js',
      '@tanstack/react-query',
      'lucide-react'
    ],
    force: true
  },
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(mode === 'development' ? 'development' : 'production'),
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        // Remove manual chunking that was causing React to be split incorrectly
        manualChunks: undefined
      }
    }
  }
}));
