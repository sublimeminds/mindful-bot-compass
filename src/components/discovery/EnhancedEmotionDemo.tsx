import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Brain, 
  Sparkles, 
  Play, 
  Pause,
  RotateCcw,
  Volume2,
  VolumeX
} from 'lucide-react';
import VoiceEnhancedAvatar from '@/components/avatar/VoiceEnhancedAvatar';
import { getAvatarIdForTherapist } from '@/services/therapistAvatarMapping';
import { supabase } from '@/integrations/supabase/client';

interface EmotionScenario {
  emotion: 'neutral' | 'happy' | 'encouraging' | 'concerned' | 'thoughtful';
  scenario: string;
  response: string;
  icon: string;
  description: string;
}

interface EnhancedEmotionDemoProps {
  therapist: {
    id: string;
    name: string;
    specialties: string[];
  };
}

const EnhancedEmotionDemo: React.FC<EnhancedEmotionDemoProps> = ({ therapist }) => {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionScenario['emotion']>('neutral');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const avatarId = getAvatarIdForTherapist(therapist.id);

  const emotionScenarios: EmotionScenario[] = [
    {
      emotion: 'concerned',
      scenario: "Client shares: 'I lost my job today and feel like a failure'",
      response: "I can hear how painful this is for you. Losing a job doesn't define your worth, and it's completely natural to feel this way right now.",
      icon: '💙',
      description: 'Deep understanding and validation of client feelings'
    },
    {
      emotion: 'encouraging',
      scenario: "Client says: 'I'm scared to try dating again after my divorce'",
      response: "Taking that first step takes real courage. The fact that you're even considering it shows how much you've grown and healed.",
      icon: '✨',
      description: 'Supportive motivation to help clients move forward'
    },
    {
      emotion: 'thoughtful',
      scenario: "Client reports: 'I'm having a panic attack and can't breathe'",
      response: "Let's breathe together slowly. You're safe here with me. In through your nose for four counts... hold... and out through your mouth.",
      icon: '🌊',
      description: 'Soothing presence during moments of distress'
    },
    {
      emotion: 'happy',
      scenario: "Client asks: 'Why do I keep making the same mistakes in relationships?'",
      response: "That's such an insightful question. Often these patterns developed as protection mechanisms. Let's explore what they might be protecting you from.",
      icon: '🤔',
      description: 'Reflective analysis to promote deeper understanding'
    },
    {
      emotion: 'neutral',
      scenario: "Beginning of session",
      response: "Welcome to our session today. I'm here to support you. What would you like to focus on in our time together?",
      icon: '🎯',
      description: 'Professional, warm baseline therapeutic presence'
    }
  ];

  const currentScenario = emotionScenarios.find(s => s.emotion === currentEmotion) || emotionScenarios[4];

  const playEmotionDemo = async (emotion: EmotionScenario['emotion']) => {
    setCurrentEmotion(emotion);
    const scenario = emotionScenarios.find(s => s.emotion === emotion);
    
    if (scenario && isVoiceEnabled) {
      setIsPlaying(true);
      try {
        const { data, error } = await supabase.functions.invoke('elevenlabs-voice-preview', {
          body: { 
            therapistId: therapist.id,
            text: scenario.response
          }
        });

        if (data?.audioContent) {
          if (audioRef) {
            audioRef.pause();
          }
          
          const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
          audio.onended = () => setIsPlaying(false);
          audio.onerror = () => setIsPlaying(false);
          setAudioRef(audio);
          await audio.play();
        }
      } catch (error) {
        console.error('Voice synthesis error:', error);
        setIsPlaying(false);
      }
    }
  };

  const stopAudio = () => {
    if (audioRef) {
      audioRef.pause();
      setIsPlaying(false);
    }
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    if (!isVoiceEnabled && audioRef) {
      audioRef.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef) {
        audioRef.pause();
      }
    };
  }, [audioRef]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Brain className="mr-2 h-5 w-5 text-therapy-600" />
          Emotional Intelligence Demo
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          See how {therapist.name} adapts their communication style to different emotional contexts
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Avatar with current emotion */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-therapy-50 to-calm-50 rounded-full overflow-hidden">
              <VoiceEnhancedAvatar
                therapistId={avatarId}
                therapistName={therapist.name}
                emotion={currentEmotion}
                isSpeaking={isPlaying}
                isListening={false}
                showControls={false}
                className="w-full h-full"
                force2D={true}
              />
            </div>
            
            <Badge 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white border-2 border-therapy-200"
              variant="outline"
            >
              {currentScenario.icon} {currentEmotion}
            </Badge>
          </div>
        </div>

        {/* Current scenario display */}
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Scenario:</h4>
            <p className="text-sm italic text-gray-600">"{currentScenario.scenario}"</p>
          </div>
          
          <div className="p-4 bg-therapy-50 rounded-lg">
            <h4 className="font-medium text-sm text-therapy-700 mb-2">
              {therapist.name}'s {currentEmotion} response:
            </h4>
            <p className="text-sm text-therapy-800">"{currentScenario.response}"</p>
          </div>
          
          <div className="text-xs text-muted-foreground p-3 bg-blue-50 rounded-lg">
            <strong>Therapeutic Purpose:</strong> {currentScenario.description}
          </div>
        </div>

        {/* Emotion selector buttons */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Try Different Emotional Contexts:</h4>
          <div className="grid grid-cols-2 gap-2">
            {emotionScenarios.map((scenario) => (
              <Button
                key={scenario.emotion}
                variant={currentEmotion === scenario.emotion ? "default" : "outline"}
                size="sm"
                onClick={() => playEmotionDemo(scenario.emotion)}
                disabled={isPlaying}
                className="justify-start text-xs h-auto p-3"
              >
                <span className="mr-2">{scenario.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{scenario.emotion}</div>
                  <div className="text-xs opacity-70 capitalize">
                    {scenario.description.split(' ').slice(0, 3).join(' ')}...
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleVoice}
              className="text-xs"
            >
              {isVoiceEnabled ? (
                <Volume2 className="h-3 w-3 mr-1" />
              ) : (
                <VolumeX className="h-3 w-3 mr-1" />
              )}
              Voice {isVoiceEnabled ? 'On' : 'Off'}
            </Button>
            
            {isPlaying && (
              <Button
                variant="outline"
                size="sm"
                onClick={stopAudio}
                className="text-xs"
              >
                <Pause className="h-3 w-3 mr-1" />
                Stop
              </Button>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentEmotion('neutral')}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedEmotionDemo;