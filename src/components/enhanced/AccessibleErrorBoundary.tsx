
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

class AccessibleErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AccessibleErrorBoundary caught an error:', error, errorInfo);
    
    // Log to external service
    this.logErrorToService(error, errorInfo);
    
    // Call onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Announce error to screen readers
    this.announceError();
  }

  logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, send to error tracking service
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId,
    };

    console.error('Error logged:', errorData);
  };

  announceError = () => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'alert');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.className = 'sr-only';
    announcement.textContent = 'An error has occurred. Please review the error information and try again.';
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 3000);
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: '',
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportError = () => {
    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      timestamp: new Date().toISOString(),
    };

    const subject = encodeURIComponent(`Error Report - ${this.state.errorId}`);
    const body = encodeURIComponent(`Error Details:\n${JSON.stringify(errorDetails, null, 2)}`);
    
    window.open(`mailto:support@therapysync.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4"
          role="alert"
          aria-labelledby="error-title"
          aria-describedby="error-description"
        >
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
              </div>
              <CardTitle id="error-title" className="text-2xl text-red-800">
                Something went wrong
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div id="error-description">
                <p className="text-gray-600 text-center mb-4">
                  We apologize for the inconvenience. An unexpected error has occurred while processing your request.
                </p>
                
                <details className="bg-gray-50 p-4 rounded-lg">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    Technical Details
                  </summary>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Error ID:</strong> {this.state.errorId}</p>
                    <p><strong>Message:</strong> {this.state.error?.message}</p>
                    <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
                  </div>
                </details>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button 
                  onClick={this.handleRetry}
                  className="w-full"
                  aria-describedby="retry-description"
                >
                  <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                  Try Again
                </Button>
                <span id="retry-description" className="sr-only">
                  Retry the current operation
                </span>

                <Button 
                  variant="outline" 
                  onClick={this.handleGoHome}
                  className="w-full"
                  aria-describedby="home-description"
                >
                  <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                  Go Home
                </Button>
                <span id="home-description" className="sr-only">
                  Return to the home page
                </span>

                <Button 
                  variant="outline" 
                  onClick={this.handleReportError}
                  className="w-full"
                  aria-describedby="report-description"
                >
                  <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                  Report Issue
                </Button>
                <span id="report-description" className="sr-only">
                  Send an error report to our support team
                </span>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Need immediate help?</h3>
                <p className="text-blue-700 text-sm">
                  If this error persists, please contact our support team at{' '}
                  <a 
                    href="mailto:support@therapysync.com" 
                    className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                  >
                    support@therapysync.com
                  </a>{' '}
                  with the error ID: <code className="bg-blue-200 px-1 rounded">{this.state.errorId}</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AccessibleErrorBoundary;
