
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/EnhancedAuthProvider';

interface AuthGuardProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireOnboarding = false }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (requireOnboarding) {
        // Check if user has completed onboarding
        const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
        if (!hasCompletedOnboarding) {
          navigate('/onboarding');
        }
      }
    }
  }, [user, loading, navigate, requireOnboarding]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
