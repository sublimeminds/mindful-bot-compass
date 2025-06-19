
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import AuthForm from '@/components/auth/AuthForm';
import Onboarding from '@/pages/Onboarding';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import NotebookPage from '@/pages/NotebookPage';
import EnhancedProfilePage from '@/pages/EnhancedProfilePage';
import CrisisManagement from '@/pages/CrisisManagement';
import SmartScheduling from '@/pages/SmartScheduling';
import MonitoringPage from '@/pages/MonitoringPage';
import AdminPerformance from '@/pages/AdminPerformance';
import AdminOnlyWrapper from '@/components/admin/AdminOnlyWrapper';
import Community from '@/pages/Community';
import SimpleProtectedRoute from '@/components/SimpleProtectedRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<AuthForm />} />
      <Route path="/monitoring" element={
        <AdminOnlyWrapper fallback={<Navigate to="/" />}>
          <MonitoringPage />
        </AdminOnlyWrapper>
      } />
      <Route path="/admin/performance" element={
        <AdminOnlyWrapper fallback={<Navigate to="/" />}>
          <AdminPerformance />
        </AdminOnlyWrapper>
      } />
      <Route path="/onboarding" element={
        <SimpleProtectedRoute>
          <Onboarding />
        </SimpleProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <SimpleProtectedRoute>
          <Dashboard />
        </SimpleProtectedRoute>
      } />
      <Route path="/community" element={
        <SimpleProtectedRoute>
          <Community />
        </SimpleProtectedRoute>
      } />
      <Route path="/profile" element={
        <SimpleProtectedRoute>
          <Profile />
        </SimpleProtectedRoute>
      } />
      <Route path="/enhanced-profile" element={
        <SimpleProtectedRoute>
          <EnhancedProfilePage />
        </SimpleProtectedRoute>
      } />
      <Route path="/notebook" element={
        <SimpleProtectedRoute>
          <NotebookPage />
        </SimpleProtectedRoute>
      } />
      <Route path="/crisis-management" element={
        <SimpleProtectedRoute>
          <CrisisManagement />
        </SimpleProtectedRoute>
      } />
      <Route path="/smart-scheduling" element={
        <SimpleProtectedRoute>
          <SmartScheduling />
        </SimpleProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
