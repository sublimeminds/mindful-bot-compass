import React, { useState, useEffect } from 'react';

interface LoadingBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  timeout?: number;
}

export const LoadingBoundary: React.FC<LoadingBoundaryProps> = ({ 
  children, 
  fallback,
  timeout = 10000 // 10 seconds max loading
}) => {
  const [isTimeout, setIsTimeout] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeout(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  if (hasError || isTimeout) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold mb-2">
            {hasError ? 'Something went wrong' : 'Loading is taking longer than expected'}
          </h2>
          <p className="text-muted-foreground mb-4">
            {hasError ? 'Please refresh the page to try again.' : 'Please wait or refresh the page.'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  try {
    return <>{children}</>;
  } catch (error) {
    setHasError(true);
    return null;
  }
};

export default LoadingBoundary;