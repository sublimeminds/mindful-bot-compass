
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { DebugLogger } from '@/utils/debugLogger';
import { reactInitValidator } from '@/utils/reactInitValidator';
import ReactErrorFallback from './fallback/ReactErrorFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  isReactHookError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    isReactHookError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Check if this is a React hook related error
    const isReactHookError = error.message.includes('Cannot read properties of null') ||
                            error.message.includes('useState') ||
                            error.message.includes('useEffect') ||
                            error.message.includes('useContext') ||
                            error.message.includes('Invalid hook call');

    DebugLogger.error('ErrorBoundary: Error caught by boundary', error, {
      component: 'ErrorBoundary',
      method: 'getDerivedStateFromError',
      isReactHookError
    });
    
    return { 
      hasError: true, 
      error,
      isReactHookError
    };
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

    // If this is a React hook error, reset the validator
    if (this.state.isReactHookError) {
      reactInitValidator.reset();
    }
  }

  private handleRecovery = () => {
    DebugLogger.info('ErrorBoundary: Attempting error recovery', {
      component: 'ErrorBoundary'
    });
    
    // Reset the validator
    reactInitValidator.reset();
    
    // Reset component state
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      isReactHookError: false
    });
  };

  public render() {
    if (this.state.hasError) {
      // For React hook errors, use the specialized fallback
      if (this.state.isReactHookError) {
        return (
          <ReactErrorFallback 
            error={this.state.error}
            onReload={this.handleRecovery}
          />
        );
      }

      // For other errors, use the provided fallback or default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ReactErrorFallback 
          error={this.state.error}
          onReload={this.handleRecovery}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
