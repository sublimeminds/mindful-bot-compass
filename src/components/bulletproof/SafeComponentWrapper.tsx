import React, { Component, ReactNode, Suspense } from 'react';

interface SafeComponentWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
  retryOnError?: boolean;
  maxRetries?: number;
}

interface SafeComponentWrapperState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
  isLoading: boolean;
}

export class SafeComponentWrapper extends Component<SafeComponentWrapperProps, SafeComponentWrapperState> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: SafeComponentWrapperProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
      isLoading: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<SafeComponentWrapperState> {
    return {
      hasError: true,
      error,
      isLoading: false
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const componentName = this.props.name || 'UnknownComponent';
    console.error(`SafeComponentWrapper[${componentName}]: Component error:`, error, errorInfo);

    // Auto-retry if enabled
    if (this.props.retryOnError && this.state.retryCount < (this.props.maxRetries || 3)) {
      this.scheduleRetry();
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  scheduleRetry = () => {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }

    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, this.state.retryCount) * 1000;
    
    this.retryTimeout = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        retryCount: prevState.retryCount + 1,
        isLoading: false
      }));
    }, delay);
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      isLoading: true
    });

    // Give a moment for the component to reset
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 100);
  };

  render() {
    const { children, fallback, name = 'Component' } = this.props;
    const { hasError, error, isLoading, retryCount } = this.state;

    // Loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-2 text-sm text-muted-foreground">Reloading {name}...</span>
        </div>
      );
    }

    // Error state
    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return <>{fallback}</>;
      }

      // Default error UI
      return (
        <div className="border border-destructive/20 rounded-lg p-4 m-2 bg-destructive/5">
          <div className="flex items-center mb-2">
            <div className="h-4 w-4 rounded-full bg-destructive mr-2"></div>
            <h3 className="font-medium text-destructive">
              {name} Error
            </h3>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            This component encountered an error and couldn't render properly.
          </p>

          {error && (
            <details className="mb-3">
              <summary className="text-xs text-muted-foreground cursor-pointer">
                Error details
              </summary>
              <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto">
                {error.toString()}
              </pre>
            </details>
          )}

          <div className="flex gap-2">
            <button
              onClick={this.handleRetry}
              className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Retry
            </button>
            
            {retryCount > 0 && (
              <span className="text-xs text-muted-foreground self-center">
                Retry attempt: {retryCount}
              </span>
            )}
          </div>
        </div>
      );
    }

    // Wrap in Suspense for lazy loading support
    return (
      <Suspense 
        fallback={
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Loading {name}...</span>
          </div>
        }
      >
        {children}
      </Suspense>
    );
  }
}

// Hook version for functional components
export const useSafeComponent = (name?: string) => {
  const [error, setError] = React.useState<Error | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const handleError = React.useCallback((error: Error) => {
    console.error(`SafeComponent[${name}]: Error caught:`, error);
    setError(error);
  }, [name]);

  const retry = React.useCallback(() => {
    setError(null);
    setRetryCount(prev => prev + 1);
  }, []);

  const reset = React.useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  return {
    error,
    retryCount,
    handleError,
    retry,
    reset,
    hasError: !!error
  };
};