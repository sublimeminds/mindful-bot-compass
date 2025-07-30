import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, Eye, EyeOff, RefreshCw, AlertTriangle } from 'lucide-react';
import Professional2DAvatar from './Professional2DAvatar';
import { supabase } from '@/integrations/supabase/client';
import EmotionCameraDetection from './EmotionCameraDetection';

interface LightweightAvatarSystemProps {
  therapistId: string;
  therapistName: string;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
  isListening?: boolean;
  isSpeaking?: boolean;
  showControls?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onEmotionChange?: (emotion: string, confidence: number) => void;
}

interface SystemState {
  isLoading: boolean;
  isPlaying: boolean;
  error: string | null;
  emotionDetectionEnabled: boolean;
  currentAudio: HTMLAudioElement | null;
}

const LightweightAvatarSystem: React.FC<LightweightAvatarSystemProps> = ({
  therapistId,
  therapistName,
  emotion = 'neutral',
  isListening = false,
  isSpeaking = false,
  showControls = true,
  className = "w-full h-full",
  size = 'lg',
  onEmotionChange
}) => {
  const [systemState, setSystemState] = useState<SystemState>({
    isLoading: false,
    isPlaying: false,
    error: null,
    emotionDetectionEnabled: false,
    currentAudio: null
  });

  // Play voice introduction
  const playVoiceIntroduction = useCallback(async () => {
    try {
      setSystemState(prev => ({ ...prev, isLoading: true, error: null }));

      // Stop any currently playing audio
      if (systemState.currentAudio) {
        systemState.currentAudio.pause();
        systemState.currentAudio.currentTime = 0;
      }

      const { data, error } = await supabase.functions.invoke('elevenlabs-voice-preview', {
        body: { therapistId }
      });

      if (error) throw error;

      // Create and play audio
      const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
      
      audio.onplay = () => {
        setSystemState(prev => ({ 
          ...prev, 
          isPlaying: true, 
          currentAudio: audio,
          isLoading: false 
        }));
      };
      
      audio.onended = () => {
        setSystemState(prev => ({ 
          ...prev, 
          isPlaying: false, 
          currentAudio: null 
        }));
      };
      
      audio.onerror = () => {
        setSystemState(prev => ({ 
          ...prev, 
          error: 'Failed to play audio',
          isPlaying: false,
          isLoading: false,
          currentAudio: null
        }));
      };

      await audio.play();

    } catch (error) {
      console.error('Voice preview error:', error);
      setSystemState(prev => ({ 
        ...prev, 
        error: 'Failed to generate voice preview',
        isLoading: false,
        isPlaying: false
      }));
    }
  }, [therapistId, systemState.currentAudio]);

  const stopVoiceIntroduction = useCallback(() => {
    if (systemState.currentAudio) {
      systemState.currentAudio.pause();
      systemState.currentAudio.currentTime = 0;
      setSystemState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        currentAudio: null 
      }));
    }
  }, [systemState.currentAudio]);

  const toggleEmotionDetection = useCallback(() => {
    setSystemState(prev => ({
      ...prev,
      emotionDetectionEnabled: !prev.emotionDetectionEnabled
    }));
  }, []);

  const handleEmotionDetected = useCallback((emotionData: any) => {
    if (onEmotionChange) {
      onEmotionChange(emotionData.emotion, emotionData.confidence);
    }
  }, [onEmotionChange]);

  // Determine avatar emotion based on state
  const getAvatarEmotion = (): 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful' => {
    if (systemState.isPlaying) return 'happy';
    if (systemState.error) return 'concerned';
    if (isListening) return 'encouraging';
    if (isSpeaking) return 'happy';
    return emotion;
  };

  return (
    <div className={className}>
      <div className="relative w-full h-full">
        {/* Main Avatar Display */}
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden">
          <Professional2DAvatar
            therapistId={therapistId}
            therapistName={therapistName}
            className="flex-1 w-full h-full"
            showName={false}
            size={size}
            emotion={getAvatarEmotion()}
            isListening={isListening || systemState.emotionDetectionEnabled}
            isSpeaking={isSpeaking || systemState.isPlaying}
          />
        </div>

        {/* Control Panel */}
        {showControls && (
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {/* Voice Preview Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={systemState.isPlaying ? stopVoiceIntroduction : playVoiceIntroduction}
              disabled={systemState.isLoading}
              className="flex items-center space-x-2 bg-white shadow-lg border"
            >
              {systemState.isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
              <span className="text-xs">
                {systemState.isLoading ? 'Loading...' : 
                 systemState.isPlaying ? 'Stop' : 'Hear Voice'}
              </span>
            </Button>

            {/* Emotion Detection Toggle */}
            <Button
              variant={systemState.emotionDetectionEnabled ? "default" : "outline"}
              size="sm"
              onClick={toggleEmotionDetection}
              className="flex items-center space-x-2 bg-white shadow-lg border"
            >
              {systemState.emotionDetectionEnabled ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
              <span className="text-xs">
                {systemState.emotionDetectionEnabled ? 'Emotion ON' : 'Emotion OFF'}
              </span>
            </Button>
          </div>
        )}

        {/* Status Indicators */}
        <div className="absolute bottom-4 left-4 flex space-x-2">
          {isListening && (
            <Badge variant="secondary" className="bg-blue-500/80 text-white">
              Listening
            </Badge>
          )}
          {(isSpeaking || systemState.isPlaying) && (
            <Badge variant="secondary" className="bg-green-500/80 text-white">
              Speaking
            </Badge>
          )}
          {systemState.emotionDetectionEnabled && (
            <Badge variant="secondary" className="bg-purple-500/80 text-white">
              Emotion Detection
            </Badge>
          )}
        </div>

        {/* Emotion Detection Camera (when enabled) */}
        {systemState.emotionDetectionEnabled && (
          <div className="absolute top-4 right-4 w-48 h-36">
            <EmotionCameraDetection
              onEmotionDetected={handleEmotionDetected}
              isActive={systemState.emotionDetectionEnabled}
            />
          </div>
        )}

        {/* Error Display */}
        {systemState.error && (
          <div className="absolute bottom-16 left-4">
            <Badge variant="destructive" className="bg-red-500/80 text-white">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {systemState.error}
            </Badge>
          </div>
        )}

        {/* Therapist Info Overlay */}
        <div className="absolute bottom-4 right-4">
          <div className="text-right">
            <p className="text-sm font-medium text-therapy-700">{therapistName}</p>
            <p className="text-xs text-muted-foreground">AI Therapist</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightweightAvatarSystem;