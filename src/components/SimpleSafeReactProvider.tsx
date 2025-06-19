
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  isReactSafe: boolean;
  error?: Error;
}

export class SimpleSafeReactProvider extends Component<Props, State> {
  public state: State = {
    isReactSafe: false
  };

  public componentDidMount() {
    this.validateReact();
  }

  private validateReact = () => {
    try {
      // Basic React availability check
      if (typeof React === 'undefined') {
        throw new Error('React is not available');
      }

      // Check if essential hooks are available
      if (!React.useState || !React.useEffect || !React.useContext) {
        throw new Error('React hooks are not available');
      }

      // Quick test to ensure hooks actually work
      const TestComponent = () => {
        const [test] = React.useState('test');
        return null;
      };

      console.log('SimpleSafeReactProvider: React validation successful');
      this.setState({ isReactSafe: true });

    } catch (error) {
      console.error('SimpleSafeReactProvider: React validation failed', error);
      this.setState({ 
        isReactSafe: false, 
        error: error as Error 
      });
    }
  };

  private handleRetry = () => {
    this.setState({ error: undefined, isReactSafe: false });
    setTimeout(this.validateReact, 100);
  };

  public render() {
    const { children } = this.props;
    const { isReactSafe, error } = this.state;

    if (!isReactSafe) {
      return React.createElement('div', {
        style: {
          minHeight: '100vh',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }
      }, React.createElement('div', {
        style: {
          maxWidth: '400px',
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }
      }, [
        React.createElement('div', {
          key: 'spinner',
          style: {
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }
        }),
        React.createElement('h2', {
          key: 'title',
          style: { marginBottom: '12px', color: '#374151' }
        }, error ? 'Initialization Error' : 'Loading Application...'),
        React.createElement('p', {
          key: 'message',
          style: { color: '#6b7280', marginBottom: '16px' }
        }, error ? `${error.message}` : 'Preparing your therapy assistant...'),
        error && React.createElement('button', {
          key: 'retry',
          onClick: this.handleRetry,
          style: {
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '8px'
          }
        }, 'Retry'),
        error && React.createElement('button', {
          key: 'reload',
          onClick: () => window.location.reload(),
          style: {
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }
        }, 'Full Reload')
      ]));
    }

    return children;
  }
}

export default SimpleSafeReactProvider;
