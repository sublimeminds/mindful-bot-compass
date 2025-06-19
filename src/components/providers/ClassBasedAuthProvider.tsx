
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  isProviderReady: boolean;
  error?: Error;
}

// Class-based wrapper that safely loads AuthProvider
export class ClassBasedAuthProvider extends Component<Props, State> {
  private AuthProvider: any = null;
  private mounted = true;

  state: State = {
    isProviderReady: false
  };

  async componentDidMount() {
    try {
      console.log('ClassBasedAuthProvider: Loading AuthProvider...');
      
      // Simple delay to ensure React is stable
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!this.mounted) return;

      // Dynamically import AuthProvider
      const { AuthProvider } = await import('@/contexts/AuthContext');
      this.AuthProvider = AuthProvider;
      
      this.setState({
        isProviderReady: true
      });
      
      console.log('ClassBasedAuthProvider: AuthProvider loaded successfully');
    } catch (error) {
      console.error('ClassBasedAuthProvider: Failed to load AuthProvider', error);
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
    const { isProviderReady, error } = this.state;

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

    if (!isProviderReady) {
      return React.createElement('div', {
        style: {
          padding: '20px',
          textAlign: 'center',
          color: '#6b7280'
        }
      }, 'Loading authentication...');
    }

    // Only render AuthProvider when it's loaded
    return React.createElement(this.AuthProvider, {}, children);
  }
}

export default ClassBasedAuthProvider;
