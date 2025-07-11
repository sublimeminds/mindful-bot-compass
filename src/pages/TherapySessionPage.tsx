import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import FullTherapySession from '@/components/therapy/FullTherapySession';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';

const TherapySessionPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Full Therapy Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthRequiredPage 
      title="Access Therapy Sessions" 
      description="Sign in to access your personalized therapy sessions with check-in/check-out, mood tracking, and AI-powered support."
      redirectTo="/therapy-session"
    />;
  }

  return (
    <DashboardLayoutWithSidebar>
      <FullTherapySession />
    </DashboardLayoutWithSidebar>
  );
};

export default TherapySessionPage;