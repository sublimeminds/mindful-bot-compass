import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from '@/components/ui/toaster';
import { MinimalAuthProvider } from '@/components/MinimalAuthProvider';
import AppRouter from '@/components/AppRouter';
import i18n from './i18n';
import './App.css';

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Bulletproof error boundary
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('AppErrorBoundary: Critical error', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('AppErrorBoundary: Error details', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md">
            <h1 className="text-2xl font-bold text-therapy-600 mb-4">TherapySync</h1>
            <p className="text-slate-600 mb-4">Something went wrong. Refreshing...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600 mx-auto"></div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  console.log('App: Starting TherapySync with robust setup...');
  
  return (
    <AppErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <div className="min-h-screen bg-white">
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <MinimalAuthProvider>
                <AppRouter />
                <Toaster />
              </MinimalAuthProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </div>
      </I18nextProvider>
    </AppErrorBoundary>
  );
}

export default App;