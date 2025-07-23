
import React, { ReactNode, useCallback, Component, ErrorInfo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SafeComponentWrapper } from './SafeComponentWrapper';

interface SafeRouterProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface SafeRouterState {
  isReactReady: boolean;
  hasError: boolean;
  error?: Error;
}

class SafeRouterClass extends Component<SafeRouterProps, SafeRouterState> {
  private mounted = true;

  constructor(props: SafeRouterProps) {
    super(props);
    this.state = {
      isReactReady: false,
      hasError: false
    };
  }

  componentDidMount() {
    this.checkReactReadiness();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  static getDerivedStateFromError(error: Error): Partial<SafeRouterState> {
    console.error('SafeRouter error:', error);
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SafeRouter componentDidCatch:', error, errorInfo);
  }

  private checkReactReadiness = () => {
    try {
      // Comprehensive React validation
      if (
        typeof React !== 'undefined' &&
        React !== null &&
        typeof React.useContext === 'function' &&
        typeof React.useState === 'function' &&
        typeof React.useEffect === 'function' &&
        typeof React.createElement === 'function'
      ) {
        // Test React.useContext specifically since that's what's failing
        const testContext = React.createContext(null);
        if (testContext && typeof testContext.Provider === 'function') {
          if (this.mounted) {
            console.log('SafeRouter: React is ready for routing');
            this.setState({ isReactReady: true });
          }
          return;
        }
      }

      // If React isn't ready, retry after a delay
      if (this.mounted) {
        setTimeout(this.checkReactReadiness, 100);
      }
    } catch (error) {
      console.error('SafeRouter: React readiness check failed:', error);
      if (this.mounted) {
        this.setState({ hasError: true, error: error as Error });
      }
    }
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, isReactReady: false });
    this.checkReactReadiness();
  };

  render() {
    const { children, fallback } = this.props;
    const { isReactReady, hasError, error } = this.state;

    if (hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card border rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-4 text-destructive">SafeRouter Error</h2>
            <p className="text-muted-foreground mb-4">
              React initialization failed. This may be due to context loading issues.
            </p>
            <p className="text-sm text-muted-foreground mb-6 font-mono">
              {error?.message || 'Unknown router error'}
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Retry Component
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (!isReactReady) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Initializing Router...</p>
          </div>
        </div>
      );
    }

    return (
      <SafeComponentWrapper name="SafeRouter" fallback={fallback}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </SafeComponentWrapper>
    );
  }
}

export const SafeRouter: React.FC<SafeRouterProps> = (props) => {
  return <SafeRouterClass {...props} />;
};

export const useSafeNavigation = () => {
  const navigate = useNavigate();

  const safeNavigate = useCallback((to: string, options?: { replace?: boolean }) => {
    try {
      navigate(to, options);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location
      if (options?.replace) {
        window.location.replace(to);
      } else {
        window.location.href = to;
      }
    }
  }, [navigate]);

  return { navigate: safeNavigate };
};
