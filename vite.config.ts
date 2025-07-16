
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isElectron = process.env.ELECTRON === 'true';
  
  return {
    base: isElectron ? './' : '/',
    // Force complete cache invalidation
    cacheDir: '.vite-fresh-' + Date.now(),
    clearScreen: false,
    server: {
      host: "::",
      port: 8080,
      fs: {
        strict: false
      },
      hmr: {
        overlay: false
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
        "react": path.resolve(__dirname, "./node_modules/react"),
        "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      },
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'zustand'
      ],
      exclude: [
        'src/contexts/ThemeContext.tsx'
      ],
      force: true,
      esbuildOptions: {
        target: 'es2020'
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
