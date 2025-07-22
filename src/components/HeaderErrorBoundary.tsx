
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class HeaderErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`🚨 HeaderErrorBoundary[${this.props.componentName}]: Caught error`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full bg-red-100 border-2 border-red-500 p-4">
          <h2 className="text-red-800 font-bold">Header Error in {this.props.componentName}</h2>
          <p className="text-red-600">{this.state.error?.message}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default HeaderErrorBoundary;
