
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

interface VoiceSettings {
  pitch: number;
  rate: number;
  volume: number;
  voice: SpeechSynthesisVoice | null;
}

interface VoiceSettingsProps {
  settings: VoiceSettings;
  availableVoices: SpeechSynthesisVoice[];
  onSettingsChange: (settings: VoiceSettings) => void;
}

const VoiceSettingsComponent: React.FC<VoiceSettingsProps> = ({
  settings,
  availableVoices,
  onSettingsChange
}) => {
  const handlePitchChange = (value: number[]) => {
    onSettingsChange({ ...settings, pitch: value[0] });
  };

  const handleRateChange = (value: number[]) => {
    onSettingsChange({ ...settings, rate: value[0] });
  };

  const handleVolumeChange = (value: number[]) => {
    onSettingsChange({ ...settings, volume: value[0] });
  };

  const handleVoiceChange = (voiceName: string) => {
    const voice = availableVoices.find(v => v.name === voiceName) || null;
    onSettingsChange({ ...settings, voice });
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center text-sm">
          <Settings className="h-4 w-4 mr-2" />
          Voice Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm">Voice</Label>
          <Select value={settings.voice?.name || ''} onValueChange={handleVoiceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              {availableVoices.map((voice) => (
                <SelectItem key={voice.name} value={voice.name}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Pitch: {settings.pitch.toFixed(1)}</Label>
          <Slider
            value={[settings.pitch]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={handlePitchChange}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Rate: {settings.rate.toFixed(1)}</Label>
          <Slider
            value={[settings.rate]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={handleRateChange}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Volume: {settings.volume.toFixed(1)}</Label>
          <Slider
            value={[settings.volume]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceSettingsComponent;
