import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from '@/components/ui/toaster';
import { MinimalAuthProvider } from '@/components/MinimalAuthProvider';
import MinimalErrorBoundary from '@/components/MinimalErrorBoundary';
import App from '../App';
import i18n from '../i18n';

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const AppWithContexts = () => {
  console.log('AppWithContexts: Initializing with all contexts');
  
  return (
    <MinimalErrorBoundary>
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
    </MinimalErrorBoundary>
  );
};

export default AppWithContexts;