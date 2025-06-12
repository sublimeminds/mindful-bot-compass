
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
      // Configure SWC for better React hook handling
      jsxImportSource: 'react',
      tsDecorators: true,
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Add explicit React alias to prevent bundling conflicts
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
    dedupe: ['react', 'react-dom'], // Ensure single React instance
  },
  optimizeDeps: {
    // Ensure React is properly pre-bundled
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    force: true
  },
  define: {
    // Ensure React is available globally in development
    global: 'globalThis',
  },
  esbuild: {
    // Remove JSX inject to prevent conflicts
    jsx: 'automatic',
  }
}));
