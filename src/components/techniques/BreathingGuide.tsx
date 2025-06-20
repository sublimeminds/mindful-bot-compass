
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface BreathingGuideProps {
  isActive: boolean;
  phase: 'inhale' | 'hold' | 'exhale' | 'pause';
  duration: number;
  instruction: string;
}

const BreathingGuide = ({ isActive, phase, duration, instruction }: BreathingGuideProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + (100 / duration);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, duration, phase]);

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'border-blue-500 bg-blue-50';
      case 'hold': return 'border-yellow-500 bg-yellow-50';
      case 'exhale': return 'border-green-500 bg-green-50';
      case 'pause': return 'border-gray-500 bg-gray-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getCircleScale = () => {
    if (!isActive) return 'scale-100';
    
    switch (phase) {
      case 'inhale': return 'scale-125';
      case 'exhale': return 'scale-75';
      default: return 'scale-100';
    }
  };

  return (
    <Card className={`transition-all duration-1000 ${getPhaseColor()}`}>
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div 
            className={`mx-auto w-32 h-32 rounded-full border-4 transition-all duration-4000 ease-in-out ${getPhaseColor()} ${getCircleScale()}`}
            style={{
              background: `conic-gradient(from 0deg, currentColor ${progress}%, transparent ${progress}%)`
            }}
          >
            <div className="w-full h-full rounded-full bg-white/80 flex items-center justify-center">
              <div className="text-2xl font-semibold text-therapy-700 capitalize">
                {phase}
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-lg font-medium text-therapy-700 mb-2">
          {instruction}
        </p>
        
        <div className="text-sm text-muted-foreground">
          {isActive ? `${Math.ceil(duration - (progress * duration / 100))}s remaining` : 'Ready to begin'}
        </div>
      </CardContent>
    </Card>
  );
};

export default BreathingGuide;
