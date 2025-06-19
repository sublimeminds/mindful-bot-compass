
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  isProviderReady: boolean;
  error?: Error;
}

// Class-based wrapper that safely loads TherapistProvider
export class ClassBasedTherapistProvider extends Component<Props, State> {
  private TherapistProvider: any = null;
  private mounted = true;

  state: State = {
    isProviderReady: false
  };

  async componentDidMount() {
    try {
      console.log('ClassBasedTherapistProvider: Loading TherapistProvider...');
      
      // Simple delay to ensure React is stable
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (!this.mounted) return;

      // Dynamically import TherapistProvider
      const { TherapistProvider } = await import('@/contexts/TherapistContext');
      this.TherapistProvider = TherapistProvider;
      
      this.setState({
        isProviderReady: true
      });
      
      console.log('ClassBasedTherapistProvider: TherapistProvider loaded successfully');
    } catch (error) {
      console.error('ClassBasedTherapistProvider: Failed to load TherapistProvider', error);
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
        React.createElement('h3', { key: 'title' }, 'Therapist System Error'),
        React.createElement('p', { key: 'message' }, 'Failed to initialize therapist system. Please refresh the page.'),
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
      }, 'Loading therapist system...');
    }

    // Only render TherapistProvider when it's loaded
    return React.createElement(this.TherapistProvider, {}, children);
  }
}

export default ClassBasedTherapistProvider;
