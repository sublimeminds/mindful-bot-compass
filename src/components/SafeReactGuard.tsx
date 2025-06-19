
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  isReactSafe: boolean;
  hasError: boolean;
  retryCount: number;
}

// Ultra-safe React guard that ensures React is available before rendering children
export class SafeReactGuard extends Component<Props, State> {
  private maxRetries = 3;
  private retryTimer?: NodeJS.Timeout;
  
  public state: State = {
    isReactSafe: false,
    hasError: false,
    retryCount: 0
  };

  public componentDidMount() {
    this.validateReact();
  }

  public componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  private validateReact = () => {
    try {
      // Check if React is available and functional
      if (typeof React === 'undefined' || React === null) {
        throw new Error('React is not available');
      }

      // Test core React functionality
      if (!React.useState || !React.useEffect || !React.useContext || !React.createElement) {
        throw new Error('React hooks are not available');
      }

      // Try to create a test element
      const testElement = React.createElement('div', null, 'test');
      if (!testElement) {
        throw new Error('React.createElement is not working');
      }

      // If we get here, React is safe
      this.setState({ isReactSafe: true, hasError: false });
      console.log('SafeReactGuard: React validation successful');
      
    } catch (error) {
      console.error('SafeReactGuard: React validation failed', error);
      
      if (this.state.retryCount < this.maxRetries) {
        this.retryTimer = setTimeout(() => {
          this.setState(prevState => ({ 
            retryCount: prevState.retryCount + 1 
          }));
          this.validateReact();
        }, 1000 * (this.state.retryCount + 1));
      } else {
        this.setState({ hasError: true });
      }
    }
  };

  private handleRetry = () => {
    this.setState({ retryCount: 0, hasError: false });
    this.validateReact();
  };

  public render() {
    const { children, fallback } = this.props;
    const { isReactSafe, hasError } = this.state;

    if (hasError) {
      return React.createElement('div', {
        style: {
          padding: '20px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#991b1b',
          textAlign: 'center'
        }
      }, [
        React.createElement('h3', { key: 'title' }, 'React Initialization Error'),
        React.createElement('p', { key: 'message' }, 'Failed to initialize React properly'),
        React.createElement('button', {
          key: 'retry',
          onClick: this.handleRetry,
          style: {
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }
        }, 'Retry'),
        React.createElement('button', {
          key: 'reload',
          onClick: () => window.location.reload(),
          style: {
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px',
            marginLeft: '10px'
          }
        }, 'Reload Page')
      ]);
    }

    if (!isReactSafe) {
      if (fallback) {
        return fallback;
      }
      
      return React.createElement('div', {
        style: {
          padding: '20px',
          textAlign: 'center',
          color: '#6b7280'
        }
      }, 'Initializing React...');
    }

    return children;
  }
}

export default SafeReactGuard;
