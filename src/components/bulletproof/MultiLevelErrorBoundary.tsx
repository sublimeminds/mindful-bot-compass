import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

type ErrorLevel = 'app' | 'page' | 'component' | 'hook';

interface MultiLevelErrorBoundaryProps {
  children: ReactNode;
  level: ErrorLevel;
  name?: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showErrorDetails?: boolean;
  autoRetry?: boolean;
  maxRetries?: number;
}

interface MultiLevelErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
  isRetrying: boolean;
}

export class MultiLevelErrorBoundary extends Component<
  MultiLevelErrorBoundaryProps,
  MultiLevelErrorBoundaryState
> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: MultiLevelErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<MultiLevelErrorBoundaryState> {
    return {
      hasError: true,
      error,
      isRetrying: false
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { level, name, onError, autoRetry, maxRetries = 3 } = this.props;
    const boundaryName = `${level}${name ? `[${name}]` : ''}`;

    console.error(`MultiLevelErrorBoundary[${boundaryName}]:`, error, errorInfo);

    this.setState({ errorInfo });

    // Call custom error handler
    if (onError) {
      onError(error, errorInfo);
    }

    // Auto-retry for non-app level errors
    if (autoRetry && level !== 'app' && this.state.retryCount < maxRetries) {
      this.scheduleRetry();
    }

    // Report to error tracking service (if available)
    this.reportError(error, errorInfo, boundaryName);
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

    this.setState({ isRetrying: true });

    // Progressive delay: 1s, 2s, 4s
    const delay = Math.pow(2, this.state.retryCount) * 1000;
    
    this.retryTimeout = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
        isRetrying: false
      }));
    }, delay);
  };

  handleManualRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  reportError = (error: Error, errorInfo: React.ErrorInfo, boundaryName: string) => {
    // Log error details for debugging
    const errorReport = {
      boundary: boundaryName,
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.group('🚨 Error Report');
    console.error('Boundary:', boundaryName);
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();

    // In production, you would send this to an error tracking service
    // Example: Sentry, LogRocket, etc.
  };

  renderErrorUI() {
    const { level, name, fallback, showErrorDetails } = this.props;
    const { error, errorInfo, retryCount, isRetrying } = this.state;

    // Use custom fallback if provided
    if (fallback) {
      return fallback;
    }

    // Different UI styles based on error level
    const levelStyles = {
      app: {
        container: 'min-h-screen flex items-center justify-center bg-red-50',
        card: 'max-w-md w-full mx-4 p-8 bg-white border border-red-200 rounded-lg shadow-lg',
        title: 'text-xl font-bold text-red-700 mb-4',
        icon: 'h-8 w-8 text-red-500'
      },
      page: {
        container: 'min-h-96 flex items-center justify-center bg-red-50 rounded-lg m-4',
        card: 'max-w-sm w-full p-6 bg-white border border-red-200 rounded-lg',
        title: 'text-lg font-semibold text-red-700 mb-3',
        icon: 'h-6 w-6 text-red-500'
      },
      component: {
        container: 'flex items-center justify-center bg-red-50 rounded p-4 m-2',
        card: 'w-full p-4 bg-white border border-red-200 rounded',
        title: 'text-base font-medium text-red-700 mb-2',
        icon: 'h-5 w-5 text-red-500'
      },
      hook: {
        container: 'bg-red-50 rounded p-2 m-1',
        card: 'p-2 bg-white border border-red-200 rounded text-sm',
        title: 'text-sm font-medium text-red-700 mb-1',
        icon: 'h-4 w-4 text-red-500'
      }
    };

    const styles = levelStyles[level];
    const title = level === 'app' ? 'Application Error' : `${level} Error${name ? ` (${name})` : ''}`;

    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className="flex items-center mb-4">
            <AlertTriangle className={styles.icon + ' mr-2'} />
            <h2 className={styles.title}>{title}</h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            {level === 'app' 
              ? 'The application encountered a critical error and needs to be restarted.'
              : `This ${level} failed to load properly but the rest of the app should work fine.`
            }
          </p>

          {isRetrying && (
            <div className="flex items-center mb-4 text-blue-600">
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              Retrying...
            </div>
          )}

          {showErrorDetails && error && (
            <details className="mb-4">
              <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                Error Details
              </summary>
              <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto max-h-32">
                <div className="mb-2">
                  <strong>Error:</strong> {error.toString()}
                </div>
                {errorInfo?.componentStack && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre>{errorInfo.componentStack}</pre>
                  </div>
                )}
              </div>
            </details>
          )}

          <div className="flex gap-2">
            {level !== 'app' && (
              <button
                onClick={this.handleManualRetry}
                disabled={isRetrying}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </button>
            )}
            
            <button
              onClick={this.handleReload}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Reload Page
            </button>
          </div>

          {retryCount > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              Retry attempts: {retryCount}
            </p>
          )}
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderErrorUI();
    }

    return this.props.children;
  }
}

// Convenience components for different levels
export const AppErrorBoundary: React.FC<Omit<MultiLevelErrorBoundaryProps, 'level'>> = (props) => (
  <MultiLevelErrorBoundary {...props} level="app" />
);

export const PageErrorBoundary: React.FC<Omit<MultiLevelErrorBoundaryProps, 'level'>> = (props) => (
  <MultiLevelErrorBoundary {...props} level="page" />
);

export const ComponentErrorBoundary: React.FC<Omit<MultiLevelErrorBoundaryProps, 'level'>> = (props) => (
  <MultiLevelErrorBoundary {...props} level="component" />
);

export const HookErrorBoundary: React.FC<Omit<MultiLevelErrorBoundaryProps, 'level'>> = (props) => (
  <MultiLevelErrorBoundary {...props} level="hook" />
);