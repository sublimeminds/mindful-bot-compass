
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
      // Ensure consistent React handling
      jsxImportSource: 'react',
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Explicit React aliases to prevent multiple instances
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
    // Dedupe to ensure single React instance
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    // Include React dependencies for proper pre-bundling
    include: [
      'react', 
      'react-dom', 
      'react/jsx-runtime',
      '@supabase/supabase-js',
      '@tanstack/react-query',
      'lucide-react'
    ],
    // Force rebuild to ensure clean state and clear cache
    force: true
  },
  define: {
    global: 'globalThis',
    // Ensure React is available in production builds
    'process.env.NODE_ENV': JSON.stringify(mode === 'development' ? 'development' : 'production'),
  },
  build: {
    // Ensure React is properly bundled
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['@supabase/supabase-js', '@tanstack/react-query'],
          icons: ['lucide-react']
        }
      }
    }
  }
}));
