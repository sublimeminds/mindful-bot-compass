import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SafeErrorBoundary from '@/components/SafeErrorBoundary';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import MoodTracker from '@/components/MoodTracker';
import GoalTracker from '@/components/GoalTracker';

function App() {
  console.log('App: Starting TherapySync (Phase 4 - with real functionality)...');
  
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
        <Route path="/mood" element={
          <SafeErrorBoundary name="MoodTrackerPage">
            <MoodTracker />
          </SafeErrorBoundary>
        } />
        <Route path="/goals" element={
          <SafeErrorBoundary name="GoalTrackerPage">
            <GoalTracker />
          </SafeErrorBoundary>
        } />
      </Routes>
    </SafeErrorBoundary>
  );
}

export default App;