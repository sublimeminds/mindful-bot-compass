import React, { Component, ReactNode, Suspense, useState, useCallback } from 'react';

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
}

export class SafeComponentWrapper extends Component<SafeComponentWrapperProps, SafeComponentWrapperState> {
  constructor(props: SafeComponentWrapperProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<SafeComponentWrapperState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const componentName = this.props.name || 'UnknownComponent';
    console.error(`SafeComponentWrapper[${componentName}]:`, error, errorInfo);
    
    // Log actual component stack for debugging
    console.error(`Actual Component Stack: ${errorInfo.componentStack}`);
    
    // Log specific React-related errors for debugging
    if (error.message.includes('Cannot read properties of null')) {
      console.error(`React initialization error in ${componentName}:`, {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        location: window.location.pathname
      });
    }

    // Track hook-related errors
    if (error.message.includes('useRef') || error.message.includes('useState') || error.message.includes('useEffect')) {
      console.error(`React Hook error in ${componentName}:`, {
        hookError: error.message,
        component: componentName,
        suggestions: ['Check React context initialization', 'Verify component mounting order', 'Add safe hook patterns']
      });
    }

    // Track sidebar-related errors on public pages
    if (error.message.includes('useSidebar must be used within a SidebarProvider')) {
      console.error(`Sidebar context error in ${componentName}:`, {
        error: 'Component trying to use sidebar on public page',
        component: componentName,
        location: window.location.pathname,
        suggestion: 'Remove sidebar dependencies from public pages'
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      retryCount: this.state.retryCount + 1
    });
  };

  render() {
    const { children, fallback, name = 'Component' } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      if (fallback) {
        return <>{fallback}</>;
      }

      return (
        <div className="border border-destructive/20 rounded-lg p-4 m-2 bg-destructive/5">
          <div className="flex items-center mb-2">
            <div className="h-4 w-4 rounded-full bg-destructive mr-2"></div>
            <h3 className="font-medium text-destructive">
              {name} Error
              {error?.message?.includes('useSidebar') && ' (Sidebar Context)'}
              {error?.message?.includes('useState') && ' (React Init)'}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {error?.message?.includes('useRef') || error?.message?.includes('Cannot read properties of null') 
              ? 'React initialization failed. This may be due to context loading issues.'
              : 'Component encountered an error and couldn\'t render.'
            }
          </p>
          {error && (
            <p className="text-xs text-muted-foreground mb-3 font-mono">
              {error.message.substring(0, 100)}...
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={this.handleRetry}
              className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Retry Component
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

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

export const useSafeComponent = (name?: string) => {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error) => {
    console.error(`SafeComponent[${name}]:`, error);
    setError(error);
  }, [name]);

  const retry = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, retry };
};