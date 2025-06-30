
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Volume2, 
  Settings, 
  Key, 
  Mic,
  VolumeX 
} from 'lucide-react';
import { enhancedVoiceService } from '@/services/voiceService';
import { enhancedTherapyVoiceService } from '@/services/enhancedTherapyVoiceService';

const VoiceSettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [volume, setVolume] = useState([0.8]);
  const [showApiInput, setShowApiInput] = useState(!enhancedVoiceService.hasApiKey());

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      enhancedVoiceService.setApiKey(apiKey.trim());
      enhancedTherapyVoiceService.setApiKey(apiKey.trim());
      setShowApiInput(false);
    }
  };

  const testVoice = async () => {
    const testText = "Hello! This is a test of the AI voice system. How does this sound?";
    try {
      await enhancedVoiceService.playText(testText, 'EXAVITQu4vr4xnSDxMaL');
    } catch (error) {
      console.error('Voice test failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Voice Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Key Input */}
        {showApiInput && (
          <div className="space-y-2">
            <Label htmlFor="api-key" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>ElevenLabs API Key</span>
            </Label>
            <div className="flex space-x-2">
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your ElevenLabs API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button onClick={handleSaveApiKey} size="sm">
                Save
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Get your API key from{' '}
              <a 
                href="https://elevenlabs.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-therapy-600 hover:underline"
              >
                ElevenLabs
              </a>
            </p>
          </div>
        )}

        {/* Voice Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="voice-enabled" className="flex items-center space-x-2">
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span>Voice Responses</span>
          </Label>
          <Switch
            id="voice-enabled"
            checked={voiceEnabled}
            onCheckedChange={setVoiceEnabled}
          />
        </div>

        {/* Volume Control */}
        {voiceEnabled && (
          <div className="space-y-2">
            <Label>Volume: {Math.round(volume[0] * 100)}%</Label>
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>
        )}

        {/* Test Voice */}
        <Button 
          onClick={testVoice} 
          variant="outline" 
          className="w-full"
          disabled={!voiceEnabled}
        >
          <Mic className="h-4 w-4 mr-2" />
          Test Voice
        </Button>

        {/* Status */}
        <div className="text-xs text-center">
          Status: {enhancedVoiceService.hasApiKey() ? (
            <span className="text-green-600">ElevenLabs Connected</span>
          ) : (
            <span className="text-orange-600">Using Browser Voice</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceSettings;
