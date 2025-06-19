
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class SimpleErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('SimpleErrorBoundary: Error caught', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    console.error('SimpleErrorBoundary: Error details', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return React.createElement('div', {
        style: {
          minHeight: '100vh',
          backgroundColor: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }
      }, React.createElement('div', {
        style: {
          maxWidth: '500px',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }
      }, [
        React.createElement('h1', {
          key: 'title',
          style: { color: '#dc2626', marginBottom: '20px', fontSize: '24px' }
        }, '⚠️ Application Error'),
        React.createElement('p', {
          key: 'message',
          style: { color: '#666', marginBottom: '20px', lineHeight: '1.5' }
        }, 'A critical error occurred. This is usually due to a React initialization issue.'),
        React.createElement('button', {
          key: 'reload',
          onClick: this.handleReload,
          style: {
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }
        }, 'Reload Application')
      ]));
    }

    return this.props.children;
  }
}

export default SimpleErrorBoundary;
