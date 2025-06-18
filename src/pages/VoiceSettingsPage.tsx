
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VoiceSettings from '@/components/voice/VoiceSettings';

const VoiceSettingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-therapy-600 mb-8">Voice Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Voice Interaction Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <VoiceSettings />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceSettingsPage;
