
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import OnboardingPage from '@/pages/OnboardingPage';
import SessionPage from '@/pages/SessionPage';
import SettingsPage from '@/pages/SettingsPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import VoiceSettingsPage from '@/pages/VoiceSettingsPage';
import Techniques from '@/pages/Techniques';
import NotFound from '@/pages/NotFound';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/onboarding" element={isAuthenticated ? <OnboardingPage /> : <Navigate to="/login" />} />
        <Route path="/session" element={isAuthenticated ? <SessionPage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/subscription" element={isAuthenticated ? <SubscriptionPage /> : <Navigate to="/login" />} />
        <Route path="/voice-settings" element={isAuthenticated ? <VoiceSettingsPage /> : <Navigate to="/login" />} />
        <Route path="/techniques" element={isAuthenticated ? <Techniques /> : <Navigate to="/login" />} />
        <Route path="/techniques/:techniqueId" element={isAuthenticated ? <Techniques /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
