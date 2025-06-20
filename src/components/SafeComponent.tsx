
import React, { Component, ReactNode } from 'react';
import { reactChecker } from '@/utils/reactReadinessChecker';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Lightweight component wrapper with basic error boundary functionality
 */
export class SafeComponent extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`SafeComponent[${this.props.componentName}]: Error caught`, error, errorInfo);
  }

  public render() {
    const { children, fallback, componentName = 'Component' } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      if (fallback) {
        return fallback;
      }
      
      return React.createElement('div', {
        style: {
          padding: '10px',
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          color: '#6b7280',
          textAlign: 'center'
        }
      }, `${componentName} encountered an error`);
    }

    return children;
  }
}

export default SafeComponent;
