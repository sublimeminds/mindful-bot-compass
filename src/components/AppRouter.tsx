
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/components/MinimalAppProvider';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import DashboardPage from '@/pages/DashboardPage';

const AppRouter = () => {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Index />} />
      </Routes>
    </AppProvider>
  );
};

export default AppRouter;
