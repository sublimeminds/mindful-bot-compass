
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/components/MinimalAppProvider';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import DashboardPage from '@/pages/DashboardPage';
import CrisisManagement from '@/pages/CrisisManagement';
import Community from '@/pages/Community';
import NotebookPage from '@/pages/NotebookPage';
import SmartScheduling from '@/pages/SmartScheduling';
import Help from '@/pages/Help';
import Plans from '@/pages/Plans';
import NotFound from '@/pages/NotFound';

const AppRouter = () => {
  console.log('AppRouter rendering');
  
  // Ensure React is available before setting up routing
  if (!React || !React.useState || !React.useContext) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        backgroundColor: '#fee2e2',
        color: '#991b1b' 
      }}>
        React context not available. Please refresh the page.
      </div>
    );
  }
  
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/crisis-management" element={<CrisisManagement />} />
        <Route path="/community" element={<Community />} />
        <Route path="/notebook" element={<NotebookPage />} />
        <Route path="/smart-scheduling" element={<SmartScheduling />} />
        <Route path="/help" element={<Help />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppProvider>
  );
};

export default AppRouter;
