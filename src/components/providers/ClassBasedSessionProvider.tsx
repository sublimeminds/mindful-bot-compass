
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  isProviderReady: boolean;
  error?: Error;
}

// Class-based wrapper that safely loads SessionProvider
export class ClassBasedSessionProvider extends Component<Props, State> {
  private SessionProvider: any = null;
  private mounted = true;

  state: State = {
    isProviderReady: false
  };

  async componentDidMount() {
    try {
      console.log('ClassBasedSessionProvider: Loading SessionProvider...');
      
      // Simple delay to ensure React is stable
      await new Promise(resolve => setTimeout(resolve, 150));
      
      if (!this.mounted) return;

      // Dynamically import SessionProvider
      const { SessionProvider } = await import('@/contexts/SessionContext');
      this.SessionProvider = SessionProvider;
      
      this.setState({
        isProviderReady: true
      });
      
      console.log('ClassBasedSessionProvider: SessionProvider loaded successfully');
    } catch (error) {
      console.error('ClassBasedSessionProvider: Failed to load SessionProvider', error);
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
        React.createElement('h3', { key: 'title' }, 'Session System Error'),
        React.createElement('p', { key: 'message' }, 'Failed to initialize session system. Please refresh the page.'),
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
      }, 'Loading session management...');
    }

    // Only render SessionProvider when it's loaded
    return React.createElement(this.SessionProvider, {}, children);
  }
}

export default ClassBasedSessionProvider;
