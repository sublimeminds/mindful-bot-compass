
import React, { Component, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { SimpleAuthProvider } from "@/components/SimpleAuthProvider";
import AppRouter from "@/components/AppRouter";
import SimpleErrorBoundary from "@/components/SimpleErrorBoundary";
import { initI18nSafely } from "@/i18n/safeInit";

// Initialize i18n safely after React is ready
initI18nSafely();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Loading fallback component
const LoadingFallback = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb'
  }}>
    <div style={{
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid #e5e7eb',
        borderTop: '3px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 15px'
      }}></div>
      <p style={{ color: '#6b7280' }}>Loading...</p>
    </div>
  </div>
);

class FullApp extends Component {
  componentDidMount() {
    console.log('FullApp: Full application loaded successfully');
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('FullApp: Critical error in full application', error, errorInfo);
  }

  render() {
    return (
      <SimpleErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <SimpleAuthProvider>
            <BrowserRouter>
              <Suspense fallback={<LoadingFallback />}>
                <AppRouter />
              </Suspense>
            </BrowserRouter>
          </SimpleAuthProvider>
        </QueryClientProvider>
      </SimpleErrorBoundary>
    );
  }
}

export default FullApp;
