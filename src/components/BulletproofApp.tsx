import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from '@/components/ui/toaster';
import { MinimalAuthProvider } from '@/components/MinimalAuthProvider';
import AppRouter from '@/components/AppRouter';
import i18n from '../i18n';
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

// Single, bulletproof error boundary
class BulletproofErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('BulletproofErrorBoundary: App error caught', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('BulletproofErrorBoundary: Component stack', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{
            maxWidth: '400px',
            textAlign: 'center',
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ color: '#dc2626', marginBottom: '20px' }}>
              TherapySync Loading Error
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              We're experiencing a technical issue. Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const BulletproofApp = () => {
  console.log('BulletproofApp: Starting with simplified architecture...');
  
  return (
    <BulletproofErrorBoundary>
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
    </BulletproofErrorBoundary>
  );
};

export default BulletproofApp;