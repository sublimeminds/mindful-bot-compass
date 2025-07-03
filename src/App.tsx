import React, { useEffect } from 'react';
import BulletproofErrorBoundary from '@/components/BulletproofErrorBoundary';
import AppRouter from '@/components/AppRouter';
import './App.css';

function App() {
  console.log('App: Starting TherapySync...');
  
  // Remove conflicting service health manager
  
  return (
    <BulletproofErrorBoundary>
      <AppRouter />
    </BulletproofErrorBoundary>
  );
}

export default App;