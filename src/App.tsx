
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MinimalErrorBoundary from '@/components/MinimalErrorBoundary';
import MainAppContent from '@/components/MainAppContent';
import './App.css';

// Create a simple QueryClient with minimal configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// Ultra-simple class component for maximum reliability
class App extends Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App component error:', error, errorInfo);
  }

  render() {
    // Ensure React is available
    if (typeof React === 'undefined' || !React.createElement) {
      return React.createElement('div', {
        style: {
          padding: '20px',
          textAlign: 'center',
          color: 'red',
          fontFamily: 'Arial, sans-serif'
        }
      }, 'React is not properly initialized. Please reload the page.');
    }

    return React.createElement(MinimalErrorBoundary, null,
      React.createElement(QueryClientProvider, { client: queryClient },
        React.createElement(Router, null,
          React.createElement(MainAppContent)
        )
      )
    );
  }
}

export default App;
