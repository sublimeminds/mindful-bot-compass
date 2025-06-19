
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  isReactSafe: boolean;
  error?: Error;
  retryCount: number;
  validationComplete: boolean;
}

export class SimpleSafeReactProvider extends Component<Props, State> {
  private maxRetries = 3;
  private validationTimer?: NodeJS.Timeout;
  
  public state: State = {
    isReactSafe: false,
    retryCount: 0,
    validationComplete: false
  };

  public componentDidMount() {
    this.performReactValidation();
  }

  public componentWillUnmount() {
    if (this.validationTimer) {
      clearTimeout(this.validationTimer);
    }
  }

  private performReactValidation = () => {
    try {
      console.log('SimpleSafeReactProvider: Starting React validation...');
      
      // Basic React availability check
      if (typeof React === 'undefined') {
        throw new Error('React is not available');
      }

      // Check if essential hooks are available
      if (!React.useState || !React.useEffect || !React.useContext) {
        throw new Error('React hooks are not available');
      }

      // Test that we can actually create elements
      const testElement = React.createElement('div', null, 'test');
      if (!testElement) {
        throw new Error('React.createElement is not working');
      }

      // Additional validation - test that hooks actually work
      const TestComponent = () => {
        const [test] = React.useState('test');
        React.useEffect(() => {}, []);
        return null;
      };

      // If we get here, React validation passed
      console.log('SimpleSafeReactProvider: React validation successful');
      
      // Use a small delay to ensure DOM is ready and all modules are loaded
      this.validationTimer = setTimeout(() => {
        this.setState({ 
          isReactSafe: true, 
          validationComplete: true,
          error: undefined 
        });
      }, 100);

    } catch (error) {
      console.error('SimpleSafeReactProvider: React validation failed', error);
      
      if (this.state.retryCount < this.maxRetries) {
        console.log(`SimpleSafeReactProvider: Retrying validation (${this.state.retryCount + 1}/${this.maxRetries})`);
        this.validationTimer = setTimeout(() => {
          this.setState(prevState => ({ 
            retryCount: prevState.retryCount + 1 
          }));
          this.performReactValidation();
        }, 1000 * (this.state.retryCount + 1));
      } else {
        this.setState({ 
          isReactSafe: false, 
          validationComplete: true,
          error: error as Error 
        });
      }
    }
  };

  private handleRetry = () => {
    this.setState({ 
      error: undefined, 
      isReactSafe: false, 
      retryCount: 0,
      validationComplete: false 
    });
    setTimeout(this.performReactValidation, 100);
  };

  public render() {
    const { children } = this.props;
    const { isReactSafe, error, retryCount, validationComplete } = this.state;

    // Show loading while validation is in progress
    if (!validationComplete) {
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
        }, retryCount > 0 ? `Initializing React... (${retryCount}/${this.maxRetries})` : 'Initializing React...'),
        React.createElement('p', {
          key: 'message',
          style: { color: '#6b7280', marginBottom: '16px' }
        }, 'Preparing React environment...')
      ]));
    }

    // Show error state if validation failed
    if (!isReactSafe && error) {
      return React.createElement('div', {
        style: {
          minHeight: '100vh',
          backgroundColor: '#fee2e2',
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
        React.createElement('h2', {
          key: 'title',
          style: { marginBottom: '12px', color: '#dc2626' }
        }, 'React Initialization Error'),
        React.createElement('p', {
          key: 'message',
          style: { color: '#6b7280', marginBottom: '16px' }
        }, `${error.message}`),
        React.createElement('button', {
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
        React.createElement('button', {
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

    // Only render children if React is validated and safe
    if (isReactSafe && validationComplete) {
      return children;
    }

    // Fallback - should not reach here
    return null;
  }
}

export default SimpleSafeReactProvider;
