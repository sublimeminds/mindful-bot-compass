
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isElectron = process.env.ELECTRON === 'true';
  
  return {
    base: isElectron ? './' : '/',
    clearScreen: false,
    server: {
      host: "::",
      port: 8080,
      fs: {
        strict: false
      },
      hmr: {
        overlay: false,
        clientPort: 8080,
        port: 8080
      },
      // Aggressive no-cache headers to prevent stale imports
      headers: mode === 'development' ? {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'ETag': '"' + Date.now() + '"',
        'Last-Modified': new Date().toUTCString()
      } : {}
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      target: 'es2022'
    },
    plugins: [
      react({
        jsxImportSource: 'react',
      }),
      mode === 'development' && !isElectron && (() => {
        try {
          return componentTagger();
        } catch (error) {
          console.warn('Component tagger failed to initialize:', error);
          return null;
        }
      })(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Force redirect any ThemeContext imports to BulletproofTheme
        "@/contexts/ThemeContext": path.resolve(__dirname, "./src/utils/BulletproofTheme.tsx"),
      },
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
      force: false
    },
    define: {
      global: 'globalThis',
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: isElectron ? undefined : {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          }
        }
      },
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development',
    }
  };
});
