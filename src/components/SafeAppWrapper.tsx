import React, { Component, ReactNode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import SafeReactGuard from './SafeReactGuard';
import SafeAuthProvider from './SafeAuthProvider';
import ErrorBoundary from './ErrorBoundary';
import AppRouter from './AppRouter';

interface Props {
  children?: ReactNode;
}

interface State {
  queryClient: QueryClient;
}

// Safe App Wrapper that initializes everything in the correct order
export class SafeAppWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      queryClient: new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      })
    };
  }

  public render() {
    const { queryClient } = this.state;

    console.log('SafeAppWrapper: Starting application...');

    return React.createElement(
      SafeReactGuard,
      null,
      React.createElement(
        ErrorBoundary,
        null,
        React.createElement(
          QueryClientProvider,
          { client: queryClient },
          React.createElement(
            Router,
            null,
            React.createElement(
              SafeAuthProvider,
              null,
              React.createElement(
                'div',
                { className: 'min-h-screen bg-background' },
                React.createElement(AppRouter),
                React.createElement(Toaster)
              )
            )
          )
        )
      )
    );
  }
}

export default SafeAppWrapper;