
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isElectron = process.env.ELECTRON === 'true';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extraRandom = Math.random().toString(36).substring(2, 15);
  
  return {
    base: isElectron ? './' : '/',
    // NUCLEAR cache reset - multiple random values
    cacheDir: `.vite-EMERGENCY-RESET-${timestamp}-${random}-${extraRandom}`,
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
    esbuild: {
      // Force fresh compilation
      drop: mode === 'production' ? ['console', 'debugger'] : [],
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
      // Nuclear option - exclude everything and force rebuild
      exclude: ['src/**', '@/**', './src/**', 'contexts/**'],
      force: true,
      disabled: false,
      entries: [],
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
