
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SimpleAuthProvider } from '@/components/SimpleAuthProvider';
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
  return (
    <SimpleAuthProvider>
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
    </SimpleAuthProvider>
  );
};

export default AppRouter;
