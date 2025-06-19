
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

// Class-based wrapper that only renders TherapistProvider when React is truly ready
export class ClassBasedTherapistProvider extends Component<Props, State> {
  private TherapistProvider: any = null;
  private mounted = true;

  state: State = {
    isReactReady: false,
    validationReport: null
  };

  async componentDidMount() {
    try {
      console.log('ClassBasedTherapistProvider: Starting React validation...');
      
      // Wait for React to be fully ready
      const report = await advancedReactValidator.waitForReactReady();
      
      if (!this.mounted) return;

      if (report.isReady) {
        // Dynamically import TherapistProvider only when React is ready
        const { TherapistProvider } = await import('@/contexts/TherapistContext');
        this.TherapistProvider = TherapistProvider;
        
        this.setState({
          isReactReady: true,
          validationReport: report
        });
        
        console.log('ClassBasedTherapistProvider: React ready, TherapistProvider loaded');
      } else {
        throw new Error('React failed to initialize properly');
      }
    } catch (error) {
      console.error('ClassBasedTherapistProvider: Failed to initialize', error);
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

    if (!isReactReady) {
      return React.createElement('div', {
        style: {
          padding: '20px',
          textAlign: 'center',
          color: '#6b7280'
        }
      }, 'Initializing therapist system...');
    }

    // Only render TherapistProvider when React is confirmed ready
    return React.createElement(this.TherapistProvider, {}, children);
  }
}

export default ClassBasedTherapistProvider;
