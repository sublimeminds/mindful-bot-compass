
import React, { Component, ReactNode } from 'react';
import { advancedReactValidator } from '@/utils/advancedReactValidator';

interface Props {
  children: ReactNode;
}

interface State {
  isReactReady: boolean;
  validationReport: any;
  error?: Error;
}

// Class-based wrapper that only renders AuthProvider when React is truly ready
export class ClassBasedAuthProvider extends Component<Props, State> {
  private AuthProvider: any = null;
  private mounted = true;

  state: State = {
    isReactReady: false,
    validationReport: null
  };

  async componentDidMount() {
    try {
      console.log('ClassBasedAuthProvider: Starting React validation...');
      
      // Wait for React to be fully ready
      const report = await advancedReactValidator.waitForReactReady();
      
      if (!this.mounted) return;

      if (report.isReady) {
        // Dynamically import AuthProvider only when React is ready
        const { AuthProvider } = await import('@/contexts/AuthContext');
        this.AuthProvider = AuthProvider;
        
        this.setState({
          isReactReady: true,
          validationReport: report
        });
        
        console.log('ClassBasedAuthProvider: React ready, AuthProvider loaded');
      } else {
        throw new Error('React failed to initialize properly');
      }
    } catch (error) {
      console.error('ClassBasedAuthProvider: Failed to initialize', error);
      if (this.mounted) {
        this.setState({ error: error as Error });
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

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
        React.createElement('h3', { key: 'title' }, 'Authentication System Error'),
        React.createElement('p', { key: 'message' }, 'Failed to initialize authentication system. Please refresh the page.'),
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
          padding: '20px',
          textAlign: 'center',
          color: '#6b7280'
        }
      }, 'Initializing authentication...');
    }

    // Only render AuthProvider when React is confirmed ready
    return React.createElement(this.AuthProvider, {}, children);
  }
}

export default ClassBasedAuthProvider;
