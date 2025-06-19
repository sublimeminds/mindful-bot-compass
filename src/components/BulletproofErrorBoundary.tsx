
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

export class BulletproofErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  public state: State = {
    hasError: false,
    retryCount: 0
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('BulletproofErrorBoundary: Critical application error', error, errorInfo);
    
    this.setState({ errorInfo });
    
    // Store error for debugging
    try {
      localStorage.setItem('last_app_error', JSON.stringify({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {
      console.warn('Could not store error to localStorage');
    }
  }

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Application Error</h1>
              <p className="text-muted-foreground">
                Something went wrong. We've logged the error and will investigate.
              </p>
            </div>

            {this.state.retryCount > 0 && (
              <p className="text-sm text-muted-foreground">
                Retry attempt {this.state.retryCount} of {this.maxRetries}
              </p>
            )}

            {import.meta.env.DEV && this.state.error && (
              <div className="text-left bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                <strong>Error:</strong> {this.state.error.message}
                <br />
                <strong>Stack:</strong>
                <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {this.state.retryCount < this.maxRetries && (
                <Button onClick={this.handleRetry} className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              )}
              
              <Button onClick={this.handleReload} variant="outline" className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Page
              </Button>
              
              <Button onClick={this.handleGoHome} variant="outline" className="flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Try refreshing the page</p>
              <p>• Check your internet connection</p>
              <p>• Clear browser cache if the problem persists</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default BulletproofErrorBoundary;
