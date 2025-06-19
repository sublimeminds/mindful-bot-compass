
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  isReactHookError: boolean;
}

// Specialized error boundary for React hook errors
export class ReactSafeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    isReactHookError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Detect React hook specific errors
    const isReactHookError = 
      error.message.includes('Cannot read properties of null') ||
      error.message.includes('useState') ||
      error.message.includes('useEffect') ||
      error.message.includes('useContext') ||
      error.message.includes('Invalid hook call') ||
      error.stack?.includes('useState') ||
      error.stack?.includes('useEffect') ||
      error.stack?.includes('useContext');

    console.error('ReactSafeErrorBoundary: Caught error', {
      message: error.message,
      isReactHookError,
      stack: error.stack
    });
    
    return { 
      hasError: true, 
      error,
      isReactHookError
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ReactSafeErrorBoundary: Component stack', {
      error: error.message,
      componentStack: errorInfo.componentStack,
      errorBoundary: 'ReactSafeErrorBoundary'
    });
  }

  private handleRecovery = () => {
    console.log('ReactSafeErrorBoundary: Attempting recovery');
    this.setState({
      hasError: false,
      error: undefined,
      isReactHookError: false
    });
  };

  private handleReload = () => {
    console.log('ReactSafeErrorBoundary: Reloading page');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorTitle = this.state.isReactHookError 
        ? 'React Hook Error' 
        : 'Application Error';
        
      const errorMessage = this.state.isReactHookError
        ? 'A React hook error occurred. This usually means React was not properly initialized.'
        : 'An unexpected error occurred in the application.';

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
        }, `⚠️ ${errorTitle}`),
        React.createElement('p', {
          key: 'message',
          style: { color: '#666', marginBottom: '20px', lineHeight: '1.5' }
        }, errorMessage),
        this.state.isReactHookError && React.createElement('div', {
          key: 'hook-advice',
          style: { 
            backgroundColor: '#fef3c7', 
            padding: '15px', 
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'left'
          }
        }, [
          React.createElement('h4', {
            key: 'advice-title',
            style: { margin: '0 0 10px 0', color: '#92400e' }
          }, 'Troubleshooting Steps:'),
          React.createElement('ul', {
            key: 'advice-list',
            style: { margin: 0, paddingLeft: '20px', color: '#92400e' }
          }, [
            React.createElement('li', { key: 'step1' }, 'Refresh the page'),
            React.createElement('li', { key: 'step2' }, 'Clear browser cache'),
            React.createElement('li', { key: 'step3' }, 'Check your internet connection')
          ])
        ]),
        React.createElement('div', {
          key: 'buttons',
          style: { display: 'flex', gap: '10px', justifyContent: 'center' }
        }, [
          React.createElement('button', {
            key: 'recover',
            onClick: this.handleRecovery,
            style: {
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }
          }, 'Try Again'),
          React.createElement('button', {
            key: 'reload',
            onClick: this.handleReload,
            style: {
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }
          }, 'Reload Page')
        ])
      ]));
    }

    return this.props.children;
  }
}

export default ReactSafeErrorBoundary;
