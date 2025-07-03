import React, { useEffect } from 'react';
import BulletproofErrorBoundary from '@/components/BulletproofErrorBoundary';
import AppRouter from '@/components/AppRouter';
import { serviceHealthManager } from '@/utils/serviceHealthManager';
import './App.css';

function App() {
  console.log('App: Starting TherapySync...');
  
  useEffect(() => {
    // Start background service health monitoring (non-blocking)
    serviceHealthManager.startHealthChecks(10000);
    
    return () => {
      serviceHealthManager.cleanup();
    };
  }, []);
  
  return (
    <BulletproofErrorBoundary>
      <AppRouter />
    </BulletproofErrorBoundary>
  );
}

export default App;