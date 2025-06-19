
import React, { Component, ReactNode } from 'react';
import { MinimalAuthContext } from '@/components/MinimalAuthProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import MinimalErrorBoundary from '@/components/MinimalErrorBoundary';

interface Props {
  children: ReactNode;
}

interface State {
  useMinimalAuth: boolean;
}

class ReliableUIProvider extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      useMinimalAuth: false,
    };
  }

  static getDerivedStateFromError() {
    // If the rich AuthProvider fails, fall back to minimal
    return { useMinimalAuth: true };
  }

  componentDidCatch(error: Error) {
    console.warn('Rich UI failed, falling back to minimal:', error);
  }

  render() {
    if (this.state.useMinimalAuth) {
      // Fallback to minimal auth
      return this.props.children;
    }

    // Try to use rich AuthProvider with error boundary
    return (
      <MinimalErrorBoundary>
        <AuthProvider>
          {this.props.children}
        </AuthProvider>
      </MinimalErrorBoundary>
    );
  }
}

export default ReliableUIProvider;
