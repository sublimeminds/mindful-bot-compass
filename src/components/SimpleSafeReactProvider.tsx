
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  isReactReady: boolean;
  error?: Error;
}

// Simplified React safety provider that focuses on runtime hook safety
export class SimpleSafeReactProvider extends Component<Props, State> {
  private mounted = true;

  state: State = {
    isReactReady: false
  };

  componentDidMount() {
    // Simple, immediate React validation
    this.validateReactSimple();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  private validateReactSimple = () => {
    try {
      // Basic React availability check
      if (typeof React === 'undefined' || React === null) {
        throw new Error('React is not available');
      }

      // Check essential hooks
      if (!React.useState || !React.useEffect || !React.useContext) {
        throw new Error('React hooks are not available');
      }

      // Test createElement
      const testElement = React.createElement('div', null, 'test');
      if (!testElement) {
        throw new Error('React.createElement is not working');
      }

      console.log('SimpleSafeReactProvider: React validation successful');
      
      if (this.mounted) {
        this.setState({ isReactReady: true });
      }
      
    } catch (error) {
      console.error('SimpleSafeReactProvider: React validation failed', error);
      if (this.mounted) {
        this.setState({ 
          isReactReady: false, 
          error: error as Error 
        });
      }
    }
  };

  render() {
    const { children } = this.props;
    const { isReactReady, error } = this.state;

    if (error) {
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
        React.createElement('p', { key: 'message' }, error.message),
        React.createElement('button', {
          key: 'reload',
          onClick: () => window.location.reload(),
          style: {
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }
        }, 'Reload Page')
      ]);
    }

    if (!isReactReady) {
      return React.createElement('div', {
        style: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280'
        }
      }, 'Initializing React framework...');
    }

    return children;
  }
}

export default SimpleSafeReactProvider;
