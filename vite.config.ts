
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isElectron = process.env.ELECTRON === 'true';
  
  return {
    base: isElectron ? './' : '/',
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react({
        jsxImportSource: 'react',
      }),
      mode === 'development' && !isElectron && componentTagger(),
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
        external: isElectron ? [] : [],
        output: {
          manualChunks: isElectron ? undefined : (id) => {
            // Core vendor chunks
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('react-router')) {
                return 'vendor-router';
              }
              if (id.includes('@radix-ui') || id.includes('lucide-react')) {
                return 'vendor-ui';
              }
              if (id.includes('@supabase') || id.includes('@tanstack')) {
                return 'vendor-data';
              }
              if (id.includes('recharts') || id.includes('chart')) {
                return 'vendor-charts';
              }
              return 'vendor-misc';
            }
            
            // App chunks by feature
            if (id.includes('/pages/')) {
              if (id.includes('Dashboard') || id.includes('Analytics')) {
                return 'pages-dashboard';
              }
              if (id.includes('Auth') || id.includes('Onboarding')) {
                return 'pages-auth';
              }
              if (id.includes('Therapy') || id.includes('AI')) {
                return 'pages-therapy';
              }
              return 'pages-misc';
            }
            
            if (id.includes('/components/')) {
              if (id.includes('dashboard') || id.includes('analytics')) {
                return 'components-dashboard';
              }
              if (id.includes('auth') || id.includes('onboarding')) {
                return 'components-auth';
              }
              if (id.includes('therapy') || id.includes('ai')) {
                return 'components-therapy';
              }
              if (id.includes('ui/')) {
                return 'components-ui';
              }
              return 'components-misc';
            }
          }
        }
      },
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development',
      chunkSizeWarningLimit: 1000,
      target: 'esnext',
      minify: 'esbuild',
    }
  };
});
