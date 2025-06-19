
import React, { Component } from 'react';

interface State {
  isOnline: boolean;
}

export class SimpleOfflineIndicator extends Component<{}, State> {
  public state: State = {
    isOnline: navigator.onLine
  };

  private handleOnline = () => {
    this.setState({ isOnline: true });
  };

  private handleOffline = () => {
    this.setState({ isOnline: false });
  };

  public componentDidMount() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  public componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  public render() {
    if (this.state.isOnline) {
      return null;
    }

    return React.createElement('div', {
      style: {
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        backgroundColor: '#fed7aa',
        color: '#9a3412',
        padding: '8px 16px',
        borderRadius: '6px',
        border: '1px solid #fdba74',
        fontSize: '14px',
        fontWeight: '500'
      }
    }, '📶 Offline Mode');
  }
}

export default SimpleOfflineIndicator;
