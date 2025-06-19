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

const SafeProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  try {
    // Try to access useAuth only if we're in a context
    const { useAuth } = require('@/contexts/AuthContext');
    const { user } = useAuth();
    
    if (!user) {
      return <Navigate to="/auth" />;
    }
    return <>{children}</>;
  } catch (error) {
    // If context is not available, redirect to auth
    console.warn('AuthContext not available, redirecting to auth');
    return <Navigate to="/auth" />;
  }
};

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
        <SafeProtectedRoute>
          <Onboarding />
        </SafeProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <SafeProtectedRoute>
          <Dashboard />
        </SafeProtectedRoute>
      } />
      <Route path="/community" element={
        <SafeProtectedRoute>
          <Community />
        </SafeProtectedRoute>
      } />
      <Route path="/profile" element={
        <SafeProtectedRoute>
          <Profile />
        </SafeProtectedRoute>
      } />
      <Route path="/enhanced-profile" element={
        <SafeProtectedRoute>
          <EnhancedProfilePage />
        </SafeProtectedRoute>
      } />
      <Route path="/notebook" element={
        <SafeProtectedRoute>
          <NotebookPage />
        </SafeProtectedRoute>
      } />
      <Route path="/crisis-management" element={
        <SafeProtectedRoute>
          <CrisisManagement />
        </SafeProtectedRoute>
      } />
      <Route path="/smart-scheduling" element={
        <SafeProtectedRoute>
          <SmartScheduling />
        </SafeProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
