import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import BulletproofDashboardLayout from '@/components/dashboard/BulletproofDashboardLayout';
import EnhancedVoiceSettings from '@/components/voice/EnhancedVoiceSettings';

const VoiceSettings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Voice Settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <BulletproofDashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Voice Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure your personalized therapist voice experience with ElevenLabs integration.
          </p>
        </div>
        
        <EnhancedVoiceSettings />
      </div>
    </BulletproofDashboardLayout>
  );
};

export default VoiceSettings;