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
    <div className="min-h-screen bg-gradient-to-br from-therapy-600 via-harmony-500 to-calm-700">
      {/* Hero Section with Navigation-Matched Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-therapy-600 via-harmony-500 to-calm-700 p-8 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center animate-glow-healing">
              <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Enhanced Therapy Sessions</h1>
              <p className="text-white/90 text-lg">
                AI-guided CBT sessions focusing on thought patterns and coping strategies
              </p>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      </div>
      
      <div className="p-6 bg-white">
        <StructuredSessionInterface
          therapyApproach="Enhanced Therapy"
          onSessionComplete={(summary) => {
            console.log('Session completed:', summary);
            // TODO: Handle session completion
          }}
          initialMood={5}
        />
      </div>
    </div>
  );
};

export default EnhancedTherapy;