import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import './App.css';

// Create a simple, reliable app without complex providers
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  console.log('App: Starting simplified TherapySync...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          {/* Simple routing without complex context providers */}
          <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50">
            {/* Header */}
            <header className="p-6 border-b bg-white/80 backdrop-blur-sm">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-therapy-900">TherapySync</span>
                </div>
                <button className="bg-therapy-600 hover:bg-therapy-700 text-white px-4 py-2 rounded">
                  Get Started
                </button>
              </div>
            </header>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 py-12">
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-therapy-900 mb-6">
                  AI-Powered Mental Health Support
                </h1>
                <p className="text-xl text-therapy-700 mb-8 max-w-3xl mx-auto">
                  Experience personalized therapy with advanced AI technology, voice interactions, and 24/7 crisis support.
                </p>
                <div className="flex gap-4 justify-center">
                  <button className="bg-therapy-600 hover:bg-therapy-700 text-white px-6 py-3 rounded text-lg">
                    Start Free Trial
                  </button>
                  <button className="border border-therapy-600 text-therapy-600 hover:bg-therapy-50 px-6 py-3 rounded text-lg">
                    Learn More
                  </button>
                </div>
              </div>
            </main>
          </div>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;