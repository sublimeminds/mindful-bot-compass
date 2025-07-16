import React from 'react';

// Add error boundary to catch crashes
class ErrorBoundary extends React.Component<
  { children: React.ReactNode }, 
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('🚨 AppSelector Error Boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 AppSelector Error details:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              Error: {this.state.error?.message || 'Unknown error'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Move lazy imports outside component to prevent recreation on each render
const SuperAdminApp = React.lazy(() => import('./SuperAdminApp'));
const MainApp = React.lazy(() => import('./MainApp'));

const AppSelector: React.FC = () => {
  // Check if current path is for super admin
  const currentPath = window.location.pathname;
  const isAdminPath = currentPath.startsWith('/secure-admin-');

  console.log('🔍 AppSelector: Rendering for path:', currentPath, 'isAdmin:', isAdminPath);

  if (isAdminPath) {
    return (
      <ErrorBoundary>
        <React.Suspense fallback={
          <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="text-white">Loading Admin...</div>
          </div>
        }>
          <SuperAdminApp />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // Otherwise, render the main app
  return (
    <ErrorBoundary>
      <React.Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-foreground">Loading...</div>
        </div>
      }>
        <MainApp />
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default AppSelector;
