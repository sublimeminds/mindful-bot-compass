import React from 'react';
import SafeErrorBoundary from '@/components/SafeErrorBoundary';

interface AuthProviderWrapperProps {
  children: React.ReactNode;
  authValue: any;
}

/**
 * Isolated Auth Context Provider with error boundary
 * Prevents auth errors from breaking the entire app
 */
export const AuthProviderWrapper: React.FC<AuthProviderWrapperProps> = ({ children, authValue }) => {
  return (
    <SafeErrorBoundary 
      name="AuthProvider"
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Authentication Error</h2>
            <p className="text-gray-600 mb-4">The authentication service is temporarily unavailable.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      }
    >
      {children}
    </SafeErrorBoundary>
  );
};

interface QueryProviderWrapperProps {
  children: React.ReactNode;
  client: any;
}

/**
 * Isolated Query Client Provider with error boundary
 * Prevents query client errors from breaking the entire app
 */
export const QueryProviderWrapper: React.FC<QueryProviderWrapperProps> = ({ children, client }) => {
  return (
    <SafeErrorBoundary 
      name="QueryProvider"
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Data Service Error</h2>
            <p className="text-gray-600 mb-4">The data service is temporarily unavailable.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      }
    >
      {children}
    </SafeErrorBoundary>
  );
};

interface RouterWrapperProps {
  children: React.ReactNode;
}

/**
 * Isolated Router with error boundary
 * Prevents routing errors from breaking the entire app
 */
export const RouterWrapper: React.FC<RouterWrapperProps> = ({ children }) => {
  return (
    <SafeErrorBoundary 
      name="Router"
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Navigation Error</h2>
            <p className="text-gray-600 mb-4">The navigation system encountered an error.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Go Home
            </button>
          </div>
        </div>
      }
    >
      {children}
    </SafeErrorBoundary>
  );
};