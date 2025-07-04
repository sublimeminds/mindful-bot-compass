import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  pageName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
  retryCount: number;
}

// Bulletproof page wrapper with comprehensive error recovery
class BulletproofPageWrapper extends Component<Props, State> {
  private maxRetries = 3;
  
  public state: State = {
    hasError: false,
    retryCount: 0
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    console.error('BulletproofPageWrapper: Page error caught', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    console.error('BulletproofPageWrapper: Full error details', {
      error,
      errorInfo,
      pageName: this.props.pageName,
      retryCount: this.state.retryCount
    });
    
    this.setState({
      errorInfo: errorInfo?.componentStack || 'No component stack available'
    });
  }

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      console.log(`BulletproofPageWrapper: Retry attempt ${this.state.retryCount + 1}`);
      this.setState(prevState => ({ 
        hasError: false, 
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1 
      }));
    } else {
      console.warn('BulletproofPageWrapper: Max retries reached, suggesting page reload');
    }
  };

  private handleReload = () => {
    console.log('BulletproofPageWrapper: Reloading page');
    window.location.reload();
  };

  private handleGoHome = () => {
    console.log('BulletproofPageWrapper: Navigating to home');
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      const canRetry = this.state.retryCount < this.maxRetries;
      
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-therapy-50 to-calm-50">
          <Card className="max-w-lg w-full shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertTriangle className="h-6 w-6 mr-3" />
                Page Error {this.props.pageName ? `- ${this.props.pageName}` : ''}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-muted-foreground mb-4">
                  Something went wrong while loading this page. Don't worry - your data is safe.
                </p>
                
                {this.state.retryCount > 0 && (
                  <p className="text-sm text-amber-600 mb-4">
                    Retry attempt: {this.state.retryCount}/{this.maxRetries}
                  </p>
                )}
              </div>

              {this.state.error && (
                <details className="text-sm bg-gray-50 p-3 rounded">
                  <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                    Technical Details
                  </summary>
                  <div className="mt-3 space-y-2">
                    <div>
                      <strong>Error:</strong>
                      <pre className="mt-1 text-xs text-red-600 overflow-auto">
                        {this.state.error.toString()}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 text-xs text-gray-600 overflow-auto max-h-32">
                          {this.state.errorInfo}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                {canRetry && (
                  <Button 
                    onClick={this.handleRetry} 
                    className="flex items-center justify-center"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
                
                <Button 
                  variant="secondary" 
                  onClick={this.handleReload}
                  className="flex items-center justify-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  If this problem persists, please contact support.
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

export default BulletproofPageWrapper;