
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { DebugLogger } from '@/utils/debugLogger';
import ReactHookErrorBoundary from './enhanced/ReactHookErrorBoundary';

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

  public render() {
    if (this.state.hasError) {
      // Use the enhanced React Hook Error Boundary for better diagnostics
      return (
        <ReactHookErrorBoundary componentName="ErrorBoundary" fallback={this.props.fallback}>
          {this.props.children}
        </ReactHookErrorBoundary>
      );
    }

    return (
      <ReactHookErrorBoundary componentName="ErrorBoundary">
        {this.props.children}
      </ReactHookErrorBoundary>
    );
  }
}

export default ErrorBoundary;
