
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import AppRouter from '@/components/AppRouter';
import './App.css';

// Create QueryClient once
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log('App component rendering');
  
  // Comprehensive React validation before any router initialization
  const isReactFullyReady = React && 
    typeof React === 'object' && 
    React.useState && 
    React.useRef &&
    React.useContext &&
    React.useEffect &&
    React.useMemo &&
    React.useCallback &&
    React.createElement &&
    React.Fragment;

  if (!isReactFullyReady) {
    console.error('React is not fully initialized, showing fallback');
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <h2>Application Loading</h2>
        <p>React is initializing. Please wait...</p>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginTop: '20px'
        }}></div>
      </div>
    );
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen">
          <AppRouter />
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
