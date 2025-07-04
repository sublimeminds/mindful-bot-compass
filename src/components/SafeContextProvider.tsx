import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  name: string;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Safe context provider wrapper that prevents context failures from crashing the app
class SafeContextProvider extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    console.error(`SafeContextProvider (${this.props.name}): Context error`, error, errorInfo);
    this.props.onError?.(error);
  }

  public render() {
    if (this.state.hasError) {
      console.warn(`SafeContextProvider (${this.props.name}): Rendering fallback due to context error`);
      // Return children without the context provider - let components handle missing context gracefully
      return this.props.children;
    }

    return this.props.children;
  }
}

export default SafeContextProvider;