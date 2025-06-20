
import React, { Component, ReactNode } from 'react';
import { SimpleAuthProvider } from '@/components/SimpleAuthProvider';
import MinimalErrorBoundary from '@/components/MinimalErrorBoundary';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class SafeAppWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('SafeAppWrapper: Error caught', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('SafeAppWrapper: Component error details', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{
            maxWidth: '400px',
            textAlign: 'center',
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ color: '#dc2626', marginBottom: '20px' }}>
              Application Error
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              Something went wrong with the landing page. Please try again.
            </p>
            <button
              onClick={this.handleRetry}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return (
      <MinimalErrorBoundary>
        <SimpleAuthProvider>
          {this.props.children}
        </SimpleAuthProvider>
      </MinimalErrorBoundary>
    );
  }
}

export default SafeAppWrapper;
