
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import { SessionProvider } from "./contexts/SessionContext";
import { TherapistProvider } from "./contexts/TherapistContext";
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App.tsx";
import "./index.css";
import { DebugLogger } from "./utils/debugLogger";

// Initialize debug logging
DebugLogger.info('Application: Starting initialization', { 
  component: 'main',
  isDevelopment: import.meta.env.DEV,
  mode: import.meta.env.MODE
});

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

DebugLogger.debug('Application: QueryClient configured', {
  component: 'main',
  staleTime: 1000 * 60 * 5,
  retry: 1
});

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    DebugLogger.debug('Application: Registering service worker', { component: 'main' });
    
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        DebugLogger.info('Application: Service worker registered successfully', {
          component: 'main',
          registration
        });
      })
      .catch((registrationError) => {
        DebugLogger.error('Application: Service worker registration failed', registrationError, {
          component: 'main'
        });
      });
  });
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  const error = new Error("Root element not found");
  DebugLogger.error('Application: Root element not found', error, { component: 'main' });
  throw error;
}

DebugLogger.debug('Application: Root element found', { component: 'main' });

// Global error handler
window.addEventListener('error', (event) => {
  DebugLogger.error('Application: Global error caught', event.error, {
    component: 'main',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    message: event.message
  });
});

window.addEventListener('unhandledrejection', (event) => {
  DebugLogger.error('Application: Unhandled promise rejection', event.reason, {
    component: 'main',
    reason: event.reason
  });
});

DebugLogger.info('Application: Starting React render', { component: 'main' });

// Use StrictMode for better React development experience
createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AdminProvider>
              <SessionProvider>
                <TherapistProvider>
                  <App />
                </TherapistProvider>
              </SessionProvider>
            </AdminProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);

DebugLogger.info('Application: React render complete', { component: 'main' });
