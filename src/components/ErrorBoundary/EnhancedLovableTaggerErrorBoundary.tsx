import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { initializeLovableTagger, resetLovableTagger } from '@/utils/lovableTaggerFix';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showDebugInfo?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  isLovableTaggerError: boolean;
  autoFixAttempted: boolean;
  fixSuccessful: boolean;
}

class EnhancedLovableTaggerErrorBoundary extends Component<Props, State> {
  private maxRetries = 2; // Reduced for faster resolution
  private autoFixTimer?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
      isLovableTaggerError: false,
      autoFixAttempted: false,
      fixSuccessful: false
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    const isLovableTaggerError = 
      error.message.includes('lov') ||
      error.message.includes('lovable-tagger') ||
      error.message.includes('Cannot read properties of undefined') ||
      error.stack?.includes('lovable-tagger') ||
      error.stack?.includes('lov');

    return { 
      hasError: true, 
      error,
      isLovableTaggerError
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Enhanced ErrorBoundary caught error:', error, errorInfo);
    
    this.setState({ 
      error, 
      errorInfo,
      isLovableTaggerError: this.isLovableTaggerRelated(error)
    });

    // Immediate auto-fix for lovable-tagger errors
    if (this.isLovableTaggerRelated(error) && !this.state.autoFixAttempted) {
      this.setState({ autoFixAttempted: true });
      this.autoFixTimer = setTimeout(() => {
        this.handleAutomaticFix();
      }, 100); // Very quick auto-fix
    }
  }

  private isLovableTaggerRelated = (error: Error): boolean => {
    const errorMessage = error.message.toLowerCase();
    const stackTrace = error.stack?.toLowerCase() || '';
    
    const patterns = [
      'lov',
      'lovable-tagger',
      'cannot read properties of undefined',
      'componenttagger',
      'reading \'lov\'',
      'window.lov'
    ];

    return patterns.some(pattern => 
      errorMessage.includes(pattern) || stackTrace.includes(pattern)
    );
  };

  private handleAutomaticFix = async () => {
    console.log('🔧 Attempting automatic lovable-tagger fix...');
    
    try {
      // Multi-step fix approach
      resetLovableTagger();
      await new Promise(resolve => setTimeout(resolve, 50)); // Small delay
      
      const initResult = initializeLovableTagger();
      
      if (initResult) {
        console.log('✅ Automatic fix successful');
        this.setState({ 
          hasError: false, 
          error: undefined, 
          errorInfo: undefined,
          retryCount: this.state.retryCount + 1,
          fixSuccessful: true
        });
      } else {
        throw new Error('Initialization failed');
      }
    } catch (fixError) {
      console.error('❌ Automatic fix failed:', fixError);
      this.setState({ retryCount: this.state.retryCount + 1 });
    }
  };

  private handleManualRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.handleAutomaticFix();
    } else {
      // Reload page as last resort
      console.log('🔄 Reloading page to resolve persistent errors');
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  public componentWillUnmount() {
    if (this.autoFixTimer) {
      clearTimeout(this.autoFixTimer);
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/20 flex items-center justify-center p-4">
          <Card className="max-w-xl w-full">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                {this.state.fixSuccessful ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span className="text-green-700">Error Resolved</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                    <span className="text-amber-700">Loading Issue</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {this.state.isLovableTaggerError ? (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h3 className="font-medium text-blue-800 text-sm mb-1">
                      Page Initialization
                    </h3>
                    <p className="text-xs text-blue-700">
                      The page components are loading. This usually resolves automatically within seconds.
                    </p>
                  </div>

                  {this.state.autoFixAttempted && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <h4 className="font-medium text-green-800 text-sm mb-1">Auto-fix Applied</h4>
                      <p className="text-xs text-green-700">
                        System components have been reinitialized
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h3 className="font-medium text-red-800 text-sm mb-1">
                    Component Error
                  </h3>
                  <p className="text-xs text-red-700">
                    {this.state.error?.message || 'An unexpected error occurred'}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={this.handleManualRetry}
                  disabled={this.state.retryCount >= this.maxRetries}
                  size="sm"
                  className="flex-1"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {this.state.retryCount >= this.maxRetries ? 'Reload Page' : 'Retry'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  size="sm"
                  className="flex-1"
                >
                  <Home className="h-3 w-3 mr-1" />
                  Dashboard
                </Button>
              </div>

              {this.props.showDebugInfo && process.env.NODE_ENV === 'development' && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground">Debug Info</summary>
                  <pre className="bg-muted p-2 rounded mt-1 overflow-auto text-[10px]">
                    Retries: {this.state.retryCount}/{this.maxRetries}{'\n'}
                    Auto-fix: {this.state.autoFixAttempted ? 'Yes' : 'No'}{'\n'}
                    Type: {this.state.isLovableTaggerError ? 'Lovable-tagger' : 'General'}{'\n'}
                    {this.state.error?.stack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EnhancedLovableTaggerErrorBoundary;