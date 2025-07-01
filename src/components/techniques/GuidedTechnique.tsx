
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { enhancedVoiceService } from '@/services/voiceService';
import { audioContentService } from '@/services/audioContentService';

interface GuidedTechniqueProps {
  techniqueId: string;
  onComplete?: () => void;
}

const GuidedTechnique = ({ techniqueId, onComplete }: GuidedTechniqueProps) => {
  const [technique, setTechnique] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const loadTechnique = async () => {
      const data = await audioContentService.getTechniqueById(techniqueId);
      setTechnique(data);
      if (data) {
        setTimeRemaining(data.duration);
      }
    };
    loadTechnique();
  }, [techniqueId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (technique) {
            const progressPercent = ((technique.duration - newTime) / technique.duration) * 100;
            setProgress(progressPercent);
            
            // Auto-advance steps
            const stepDuration = technique.duration / technique.instructions.length;
            const newStep = Math.floor((technique.duration - newTime) / stepDuration);
            if (newStep !== currentStep && newStep < technique.instructions.length) {
              setCurrentStep(newStep);
              if (voiceEnabled) {
                enhancedVoiceService.playText(technique.instructions[newStep]);
              }
            }
          }
          
          if (newTime <= 0) {
            setIsPlaying(false);
            onComplete?.();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, technique, currentStep, voiceEnabled, onComplete]);

  const togglePlayback = async () => {
    if (!technique) return;
    
    if (isPlaying) {
      setIsPlaying(false);
      enhancedVoiceService.stop();
    } else {
      setIsPlaying(true);
      if (voiceEnabled && technique.audioScript) {
        await enhancedVoiceService.playText(technique.audioScript);
      }
    }
  };

  const resetTechnique = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setProgress(0);
    setTimeRemaining(technique?.duration || 0);
    enhancedVoiceService.stop();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!technique) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading technique...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{technique.name}</CardTitle>
          <Badge variant="outline">{technique.category}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{technique.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{formatTime(timeRemaining)} remaining</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Step */}
        <div className="bg-therapy-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-therapy-800">
              Step {currentStep + 1} of {technique.instructions.length}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
            >
              {voiceEnabled ? (
                <Volume2 className="h-4 w-4 text-green-600" />
              ) : (
                <VolumeX className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
          <p className="text-therapy-700">
            {technique.instructions[currentStep] || 'Prepare to begin...'}
          </p>
        </div>

        {/* All Instructions */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">All Steps:</h4>
          <div className="space-y-2">
            {technique.instructions.map((instruction: string, index: number) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-sm transition-colors ${
                  index === currentStep
                    ? 'bg-therapy-100 border-l-4 border-therapy-500'
                    : index < currentStep
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-50 text-gray-600'
                }`}
              >
                <span className="font-medium mr-2">{index + 1}.</span>
                {instruction}
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={resetTechnique}
            disabled={progress === 0}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          
          <Button
            onClick={togglePlayback}
            size="lg"
            className="rounded-full w-16 h-16 therapy-gradient-bg text-white"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {formatTime(technique.duration)} total
          </div>
        </div>

        {/* Status */}
        {isPlaying && (
          <div className="text-center">
            <Badge className="bg-green-100 text-green-800">
              Session in progress...
            </Badge>
          </div>
        )}
        
        {progress === 100 && (
          <div className="text-center">
            <Badge className="bg-therapy-100 text-therapy-800">
              Technique completed! 🎉
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GuidedTechnique;
