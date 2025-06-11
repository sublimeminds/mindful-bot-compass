
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Volume2, VolumeX, Settings, Play } from "lucide-react";
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
      toast({
        title: "API Key Required",
        description: "Please add your ElevenLabs API key to enable voice features.",
        variant: "destructive",
      });
      return;
    }
    onToggle(enabled);
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
            Enable Voice
          </Label>
          <Switch
            id="voice-enabled"
            checked={isEnabled}
            onCheckedChange={handleToggleVoice}
          />
        </div>

        {isEnabled && (
          <>
            {/* Voice Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Voice</Label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
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
                onValueChange={setSpeechRate}
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
                onValueChange={setVolume}
                min={0.1}
                max={1.0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Test Voice Button */}
            <Button
              onClick={testVoice}
              disabled={isLoading}
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

            {/* API Key Notice */}
            {!voiceService.hasApiKey() && (
              <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                Add ElevenLabs API key in settings to enable voice features
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceSettings;
