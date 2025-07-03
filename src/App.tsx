import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';

function App() {
  console.log('App: Starting TherapySync (minimal setup)...');
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;