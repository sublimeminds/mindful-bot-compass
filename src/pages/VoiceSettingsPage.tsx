
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VoiceSettingsComponent from '@/components/voice/VoiceSettings';

const VoiceSettingsPage = () => {
  const [settings, setSettings] = useState({
    pitch: 1,
    rate: 1,
    volume: 1,
    voice: null as SpeechSynthesisVoice | null
  });
  
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const populateVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      if (voices.length > 0 && !settings.voice) {
        setSettings(prev => ({ ...prev, voice: voices[0] }));
      }
    };

    if (speechSynthesis.getVoices().length > 0) {
      populateVoices();
    } else {
      speechSynthesis.addEventListener('voiceschanged', populateVoices);
    }

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', populateVoices);
    };
  }, [settings.voice]);

  const handleSettingsChange = (newSettings: typeof settings) => {
    setSettings(newSettings);
    // Store preferences in localStorage
    localStorage.setItem('voice_settings', JSON.stringify(newSettings));
  };

  // Load initial settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('voice_settings');
    if (stored) {
      try {
        const parsedSettings = JSON.parse(stored);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Error loading voice settings:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-therapy-600 mb-8">Voice Settings</h1>
        
        <VoiceSettingsComponent 
          settings={settings}
          availableVoices={availableVoices}
          onSettingsChange={handleSettingsChange}
        />
      </div>
    </div>
  );
};

export default VoiceSettingsPage;
