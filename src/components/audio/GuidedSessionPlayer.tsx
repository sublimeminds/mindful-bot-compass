
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  SkipBack,
  Volume2,
  Timer,
  Brain,
  Heart,
  Moon,
  Wind
} from 'lucide-react';
import { enhancedVoiceService } from '@/services/voiceService';
import { useTherapist } from '@/contexts/TherapistContext';

interface GuidedSessionPlayerProps {
  className?: string;
}

type SessionType = 'meditation' | 'breathing' | 'relaxation' | 'sleep';

const GuidedSessionPlayer = ({ className = '' }: GuidedSessionPlayerProps) => {
  const { selectedTherapist } = useTherapist();
  const [sessionType, setSessionType] = useState<SessionType>('meditation');
  const [duration, setDuration] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sessionSteps, setSessionSteps] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const sessionTypes = [
    { 
      value: 'meditation', 
      label: 'Mindfulness Meditation', 
      icon: Brain,
      description: 'Guided mindfulness practice'
    },
    { 
      value: 'breathing', 
      label: 'Breathing Exercise', 
      icon: Wind,
      description: '4-7-8 breathing technique'
    },
    { 
      value: 'relaxation', 
      label: 'Progressive Relaxation', 
      icon: Heart,
      description: 'Full body muscle relaxation'
    },
    { 
      value: 'sleep', 
      label: 'Sleep Preparation', 
      icon: Moon,
      description: 'Wind down for better sleep'
    }
  ];

  const durations = [5, 10, 15, 20, 30, 45, 60];

  useEffect(() => {
    loadSession();
  }, [sessionType, duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          setProgress(((duration * 60 - newTime) / (duration * 60)) * 100);
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, duration]);

  const loadSession = async () => {
    try {
      const steps = await enhancedVoiceService.generateGuidedSession(
        sessionType,
        duration,
        selectedTherapist?.id
      );
      setSessionSteps(steps);
      setTimeRemaining(duration * 60);
      setProgress(0);
      setCurrentStep(0);
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  const startSession = async () => {
    if (sessionSteps.length === 0) return;
    
    setIsPlaying(true);
    await playCurrentStep();
  };

  const playCurrentStep = async () => {
    if (currentStep >= sessionSteps.length) {
      endSession();
      return;
    }

    try {
      await enhancedVoiceService.playTherapistMessage(
        sessionSteps[currentStep],
        selectedTherapist?.id || 'dr-sarah-chen'
      );
      
      // Auto-advance to next step after a pause
      setTimeout(() => {
        if (isPlaying) {
          setCurrentStep(prev => prev + 1);
        }
      }, 3000);
    } catch (error) {
      console.error('Error playing step:', error);
    }
  };

  const pauseSession = () => {
    setIsPlaying(false);
    enhancedVoiceService.stop();
  };

  const endSession = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setProgress(0);
    setTimeRemaining(duration * 60);
    enhancedVoiceService.stop();
  };

  const nextStep = () => {
    if (currentStep < sessionSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      if (isPlaying) {
        playCurrentStep();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      if (isPlaying) {
        playCurrentStep();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedSessionType = sessionTypes.find(type => type.value === sessionType);
  const SessionIcon = selectedSessionType?.icon || Brain;

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <SessionIcon className="h-5 w-5 text-therapy-500" />
          <span>Guided Sessions</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Session Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Session Type</label>
          <Select value={sessionType} onValueChange={(value) => setSessionType(value as SessionType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sessionTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Duration Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Duration</label>
          <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {durations.map((dur) => (
                <SelectItem key={dur} value={dur.toString()}>
                  {dur} minutes
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Therapist Voice */}
        {selectedTherapist && (
          <div className="flex items-center justify-between p-3 bg-therapy-50 rounded-lg">
            <div>
              <div className="text-sm font-medium">Voice Guide</div>
              <div className="text-xs text-muted-foreground">{selectedTherapist.name}</div>
            </div>
            <Badge variant="secondary">
              <Volume2 className="h-3 w-3 mr-1" />
              {enhancedVoiceService.getTherapistVoice(selectedTherapist.id)?.voiceName || 'Default'}
            </Badge>
          </div>
        )}

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="flex items-center">
              <Timer className="h-3 w-3 mr-1" />
              {formatTime(timeRemaining)}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground text-center">
            Step {currentStep + 1} of {sessionSteps.length}
          </div>
        </div>

        {/* Current Step Display */}
        {sessionSteps.length > 0 && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium mb-1">Current Step:</div>
            <div className="text-sm text-gray-700">
              {sessionSteps[currentStep] || "Session ready to begin"}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevStep}
            disabled={currentStep === 0 || sessionSteps.length === 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          {!isPlaying ? (
            <Button onClick={startSession} disabled={sessionSteps.length === 0}>
              <Play className="h-4 w-4 mr-2" />
              {currentStep === 0 ? 'Start' : 'Resume'}
            </Button>
          ) : (
            <Button onClick={pauseSession} variant="secondary">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={nextStep}
            disabled={currentStep >= sessionSteps.length - 1 || sessionSteps.length === 0}
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={endSession}>
            <Square className="h-4 w-4" />
          </Button>
        </div>

        {/* Session Info */}
        <div className="text-xs text-center text-muted-foreground">
          Powered by ElevenLabs AI Voice Technology
        </div>
      </CardContent>
    </Card>
  );
};

export default GuidedSessionPlayer;
