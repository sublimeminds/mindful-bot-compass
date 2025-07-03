
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { SimpleAuthProvider } from '@/components/SimpleAuthProvider';
import App from './App.tsx';
import './index.css';

console.log('Starting TherapySync with simple auth...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SimpleAuthProvider>
          <div className="min-h-screen bg-white">
            <App />
            <Toaster />
          </div>
        </SimpleAuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
