
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

// Ultra-simple class component for maximum reliability with rich UI
class App extends Component {
  render() {
    return (
      <MinimalErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Router>
            <MainAppContent />
          </Router>
        </QueryClientProvider>
      </MinimalErrorBoundary>
    );
  }
}

export default App;
