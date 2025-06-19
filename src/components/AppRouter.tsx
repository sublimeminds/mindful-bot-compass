
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import AuthForm from '@/components/auth/AuthForm';
import OnboardingPage from '@/pages/OnboardingPage';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import { useAuth } from '@/contexts/AuthContext';
import NotebookPage from '@/pages/NotebookPage';
import EnhancedProfilePage from '@/pages/EnhancedProfilePage';
import CrisisManagement from '@/pages/CrisisManagement';
import SmartScheduling from '@/pages/SmartScheduling';
import MonitoringPage from '@/pages/MonitoringPage';
import AdminPerformance from '@/pages/AdminPerformance';
import AdminOnlyWrapper from '@/components/admin/AdminOnlyWrapper';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth" />;
  }
  return <>{children}</>;
};

const AppRouter = () => {
  const { user } = useAuth();

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
        <ProtectedRoute>
          <OnboardingPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/enhanced-profile" element={
        <ProtectedRoute>
          <EnhancedProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/notebook" element={
        <ProtectedRoute>
          <NotebookPage />
        </ProtectedRoute>
      } />
      <Route path="/crisis-management" element={
        <ProtectedRoute>
          <CrisisManagement />
        </ProtectedRoute>
      } />
      <Route path="/smart-scheduling" element={
        <ProtectedRoute>
          <SmartScheduling />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
