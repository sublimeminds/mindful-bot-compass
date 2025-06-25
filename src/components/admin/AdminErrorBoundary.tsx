
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('Admin Error Boundary: Error caught', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Admin Error Boundary: Component stack', {
      error: error.message,
      componentStack: errorInfo.componentStack
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <span>Admin Panel Error</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-700 bg-red-900/20">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-300">
                  The admin panel encountered an error. This could be due to a permission issue or a temporary system problem.
                </AlertDescription>
              </Alert>
              
              {this.state.error && (
                <div className="text-sm text-gray-300 bg-gray-700 p-3 rounded">
                  <strong>Error:</strong> {this.state.error.message}
                </div>
              )}

              <div className="flex space-x-2">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={this.handleGoHome} variant="outline" className="flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
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

export default AdminErrorBoundary;
