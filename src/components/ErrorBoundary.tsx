
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { DebugLogger } from '@/utils/debugLogger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    DebugLogger.error('ErrorBoundary: Error caught by boundary', error, {
      component: 'ErrorBoundary',
      method: 'getDerivedStateFromError'
    });
    
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    DebugLogger.error('ErrorBoundary: Component stack trace', error, {
      component: 'ErrorBoundary',
      method: 'componentDidCatch',
      errorInfo,
      componentStack: errorInfo.componentStack
    });

    this.setState({
      error,
      errorInfo
    });
  }

  private handleReload = () => {
    DebugLogger.info('ErrorBoundary: User triggered page reload', {
      component: 'ErrorBoundary',
      method: 'handleReload'
    });
    
    window.location.reload();
  };

  private handleReset = () => {
    DebugLogger.info('ErrorBoundary: User triggered error reset', {
      component: 'ErrorBoundary',
      method: 'handleReset'
    });
    
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertTriangle className="h-6 w-6 mr-2" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We're sorry, but something unexpected happened. Our team has been notified.
              </p>
              
              {import.meta.env.DEV && this.state.error && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Error Details (Development Mode)</h4>
                  <pre className="text-xs text-red-700 overflow-auto">
                    {this.state.error.message}
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <div className="mt-2">
                      <h4 className="font-medium text-red-800 mb-2">Component Stack</h4>
                      <pre className="text-xs text-red-700 overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex space-x-3">
                <Button onClick={this.handleReset} variant="outline">
                  Try Again
                </Button>
                <Button onClick={this.handleReload} className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
