
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, Settings, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SmartVoiceSettingsProps {
  therapistId?: string;
  onVoiceSettingsChange?: (settings: any) => void;
}

const SmartVoiceSettings: React.FC<SmartVoiceSettingsProps> = ({
  therapistId = '2fee5506-ee6d-4504-bab7-2ba922bdc99a',
  onVoiceSettingsChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [voiceSettings, setVoiceSettings] = useState({
    stability: 0.5,
    similarity_boost: 0.8,
    style: 0.2,
    use_speaker_boost: true
  });
  const { toast } = useToast();

  const handlePlayVoicePreview = async () => {
    try {
      setIsLoading(true);
      
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setIsPlaying(false);
      }

      console.log('Requesting voice preview for therapist:', therapistId);

      const { data, error } = await supabase.functions.invoke('elevenlabs-voice-preview', {
        body: {
          therapistId: therapistId
          // No custom text - will use the longer introduction from the edge function
        }
      });

      if (error) {
        console.error('Voice preview error:', error);
        throw new Error(error.message || 'Voice preview failed');
      }

      if (data?.audioContent) {
        // Convert base64 to blob URL
        const binaryString = atob(data.audioContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const blob = new Blob([bytes], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        const audio = new Audio(url);
        setCurrentAudio(audio);
        
        audio.onended = () => {
          setIsPlaying(false);
        };
        
        audio.onerror = () => {
          console.error('Audio playback error');
          setIsPlaying(false);
          toast({
            title: "Playback Error",
            description: "Failed to play voice preview",
            variant: "destructive"
          });
        };
        
        await audio.play();
        setIsPlaying(true);
        
        toast({
          title: "Voice Preview",
          description: "Playing voice sample"
        });
      } else {
        throw new Error('No audio content received');
      }
    } catch (error) {
      console.error('Voice preview error:', error);
      toast({
        title: "Voice Preview Failed",
        description: error instanceof Error ? error.message : "Unable to generate voice preview",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopVoicePreview = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const updateVoiceSettings = (key: string, value: number | boolean) => {
    const newSettings = { ...voiceSettings, [key]: value };
    setVoiceSettings(newSettings);
    onVoiceSettingsChange?.(newSettings);
  };

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [currentAudio, audioUrl]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Settings className="h-5 w-5" />
          <span>Voice Settings</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Voice Preview Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Voice Preview</Label>
            <Badge variant="outline" className="text-xs">
              AI Generated
            </Badge>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={isPlaying ? handleStopVoicePreview : handlePlayVoicePreview}
              disabled={isLoading}
              className="flex-1"
              variant={isPlaying ? "destructive" : "default"}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Generating...' : isPlaying ? 'Stop' : 'Play Preview'}
            </Button>
          </div>
        </div>

        {/* Voice Quality Settings */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Stability: {voiceSettings.stability.toFixed(1)}</Label>
            <Slider
              value={[voiceSettings.stability]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={([value]) => updateVoiceSettings('stability', value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Higher values make voice more consistent but less expressive</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Similarity: {voiceSettings.similarity_boost.toFixed(1)}</Label>
            <Slider
              value={[voiceSettings.similarity_boost]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={([value]) => updateVoiceSettings('similarity_boost', value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">How closely the AI follows the original voice</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Style: {voiceSettings.style.toFixed(1)}</Label>
            <Slider
              value={[voiceSettings.style]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={([value]) => updateVoiceSettings('style', value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Amount of stylistic variation in speech</p>
          </div>
        </div>

        {/* Voice Features */}
        <div className="flex items-center justify-between">
          <Label className="text-sm">Speaker Boost</Label>
          <Button
            variant={voiceSettings.use_speaker_boost ? "default" : "outline"}
            size="sm"
            onClick={() => updateVoiceSettings('use_speaker_boost', !voiceSettings.use_speaker_boost)}
          >
            {voiceSettings.use_speaker_boost ? 'On' : 'Off'}
          </Button>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Volume2 className="h-3 w-3" />
            <span>Powered by ElevenLabs AI</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartVoiceSettings;
