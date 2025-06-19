
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MinimalErrorBoundary from '@/components/MinimalErrorBoundary';
import MinimalAuthProvider from '@/components/MinimalAuthProvider';
import MinimalApp from '@/components/MinimalApp';
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
  render() {
    return (
      <MinimalErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Router>
            <MinimalAuthProvider>
              <MinimalApp />
            </MinimalAuthProvider>
          </Router>
        </QueryClientProvider>
      </MinimalErrorBoundary>
    );
  }
}

export default App;
