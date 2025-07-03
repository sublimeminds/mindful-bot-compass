import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SafeErrorBoundary from '@/components/SafeErrorBoundary';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';

function App() {
  console.log('App: Starting TherapySync (Phase 3 - with error boundaries)...');
  
  return (
    <SafeErrorBoundary name="App">
      <Routes>
        <Route path="/" element={
          <SafeErrorBoundary name="IndexPage">
            <Index />
          </SafeErrorBoundary>
        } />
        <Route path="/dashboard" element={
          <SafeErrorBoundary name="DashboardPage">
            <Dashboard />
          </SafeErrorBoundary>
        } />
      </Routes>
    </SafeErrorBoundary>
  );
}

export default App;