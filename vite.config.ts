
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isElectron = process.env.ELECTRON === 'true';
  const megaTimestamp = Date.now();
  const ultraRandom = Math.random().toString(36).substring(2, 20);
  const extraRandom = Math.random().toString(36).substring(2, 20);
  
  return {
    base: isElectron ? './' : '/',
    // ULTIMATE cache destruction
    cacheDir: `.vite-DESTROY-ALL-CACHE-${megaTimestamp}-${ultraRandom}-${extraRandom}`,
    clearScreen: false,
    server: {
      host: "::",
      port: 8081, // Changed port to force complete restart
      fs: {
        strict: false
      },
      hmr: {
        overlay: false,
        clientPort: 8081, // Match new port
        // Force HMR to reload everything
        port: 8081 // Match new port
      }
    },
    esbuild: {
      // Force fresh compilation with different target
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      target: 'es2022', // Changed target to force recompilation
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
      // ULTIMATE exclusion - force everything to rebuild
      exclude: ['src/**', '@/**', './src/**', 'contexts/**', 'ThemeContext', 'react', 'react-dom'],
      force: true,
      disabled: true, // Completely disable optimization
      entries: [],
      esbuildOptions: {
        target: 'es2022', // Changed to force different compilation
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
