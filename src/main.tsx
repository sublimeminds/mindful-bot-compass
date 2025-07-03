
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { EnhancedAuthProvider } from '@/components/EnhancedAuthProviderV2';
import SafeErrorBoundary from '@/components/SafeErrorBoundary';
import { safeServiceManager } from '@/utils/safeServiceManager';
import App from './App.tsx';
import './index.css';

console.log('Starting TherapySync Phase 3 - Enhanced with safety measures...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Initialize services in background (non-blocking)
safeServiceManager.initializeServices();

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          return (error as any).status >= 500 && failureCount < 3;
        }
        return failureCount < 3;
      },
    },
  },
});

root.render(
  <React.StrictMode>
    <SafeErrorBoundary name="Root">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SafeErrorBoundary name="AuthProvider">
            <EnhancedAuthProvider>
              <div className="min-h-screen bg-white">
                <App />
                <Toaster />
              </div>
            </EnhancedAuthProvider>
          </SafeErrorBoundary>
        </BrowserRouter>
      </QueryClientProvider>
    </SafeErrorBoundary>
  </React.StrictMode>
);
