import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import BulletproofErrorBoundary from '@/components/BulletproofErrorBoundary';
import { serviceHealthManager } from '@/utils/serviceHealthManager';
import './App.css';

// Simple direct route components
const IndexPage = React.lazy(() => import('./pages/Index'));
const DashboardPage = React.lazy(() => import('./pages/Dashboard'));

function App() {
  console.log('App: Starting TherapySync...');
  
  useEffect(() => {
    serviceHealthManager.startHealthChecks(10000);
    return () => {
      serviceHealthManager.cleanup();
    };
  }, []);
  
  return (
    <BulletproofErrorBoundary>
      <Routes>
        <Route path="/" element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <IndexPage />
          </React.Suspense>
        } />
        <Route path="/dashboard" element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <DashboardPage />
          </React.Suspense>
        } />
      </Routes>
    </BulletproofErrorBoundary>
  );
}

export default App;