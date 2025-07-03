import React from 'react';
import BulletproofErrorBoundary from '@/components/BulletproofErrorBoundary';
import RecoveryLoader from '@/components/RecoveryLoader';
import './App.css';

function App() {
  console.log('App: Starting TherapySync with Recovery System...');
  
  return (
    <BulletproofErrorBoundary>
      <RecoveryLoader />
    </BulletproofErrorBoundary>
  );
}

export default App;