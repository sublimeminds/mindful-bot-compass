
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { BulletproofAuthProvider } from '@/components/bulletproof/BulletproofAuthProvider';
import { ThemeProvider } from '@/utils/BulletproofTheme';
import ReactErrorBoundary from '@/components/error/ReactErrorBoundary';
import Header from '@/components/Header';
import DatabaseFooter from '@/components/DatabaseFooter';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import SearchResults from '@/pages/SearchResults';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <ReactErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="therapysync-theme">
          <BulletproofAuthProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/search" element={<SearchResults />} />
                  </Routes>
                </main>
                <DatabaseFooter />
                <Toaster />
                <Sonner />
              </div>
            </Router>
          </BulletproofAuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ReactErrorBoundary>
  );
}

export default App;
