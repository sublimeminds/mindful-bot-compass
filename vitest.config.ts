/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    testTimeout: 30000, // 30 seconds for complex integration tests
    hookTimeout: 30000, // 30 seconds for setup/teardown
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'build/',
        'public/',
        '**/*.test.*',
        '**/__tests__/**'
      ],
      thresholds: {
        global: {
          branches: 70, // Slightly lower for complex app
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
    // Run tests in specific order
    sequence: {
      hooks: 'list',
      setupFiles: 'list'
    },
    // Reporter configuration
    reporter: ['verbose', 'html'],
    outputFile: {
      html: './test-results/index.html'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})