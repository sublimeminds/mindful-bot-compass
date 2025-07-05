import React, { Component, ReactNode } from 'react';
import GradientLogo from '@/components/ui/GradientLogo';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
  showErrorDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

// Safe error boundary that gracefully handles hook and component failures
export class SafeErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 2;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.warn(`SafeErrorBoundary (${this.props.name}): Caught error`, error, errorInfo);
    this.setState({ errorInfo });

    // Try to recover automatically for hook-related errors
    if (error.message.includes('hook') || error.message.includes('dispatcher')) {
      this.attemptRecovery();
    }
  }

  attemptRecovery = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`SafeErrorBoundary: Attempting recovery ${this.retryCount}/${this.maxRetries}`);
      
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
      }, 1000 * this.retryCount);
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center p-8">
          <div className="text-center bg-white rounded-lg shadow-xl p-6 max-w-md">
            <GradientLogo size="lg" className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-therapy-600 mb-2">
              Loading Enhanced Features
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {this.retryCount > 0 
                ? 'Optimizing your experience...' 
                : 'Some advanced features are loading in the background.'
              }
            </p>
            
            {this.retryCount < this.maxRetries && (
              <button
                onClick={this.attemptRecovery}
                className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-lg transition-all duration-200"
              >
                Try Again
              </button>
            )}

            {this.props.showErrorDetails && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-gray-500 cursor-pointer">Technical Details</summary>
                <pre className="text-xs text-gray-400 mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SafeErrorBoundary;