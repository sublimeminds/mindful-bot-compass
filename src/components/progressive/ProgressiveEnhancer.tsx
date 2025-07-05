import React, { Component, ReactNode, useState, useEffect } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  delay?: number;
  name?: string;
}

interface State {
  hasError: boolean;
  isReady: boolean;
}

// Progressive enhancement wrapper that safely loads hook-dependent components
export class ProgressiveEnhancer extends Component<Props, State> {
  private timeoutId?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      isReady: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    console.warn(`ProgressiveEnhancer (${this.name}): Hook error caught`, error);
    return { hasError: true };
  }

  componentDidMount() {
    // Wait for React to fully initialize before enabling hooks
    this.timeoutId = setTimeout(() => {
      this.setState({ isReady: true });
    }, this.props.delay || 1000);
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.warn(`ProgressiveEnhancer (${this.props.name}): Component error`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }

    if (!this.state.isReady) {
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}

// Hook-safe wrapper for components that need React hooks
export const SafeHookWrapper: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
  delay?: number;
}> = ({ children, fallback, delay = 1500 }) => {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setIsReady(true);
      } catch (error) {
        console.warn('SafeHookWrapper: Failed to enable hooks', error);
        setHasError(true);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (hasError || !isReady) {
    return fallback || null;
  }

  return <>{children}</>;
};

// Staged component loader for progressive enhancement
export const StagedLoader: React.FC<{
  stages: Array<{
    component: ReactNode;
    delay: number;
    fallback?: ReactNode;
  }>;
}> = ({ stages }) => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    if (currentStage < stages.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStage(prev => prev + 1);
      }, stages[currentStage].delay);

      return () => clearTimeout(timer);
    }
  }, [currentStage, stages]);

  const stage = stages[currentStage];
  return <>{stage?.component || stage?.fallback}</>;
};

export default ProgressiveEnhancer;