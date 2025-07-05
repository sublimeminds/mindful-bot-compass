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
            <h3 className="font-medium text-destructive">{name} Error</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Component encountered an error and couldn't render.
          </p>
          <button
            onClick={this.handleRetry}
            className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
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
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    console.error(`SafeComponent[${name}]:`, error);
    setError(error);
  }, [name]);

  const retry = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, retry };
};