
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VoiceSettings from '@/components/voice/VoiceSettings';

const VoiceSettingsPage = () => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  const handleVoiceToggle = (enabled: boolean) => {
    setIsVoiceEnabled(enabled);
    // Store the preference in localStorage
    localStorage.setItem('voice_enabled', enabled.toString());
  };

  // Load initial state from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem('voice_enabled');
    if (stored) {
      setIsVoiceEnabled(stored === 'true');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-therapy-600 mb-8">Voice Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Voice Interaction Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <VoiceSettings 
              isEnabled={isVoiceEnabled}
              onToggle={handleVoiceToggle}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceSettingsPage;
