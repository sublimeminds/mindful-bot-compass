import React from 'react';
import MinimalErrorBoundary from '@/components/MinimalErrorBoundary';
import AppRouter from '@/components/AppRouter';
import './App.css';

function App() {
  console.log('App: Starting TherapySync with minimal setup...');
  
  return (
    <MinimalErrorBoundary>
      <AppRouter />
    </MinimalErrorBoundary>
  );
}

export default App;