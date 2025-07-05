import React, { Component, ReactNode } from 'react';
import { SafeComponentWrapper } from './SafeComponentWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface PageErrorBoundaryProps {
  children: ReactNode;
  pageName?: string;
  fallbackContent?: ReactNode;
  showReload?: boolean;
  showNavigation?: boolean;
}

interface PageErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class PageErrorBoundary extends Component<PageErrorBoundaryProps, PageErrorBoundaryState> {
  constructor(props: PageErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<PageErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`PageErrorBoundary[${this.props.pageName}]:`, error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    const { children, pageName = 'Page', fallbackContent, showReload = true, showNavigation = true } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      if (fallbackContent) {
        return (
          <SafeComponentWrapper name="FallbackContent">
            {fallbackContent}
          </SafeComponentWrapper>
        );
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl text-destructive">
                {pageName} Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                This page encountered an error and couldn't load properly.
              </p>
              
              {error && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground font-mono">
                    {error.message}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Button 
                  onClick={this.handleRetry}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                {showReload && (
                  <Button 
                    variant="outline"
                    onClick={this.handleReload}
                    className="w-full"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reload Page
                  </Button>
                )}
                
                {showNavigation && (
                  <Button 
                    variant="outline"
                    onClick={this.handleGoHome}
                    className="w-full"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <SafeComponentWrapper name={`${pageName}Content`}>
        {children}
      </SafeComponentWrapper>
    );
  }
}

export default PageErrorBoundary;