import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { initializeLovableTagger, resetLovableTagger } from '@/utils/lovableTaggerFix';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  isLovableTaggerError: boolean;
}

class LovableTaggerErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
      isLovableTaggerError: false
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    const isLovableTaggerError = 
      error.message.includes('lov') ||
      error.message.includes('lovable-tagger') ||
      error.message.includes('Cannot read properties of undefined');

    return { 
      hasError: true, 
      error,
      isLovableTaggerError
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LovableTaggerErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({ 
      error, 
      errorInfo,
      isLovableTaggerError: this.isLovableTaggerRelated(error)
    });

    // Auto-attempt fix for lovable-tagger errors
    if (this.isLovableTaggerRelated(error) && this.state.retryCount < this.maxRetries) {
      setTimeout(() => {
        this.handleLovableTaggerFix();
      }, 1000);
    }
  }

  private isLovableTaggerRelated = (error: Error): boolean => {
    const errorMessage = error.message.toLowerCase();
    const stackTrace = error.stack?.toLowerCase() || '';
    
    return (
      errorMessage.includes('lov') ||
      errorMessage.includes('lovable-tagger') ||
      errorMessage.includes('cannot read properties of undefined') ||
      stackTrace.includes('lovable-tagger') ||
      stackTrace.includes('lov')
    );
  };

  private handleLovableTaggerFix = () => {
    console.log('Attempting to fix lovable-tagger error...');
    
    try {
      // Reset and reinitialize lovable-tagger
      resetLovableTagger();
      const initResult = initializeLovableTagger();
      
      if (initResult) {
        console.log('Lovable-tagger fix applied successfully');
        this.setState({ 
          hasError: false, 
          error: undefined, 
          errorInfo: undefined,
          retryCount: this.state.retryCount + 1
        });
      } else {
        throw new Error('Failed to reinitialize lovable-tagger');
      }
    } catch (fixError) {
      console.error('Failed to apply lovable-tagger fix:', fixError);
      this.setState({ retryCount: this.state.retryCount + 1 });
    }
  };

  private handleManualRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.handleLovableTaggerFix();
    } else {
      // Force page reload as last resort
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/20 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-destructive">
                <AlertTriangle className="h-6 w-6 mr-2" />
                Page Loading Error
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {this.state.isLovableTaggerError ? (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="font-medium text-amber-800 mb-2">
                      Lovable Editor Integration Issue
                    </h3>
                    <p className="text-sm text-amber-700">
                      There's a temporary issue with the page loading system. 
                      We're automatically fixing this issue.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">What's happening:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• The editor integration is initializing</li>
                      <li>• Avatar system is loading in the background</li>
                      <li>• This usually resolves automatically</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-medium text-red-800 mb-2">
                    Unexpected Error
                  </h3>
                  <p className="text-sm text-red-700 mb-2">
                    {this.state.error?.message || 'An unknown error occurred'}
                  </p>
                  {process.env.NODE_ENV === 'development' && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer">Developer Details</summary>
                      <pre className="text-xs bg-red-100 p-2 rounded mt-1 overflow-auto">
                        {this.state.error?.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Retry attempts: {this.state.retryCount} / {this.maxRetries}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={this.handleManualRetry}
                    disabled={this.state.retryCount >= this.maxRetries}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {this.state.retryCount >= this.maxRetries ? 'Reload Page' : 'Try Again'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={this.handleGoHome}
                    className="flex-1"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go to Dashboard
                  </Button>
                </div>
              </div>

              {this.state.isLovableTaggerError && (
                <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                  <strong>For developers:</strong> This error is typically caused by the lovable-tagger 
                  package initialization. The error boundary is attempting to fix this automatically.
                  If the issue persists, try refreshing the page or clearing browser cache.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default LovableTaggerErrorBoundary;