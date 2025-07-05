import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  level: 'app' | 'page' | 'component' | 'hook';
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class BaseErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`${this.props.level}ErrorBoundary:`, error, errorInfo);
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { level } = this.props;
      
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-md">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-lg font-semibold">
              {level === 'app' ? 'Application Error' : 
               level === 'page' ? 'Page Error' : 
               'Component Error'}
            </h2>
            <p className="text-muted-foreground text-sm">
              Something went wrong at the {level} level.
            </p>
            <Button onClick={this.handleReset} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const MultiLevelErrorBoundary = BaseErrorBoundary;
export const AppErrorBoundary = (props: Omit<ErrorBoundaryProps, 'level'>) => 
  <BaseErrorBoundary {...props} level="app" />;
export const PageErrorBoundary = (props: Omit<ErrorBoundaryProps, 'level'>) => 
  <BaseErrorBoundary {...props} level="page" />;
export const ComponentErrorBoundary = (props: Omit<ErrorBoundaryProps, 'level'>) => 
  <BaseErrorBoundary {...props} level="component" />;
export const HookErrorBoundary = (props: Omit<ErrorBoundaryProps, 'level'>) => 
  <BaseErrorBoundary {...props} level="hook" />;