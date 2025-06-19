
import React, { Component } from 'react';

interface State {
  isOnline: boolean;
}

class SimpleOfflineIndicator extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isOnline: navigator.onLine,
    };
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  private handleOnline = () => {
    this.setState({ isOnline: true });
  };

  private handleOffline = () => {
    this.setState({ isOnline: false });
  };

  render() {
    if (this.state.isOnline) {
      return null;
    }

    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        backgroundColor: '#ef4444',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      }}>
        📡 You're offline
      </div>
    );
  }
}

export default SimpleOfflineIndicator;
