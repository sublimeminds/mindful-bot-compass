
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { reactHookValidator } from '@/utils/reactHookValidator';
import { DebugLogger } from '@/utils/debugLogger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Bug, Download } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  diagnostics?: Record<string, any>;
}

export class ReactHookErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Check if this is a React hook related error
    const isHookError = error.message.includes('Cannot read properties of null') ||
                       error.message.includes('useContext') ||
                       error.message.includes('useState') ||
                       error.message.includes('useEffect');

    if (isHookError) {
      DebugLogger.error('ReactHookErrorBoundary: React hook error detected', error, {
        component: 'ReactHookErrorBoundary',
        method: 'getDerivedStateFromError',
        isHookError: true
      });
    }
    
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const diagnostics = reactHookValidator.getDiagnostics();
    const contextValidation = reactHookValidator.validateReactContext();

    DebugLogger.error('ReactHookErrorBoundary: Component error with diagnostics', error, {
      component: 'ReactHookErrorBoundary',
      method: 'componentDidCatch',
      errorInfo,
      diagnostics,
      contextValidation,
      componentStack: errorInfo.componentStack
    });

    this.setState({
      error,
      errorInfo,
      diagnostics: {
        ...diagnostics,
        contextValidation,
        timestamp: new Date().toISOString()
      }
    });
  }

  private handleReload = () => {
    DebugLogger.info('ReactHookErrorBoundary: User triggered page reload', {
      component: 'ReactHookErrorBoundary',
      method: 'handleReload'
    });
    
    reactHookValidator.resetTracking();
    window.location.reload();
  };

  private handleReset = () => {
    DebugLogger.info('ReactHookErrorBoundary: User triggered error reset', {
      component: 'ReactHookErrorBoundary',
      method: 'handleReset'
    });
    
    reactHookValidator.resetTracking();
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, diagnostics: undefined });
  };

  private downloadDiagnostics = () => {
    if (this.state.diagnostics) {
      const diagnosticsData = JSON.stringify(this.state.diagnostics, null, 2);
      const blob = new Blob([diagnosticsData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `react-hook-diagnostics-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  private isReactHookError(): boolean {
    if (!this.state.error) return false;
    
    const hookErrorPatterns = [
      'Cannot read properties of null',
      'useContext',
      'useState',
      'useEffect',
      'useCallback',
      'useMemo',
      'useRef'
    ];

    return hookErrorPatterns.some(pattern => 
      this.state.error!.message.includes(pattern) || 
      this.state.error!.stack?.includes(pattern)
    );
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isHookError = this.isReactHookError();

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                {isHookError ? <Bug className="h-6 w-6 mr-2" /> : <AlertTriangle className="h-6 w-6 mr-2" />}
                {isHookError ? 'React Hook Error Detected' : 'Application Error'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {isHookError 
                  ? 'A React hook error has been detected. This usually indicates an import or usage issue.'
                  : 'An unexpected error occurred in the application.'
                }
              </p>

              {isHookError && this.state.diagnostics?.contextValidation && !this.state.diagnostics.contextValidation.isValid && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">React Context Issue Detected</h4>
                  <p className="text-yellow-700 text-sm mb-2">{this.state.diagnostics.contextValidation.error}</p>
                  {this.state.diagnostics.contextValidation.suggestions && (
                    <ul className="text-yellow-600 text-xs list-disc list-inside">
                      {this.state.diagnostics.contextValidation.suggestions.map((suggestion: string, index: number) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              
              {import.meta.env.DEV && this.state.error && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Error Details (Development Mode)</h4>
                  <pre className="text-xs text-red-700 overflow-auto max-h-40">
                    {this.state.error.message}
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <div className="mt-2">
                      <h4 className="font-medium text-red-800 mb-2">Component Stack</h4>
                      <pre className="text-xs text-red-700 overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {import.meta.env.DEV && this.state.diagnostics && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">React Hook Diagnostics</h4>
                  <div className="text-blue-700 text-sm space-y-1">
                    <p>React Available: {this.state.diagnostics.reactAvailable ? '✅' : '❌'}</p>
                    <p>Hooks Available: {this.state.diagnostics.hooksAvailable ? '✅' : '❌'}</p>
                    <p>Component Renders: {Object.keys(this.state.diagnostics.componentRenderCount || {}).length}</p>
                    <p>Hook Calls: {Object.keys(this.state.diagnostics.hookCallStack || {}).length}</p>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3 flex-wrap">
                <Button onClick={this.handleReset} variant="outline">
                  Try Again
                </Button>
                <Button onClick={this.handleReload} className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
                {import.meta.env.DEV && this.state.diagnostics && (
                  <Button onClick={this.downloadDiagnostics} variant="outline" className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Download Diagnostics
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ReactHookErrorBoundary;
