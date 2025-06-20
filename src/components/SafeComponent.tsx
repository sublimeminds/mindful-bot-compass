
import React, { Component, ReactNode } from 'react';
import { reactChecker } from '@/utils/reactReadinessChecker';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  isReactSafe: boolean;
  hasError: boolean;
}

/**
 * Universal component wrapper that ensures React is ready before rendering children
 */
export class SafeComponent extends Component<Props, State> {
  public state: State = {
    isReactSafe: false,
    hasError: false
  };

  public componentDidMount() {
    this.checkReactSafety();
  }

  public static getDerivedStateFromError(): State {
    return { isReactSafe: false, hasError: true };
  }

  private checkReactSafety = () => {
    try {
      const isReady = reactChecker.checkReactReadiness();
      this.setState({ isReactSafe: isReady, hasError: false });
    } catch (error) {
      console.error(`SafeComponent[${this.props.componentName}]: Safety check failed`, error);
      this.setState({ isReactSafe: false, hasError: true });
    }
  };

  public render() {
    const { children, fallback, componentName = 'Component' } = this.props;
    const { isReactSafe, hasError } = this.state;

    if (hasError || !isReactSafe) {
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
      }, `${componentName} loading...`);
    }

    return children;
  }
}

export default SafeComponent;
