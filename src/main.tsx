
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { EnhancedAuthProvider } from '@/components/EnhancedAuthProvider';
import App from './App.tsx';
import './index.css';
import { CSSProtection } from './utils/cssProtection';
import { serviceHealthManager } from './utils/serviceHealthManager';

// Import testing infrastructure in development
if (import.meta.env.DEV) {
  import('./test/watch-mode').then(({ watchRunner }) => {
    console.log('🔬 Development testing mode enabled');
  });
}

// Initialize CSS protection before anything else
CSSProtection.init();

// Register services with health monitoring
serviceHealthManager.registerService({
  name: 'performanceService',
  loader: async () => {
    const module = await import('./services/performanceService');
    return module.performanceService;
  },
  required: false,
  timeout: 3000,
  retryAttempts: 2
});

serviceHealthManager.registerService({
  name: 'rateLimitService', 
  loader: async () => {
    const module = await import('./services/rateLimitService');
    return module.rateLimitService;
  },
  required: false,
  timeout: 2000,
  retryAttempts: 1
});

// Safe i18n initialization with better error handling
serviceHealthManager.registerService({
  name: 'i18n',
  loader: async () => {
    const module = await import('./i18n');
    return module;
  },
  required: false,
  timeout: 2000,
  retryAttempts: 1
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Start health monitoring
serviceHealthManager.startHealthChecks();

// Initialize services after a short delay to not block initial render
setTimeout(() => {
  // Safe service initialization with health manager
  const performanceService = serviceHealthManager.getService('performanceService');
  if (performanceService) {
    try {
      performanceService.startPerformanceMonitoring?.();
      performanceService.monitorMemoryUsage?.();
      performanceService.recordMetric?.('AppStartup', performance.now());
    } catch (error) {
      console.warn('Performance service initialization failed:', error);
    }
  }
  
  const rateLimitService = serviceHealthManager.getService('rateLimitService');
  if (rateLimitService) {
    try {
      rateLimitService.startCleanup?.();
    } catch (error) {
      console.warn('Rate limit service initialization failed:', error);
    }
  }

  // Log service health summary
  const healthSummary = serviceHealthManager.getHealthSummary();
  console.log('Services initialized. Health summary:', healthSummary);
}, 100);

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Show immediate loading state
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
      <p className="text-therapy-600 font-medium">Loading TherapySync...</p>
    </div>
  </div>
);

root.render(
  <React.StrictMode>
    <React.Suspense fallback={<LoadingFallback />}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <EnhancedAuthProvider>
              <App />
              <Toaster />
            </EnhancedAuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </React.Suspense>
  </React.StrictMode>
);
