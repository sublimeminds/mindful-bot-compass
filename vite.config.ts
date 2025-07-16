
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isElectron = process.env.ELECTRON === 'true';
  
  return {
    base: isElectron ? './' : '/',
    // Force nuclear cache reset - different every time
    cacheDir: `.vite-destroy-cache-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
    clearScreen: false,
    server: {
      host: "::",
      port: 8080,
      fs: {
        strict: false
      },
      hmr: {
        overlay: false,
        clientPort: 8080
      }
    },
    plugins: [
      react({
        jsxImportSource: 'react',
      }),
      // Wrap componentTagger with safety checks
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
      },
      // Force fresh module resolution
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      // Force complete rebuild and exclude all source files
      exclude: ['src/**', '@/**', './src/**'],
      force: true,
      disabled: false,
      esbuildOptions: {
        target: 'es2020',
        jsx: 'automatic'
      }
    },
    define: {
      global: 'globalThis',
      'process.env.NODE_ENV': JSON.stringify(mode === 'development' ? 'development' : 'production'),
    },
    build: {
      rollupOptions: {
        external: isElectron ? [] : [],
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
