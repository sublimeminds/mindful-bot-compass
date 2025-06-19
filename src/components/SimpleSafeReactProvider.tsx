
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  isReactSafe: boolean;
  error?: Error;
  retryCount: number;
}

export class SimpleSafeReactProvider extends Component<Props, State> {
  private maxRetries = 3;
  
  public state: State = {
    isReactSafe: false,
    retryCount: 0
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

      // Quick test to ensure hooks actually work by creating a test component
      const TestComponent = () => {
        const [test] = React.useState('test');
        React.useEffect(() => {}, []);
        return null;
      };

      // Test that we can actually render a component with hooks
      const testDiv = document.createElement('div');
      const testRoot = (window as any).ReactDOM?.createRoot?.(testDiv);
      if (testRoot) {
        testRoot.render(React.createElement(TestComponent));
      }

      // If we get here without errors, React is working
      console.log('SimpleSafeReactProvider: React validation successful');
      this.setState({ isReactSafe: true });

    } catch (error) {
      console.error('SimpleSafeReactProvider: React validation failed', error);
      
      if (this.state.retryCount < this.maxRetries) {
        console.log(`SimpleSafeReactProvider: Retrying validation (${this.state.retryCount + 1}/${this.maxRetries})`);
        setTimeout(() => {
          this.setState(prevState => ({ 
            retryCount: prevState.retryCount + 1 
          }));
          this.validateReact();
        }, 500 * (this.state.retryCount + 1));
      } else {
        this.setState({ 
          isReactSafe: false, 
          error: error as Error 
        });
      }
    }
  };

  private handleRetry = () => {
    this.setState({ error: undefined, isReactSafe: false, retryCount: 0 });
    setTimeout(this.validateReact, 100);
  };

  public render() {
    const { children } = this.props;
    const { isReactSafe, error, retryCount } = this.state;

    // Only render children if React is validated as safe
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
        // Show spinner if still retrying
        !error && React.createElement('div', {
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
        }, error ? 'React Initialization Error' : retryCount > 0 ? `Initializing React... (${retryCount}/${this.maxRetries})` : 'Initializing React...'),
        React.createElement('p', {
          key: 'message',
          style: { color: '#6b7280', marginBottom: '16px' }
        }, error ? `${error.message}` : 'Preparing React environment...'),
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

    // Only render children after React is validated
    return children;
  }
}

export default SimpleSafeReactProvider;
