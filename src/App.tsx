
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { SimpleAppProvider } from '@/hooks/useSimpleApp';
import MinimalErrorBoundary from '@/components/MinimalErrorBoundary';
import SimpleLandingPage from '@/components/SimpleLandingPage';
import './App.css';

const queryClient = new QueryClient();

// Minimal working version - progressively add features back
function App() {
  return (
    <MinimalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SimpleAppProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<SimpleLandingPage />} />
                <Route path="/*" element={<SimpleLandingPage />} />
              </Routes>
              <Toaster />
              <Sonner />
            </div>
          </Router>
        </SimpleAppProvider>
      </QueryClientProvider>
    </MinimalErrorBoundary>
  );
}

export default App;
