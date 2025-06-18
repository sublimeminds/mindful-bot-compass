
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { DebugLogger } from '@/utils/debugLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'page' | 'component' | 'critical';
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  lastRetryTime: number;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  private retryDelay = 1000; // Base delay in ms

  public state: State = {
    hasError: false,
    retryCount: 0,
    lastRetryTime: 0
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { level = 'component', onError } = this.props;
    
    DebugLogger.error(`Enhanced ErrorBoundary (${level}): Error caught`, error, {
      component: 'EnhancedErrorBoundary',
      level,
      errorInfo,
      retryCount: this.state.retryCount
    });

    this.setState({ errorInfo });
    
    // Report error to monitoring service
    this.reportError(error, errorInfo, level);
    
    // Call custom error handler
    onError?.(error, errorInfo);

    // Auto-retry for component-level errors
    if (level === 'component' && this.state.retryCount < this.maxRetries) {
      this.scheduleRetry();
    }
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo, level: string) => {
    try {
      // In a real app, this would send to your error reporting service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        level,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        retryCount: this.state.retryCount
      };
      
      console.error('Error Report:', errorReport);
      
      // Store in localStorage for later analysis
      const existingReports = JSON.parse(localStorage.getItem('error_reports') || '[]');
      existingReports.push(errorReport);
      localStorage.setItem('error_reports', JSON.stringify(existingReports.slice(-10))); // Keep last 10
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private scheduleRetry = () => {
    const delay = this.retryDelay * Math.pow(2, this.state.retryCount); // Exponential backoff
    const jitter = Math.random() * 1000; // Add jitter to prevent thundering herd
    
    setTimeout(() => {
      this.handleRetry();
    }, delay + jitter);
  };

  private handleRetry = () => {
    const now = Date.now();
    
    // Prevent rapid retries
    if (now - this.state.lastRetryTime < this.retryDelay) {
      return;
    }

    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1,
      lastRetryTime: now
    }));

    DebugLogger.info('EnhancedErrorBoundary: Attempting retry', {
      component: 'EnhancedErrorBoundary',
      retryCount: this.state.retryCount + 1
    });
  };

  private handleManualRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: 0,
      lastRetryTime: Date.now()
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private getFallbackUI = () => {
    const { level = 'component' } = this.props;
    const { error, retryCount } = this.state;

    if (level === 'critical') {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-6 w-6" />
                <span>Critical Error</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <Bug className="h-4 w-4" />
                <AlertDescription>
                  A critical error occurred that prevented the application from loading properly.
                </AlertDescription>
              </Alert>
              
              <div className="text-sm text-muted-foreground">
                <strong>Error:</strong> {error?.message}
              </div>

              <div className="flex space-x-2">
                <Button onClick={this.handleManualRetry} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
                <Button onClick={this.handleGoHome} variant="outline" className="flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (level === 'page') {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-8">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" />
                <span>Page Error</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                This page encountered an error and couldn't load properly.
                {retryCount > 0 && ` (Retry ${retryCount}/${this.maxRetries})`}
              </p>
              
              {retryCount >= this.maxRetries && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertDescription>
                    Multiple retry attempts failed. Please try refreshing the page or contact support.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-2">
                <Button onClick={this.handleManualRetry} disabled={retryCount >= this.maxRetries}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={this.handleGoHome} variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Component level error
    return (
      <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
        <div className="flex items-center space-x-2 text-yellow-800 mb-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium">Component Error</span>
        </div>
        <p className="text-sm text-yellow-700 mb-3">
          This component failed to load. 
          {retryCount > 0 && ` (Attempt ${retryCount}/${this.maxRetries})`}
        </p>
        {retryCount < this.maxRetries && (
          <Button size="sm" onClick={this.handleManualRetry} variant="outline">
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    );
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || this.getFallbackUI();
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
