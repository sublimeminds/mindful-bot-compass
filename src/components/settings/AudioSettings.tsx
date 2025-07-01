
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Volume2, VolumeX, Headphones, Settings, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AudioSettings = () => {
  const { toast } = useToast();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState([0.8]);
  const [preferredVoice, setPreferredVoice] = useState('dr-sarah-chen');
  const [audioQuality, setAudioQuality] = useState('high');
  const [autoPlay, setAutoPlay] = useState(false);
  const [backgroundAudio, setBackgroundAudio] = useState(true);

  const voices = [
    { id: 'dr-sarah-chen', name: 'Dr. Sarah Chen (Calm & Empathetic)' },
    { id: 'dr-michael-thompson', name: 'Dr. Michael Thompson (Warm & Reassuring)' },
    { id: 'dr-elena-rodriguez', name: 'Dr. Elena Rodriguez (Gentle & Supportive)' }
  ];

  const handleSaveSettings = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('audioSettings', JSON.stringify({
      audioEnabled,
      voiceVolume: voiceVolume[0],
      preferredVoice,
      audioQuality,
      autoPlay,
      backgroundAudio
    }));

    toast({
      title: "Settings Saved",
      description: "Your audio preferences have been updated successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Headphones className="h-5 w-5" />
          <span>Audio Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Audio Enable/Disable */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Enable Audio</Label>
            <p className="text-sm text-muted-foreground">
              Turn on/off all audio features in the app
            </p>
          </div>
          <Switch
            checked={audioEnabled}
            onCheckedChange={setAudioEnabled}
          />
        </div>

        {audioEnabled && (
          <>
            {/* Voice Volume */}
            <div className="space-y-3">
              <Label>Voice Volume</Label>
              <div className="flex items-center space-x-4">
                <VolumeX className="h-4 w-4" />
                <Slider
                  value={voiceVolume}
                  onValueChange={setVoiceVolume}
                  max={1}
                  min={0}
                  step={0.1}
                  className="flex-1"
                />
                <Volume2 className="h-4 w-4" />
              </div>
              <p className="text-sm text-muted-foreground">
                Current volume: {Math.round(voiceVolume[0] * 100)}%
              </p>
            </div>

            {/* Preferred Voice */}
            <div className="space-y-2">
              <Label>Preferred Therapist Voice</Label>
              <Select value={preferredVoice} onValueChange={setPreferredVoice}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Audio Quality */}
            <div className="space-y-2">
              <Label>Audio Quality</Label>
              <Select value={audioQuality} onValueChange={setAudioQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Quality (Recommended)</SelectItem>
                  <SelectItem value="medium">Medium Quality</SelectItem>
                  <SelectItem value="low">Low Quality (Data Saver)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Auto Play */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto-play Content</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically start playing audio content when selected
                </p>
              </div>
              <Switch
                checked={autoPlay}
                onCheckedChange={setAutoPlay}
              />
            </div>

            {/* Background Audio */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Background Audio</Label>
                <p className="text-sm text-muted-foreground">
                  Continue playing audio when app is in background
                </p>
              </div>
              <Switch
                checked={backgroundAudio}
                onCheckedChange={setBackgroundAudio}
              />
            </div>
          </>
        )}

        <Button onClick={handleSaveSettings} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Audio Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default AudioSettings;
