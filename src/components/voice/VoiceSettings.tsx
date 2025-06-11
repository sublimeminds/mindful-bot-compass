
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Volume2, VolumeX, Settings, Play, Key } from "lucide-react";
import { voiceService } from "@/services/voiceService";
import { useToast } from "@/hooks/use-toast";

interface VoiceSettingsProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const VoiceSettings: React.FC<VoiceSettingsProps> = ({ isEnabled, onToggle }) => {
  const { toast } = useToast();
  const [selectedVoice, setSelectedVoice] = useState("9BWtsMINqrJLrRacOk9x"); // Aria
  const [speechRate, setSpeechRate] = useState([0.9]);
  const [volume, setVolume] = useState([0.8]);
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const defaultVoices = [
    { voice_id: "9BWtsMINqrJLrRacOk9x", name: "Aria", description: "Calm, therapeutic" },
    { voice_id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", description: "Warm, supportive" },
    { voice_id: "cgSgspJ2msm6clMCkdW9", name: "Jessica", description: "Professional, clear" },
    { voice_id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", description: "Gentle, empathetic" }
  ];

  useEffect(() => {
    if (isEnabled) {
      loadAvailableVoices();
    }
    // Load saved preferences
    const savedVoice = localStorage.getItem('therapy_voice_id');
    const savedRate = localStorage.getItem('therapy_speech_rate');
    const savedVolume = localStorage.getItem('therapy_volume');
    
    if (savedVoice) setSelectedVoice(savedVoice);
    if (savedRate) setSpeechRate([parseFloat(savedRate)]);
    if (savedVolume) setVolume([parseFloat(savedVolume)]);
  }, [isEnabled]);

  const loadAvailableVoices = async () => {
    try {
      const voices = await voiceService.getAvailableVoices();
      setAvailableVoices(voices.length > 0 ? voices : defaultVoices);
    } catch (error) {
      setAvailableVoices(defaultVoices);
    }
  };

  const handleToggleVoice = async (enabled: boolean) => {
    if (enabled && !voiceService.hasApiKey()) {
      setShowApiKeyInput(true);
      return;
    }
    onToggle(enabled);
  };

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid ElevenLabs API key.",
        variant: "destructive",
      });
      return;
    }
    
    voiceService.setApiKey(apiKey.trim());
    setShowApiKeyInput(false);
    setApiKey('');
    onToggle(true);
    
    toast({
      title: "API Key Saved",
      description: "ElevenLabs API key has been saved and voice features are now enabled.",
    });
  };

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
    localStorage.setItem('therapy_voice_id', voiceId);
  };

  const handleRateChange = (rate: number[]) => {
    setSpeechRate(rate);
    localStorage.setItem('therapy_speech_rate', rate[0].toString());
  };

  const handleVolumeChange = (vol: number[]) => {
    setVolume(vol);
    localStorage.setItem('therapy_volume', vol[0].toString());
  };

  const testVoice = async () => {
    if (!isEnabled) return;
    
    setIsLoading(true);
    try {
      await voiceService.playText(
        "Hello! This is how I sound. I'm ready to help you with your therapy session.",
        {
          voiceId: selectedVoice,
          stability: 0.75,
          similarityBoost: 0.85
        }
      );
    } catch (error) {
      toast({
        title: "Voice Test Failed",
        description: "Unable to play voice sample. Please check your settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <Settings className="h-4 w-4" />
          <span>Voice Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voice Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="voice-enabled" className="text-sm font-medium">
            Enable Voice Responses
          </Label>
          <Switch
            id="voice-enabled"
            checked={isEnabled}
            onCheckedChange={handleToggleVoice}
          />
        </div>

        {/* API Key Input */}
        {showApiKeyInput && (
          <div className="space-y-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-blue-600" />
              <Label className="text-sm font-medium text-blue-900">ElevenLabs API Key</Label>
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter your ElevenLabs API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="text-sm"
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleApiKeySubmit}>
                  Save & Enable
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowApiKeyInput(false)}>
                  Cancel
                </Button>
              </div>
              <p className="text-xs text-blue-700">
                Get your API key from{' '}
                <a 
                  href="https://elevenlabs.io/app/settings/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800"
                >
                  ElevenLabs Settings
                </a>
              </p>
            </div>
          </div>
        )}

        {isEnabled && (
          <>
            {/* Voice Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Therapist Voice</Label>
              <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableVoices.map((voice) => (
                    <SelectItem key={voice.voice_id} value={voice.voice_id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{voice.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {voice.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Speech Rate */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Speech Rate: {speechRate[0].toFixed(1)}x
              </Label>
              <Slider
                value={speechRate}
                onValueChange={handleRateChange}
                min={0.5}
                max={1.5}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Volume */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Volume: {Math.round(volume[0] * 100)}%
              </Label>
              <Slider
                value={volume}
                onValueChange={handleVolumeChange}
                min={0.1}
                max={1.0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Test Voice Button */}
            <Button
              onClick={testVoice}
              disabled={isLoading || !voiceService.hasApiKey()}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Test Voice
            </Button>

            {/* Features List */}
            <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
              <p>✅ Automatic AI response playback</p>
              <p>✅ Individual message playback</p>
              <p>✅ Voice interruption control</p>
              <p>✅ Therapist-matched voices</p>
            </div>
          </>
        )}

        {/* Setup Instructions */}
        {!voiceService.hasApiKey() && !showApiKeyInput && (
          <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded border border-amber-200">
            <p className="font-medium mb-1">🎤 Voice Features Available</p>
            <p>Add your ElevenLabs API key to enable high-quality therapeutic voice responses.</p>
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-2 text-xs h-7"
              onClick={() => setShowApiKeyInput(true)}
            >
              <Key className="h-3 w-3 mr-1" />
              Add API Key
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceSettings;
