
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from '@/components/ui/toaster';
import { MinimalAuthProvider } from '@/components/MinimalAuthProvider';
import App from './App.tsx';
import './index.css';
import { bulletproofServiceManager } from './utils/bulletproofServiceManager';
import BulletproofReactWrapper from './components/BulletproofReactWrapper';
import BulletproofErrorBoundary from './components/BulletproofErrorBoundary';
import i18n from './i18n';

// Skip testing infrastructure entirely in production to prevent resource errors
if (import.meta.env.DEV && typeof window !== 'undefined' && !window.location.href.includes('lovableproject.com')) {
  // Only load in true development mode, not on lovable preview
  import('./test/watch-mode').then(({ watchRunner }) => {
    console.log('🔬 Development testing mode enabled');
  }).catch((error) => {
    console.warn('Test mode failed to load:', error);
  });
}

// Initialize bulletproof services (non-blocking)
bulletproofServiceManager.initializeServices().catch(error => {
  console.warn('Some services failed to initialize:', error);
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Immediate loading state with debug controls
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
      <p className="text-therapy-600 font-medium">Loading TherapySync...</p>
      
      {/* Development mode controls */}
      {import.meta.env.DEV && (
        <div className="mt-8 space-y-2">
          <button 
            onClick={() => {
              localStorage.setItem('auth_debug', 'true');
              window.location.reload();
            }}
            className="block mx-auto bg-yellow-500 text-white px-4 py-2 rounded text-sm hover:bg-yellow-600"
          >
            Skip Auth (Dev Mode)
          </button>
          <p className="text-xs text-gray-500">
            Dev tools: Press F12 and check console for detailed logs
          </p>
        </div>
      )}
    </div>
  </div>
);

root.render(
  <React.StrictMode>
    <BulletproofReactWrapper>
      <React.Suspense fallback={<LoadingFallback />}>
        <I18nextProvider i18n={i18n}>
          <div className="min-h-screen bg-white">
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <MinimalAuthProvider>
                  <App />
                  <Toaster />
                </MinimalAuthProvider>
              </BrowserRouter>
            </QueryClientProvider>
          </div>
        </I18nextProvider>
      </React.Suspense>
    </BulletproofReactWrapper>
  </React.StrictMode>
);
