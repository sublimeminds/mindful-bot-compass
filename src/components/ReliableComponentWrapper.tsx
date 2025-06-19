
import React, { Component, ReactNode } from 'react';
import MinimalErrorBoundary from '@/components/MinimalErrorBoundary';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
}

class ReliableComponentWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn(`Component ${this.props.componentName || 'unknown'} failed:`, error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          padding: '20px',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          textAlign: 'center' as const,
          color: '#6b7280'
        }}>
          <p>Component temporarily unavailable</p>
        </div>
      );
    }

    return (
      <MinimalErrorBoundary>
        {this.props.children}
      </MinimalErrorBoundary>
    );
  }
}

export default ReliableComponentWrapper;
