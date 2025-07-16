
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
  const superRandom = Math.random().toString(36).substring(2, 20);
  const nuclearRandom = Math.random().toString(36).substring(2, 20);
  
  return {
    base: isElectron ? './' : '/',
    // NUCLEAR cache destruction - change everything + force rebuild
    cacheDir: `.vite-NUCLEAR-REBUILD-${megaTimestamp}-${ultraRandom}-${extraRandom}-${superRandom}-${nuclearRandom}`,
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
      }
    },
    esbuild: {
      // Force fresh compilation with different target and build ID
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      target: 'es2023', // Changed target again to force recompilation
      define: {
        __NUCLEAR_REBUILD_ID__: JSON.stringify(`${megaTimestamp}-${nuclearRandom}`)
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
        // Emergency alias to bypass old ThemeContext
        "@/contexts/ThemeContext": path.resolve(__dirname, "./src/utils/BulletproofTheme.tsx"),
      },
      // Force fresh module resolution
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      // NUCLEAR exclusion - exclude ALL contexts and force rebuild
      exclude: ['src/**', '@/**', './src/**', 'contexts/**', 'ThemeContext', '**/ThemeContext*', '**/contexts/**'],
      include: ['react', 'react-dom'], // Explicitly include React
      force: true,
      entries: [],
      esbuildOptions: {
        target: 'es2024',
        jsx: 'automatic',
        define: {
          __FORCE_REBUILD__: JSON.stringify(true)
        }
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
