import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import StructuredSessionInterface from '@/components/therapy/StructuredSessionInterface';

const EnhancedTherapy = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Enhanced Therapy...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-6">
      <StructuredSessionInterface
        therapyApproach="Enhanced Therapy"
        onSessionComplete={(summary) => {
          console.log('Session completed:', summary);
          // TODO: Handle session completion
        }}
        initialMood={5}
      />
    </div>
  );
};

export default EnhancedTherapy;