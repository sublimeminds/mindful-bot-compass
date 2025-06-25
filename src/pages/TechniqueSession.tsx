import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Clock, CheckCircle, ArrowLeft, Play, Pause } from 'lucide-react';

interface TechniqueSessionProps {
  id: string;
  name: string;
  description: string;
  duration: number;
  steps: string[];
}

const TechniqueSession = () => {
  const { user } = useAuth();
  const { techniqueId } = useParams<{ techniqueId: string }>();
  const navigate = useNavigate();
  const [technique, setTechnique] = useState<TechniqueSessionProps | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (techniqueId) {
      loadTechnique(techniqueId);
    }
  }, [techniqueId]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive]);

  const loadTechnique = async (id: string) => {
    try {
      // Use existing goals table as a mock for techniques
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Transform goal data to technique format
      const mockTechnique: TechniqueSessionProps = {
        id: data.id,
        name: data.title,
        description: data.description || 'Practice this therapeutic technique',
        duration: 10, // Mock duration in minutes
        steps: [
          'Begin by finding a comfortable position',
          'Focus on your breathing',
          'Apply the technique mindfully',
          'Reflect on your experience'
        ]
      };
      
      setTechnique(mockTechnique);
    } catch (error) {
      console.error('Error loading technique:', error);
      // Set a default technique if loading fails
      setTechnique({
        id: id,
        name: 'Mindfulness Technique',
        description: 'A simple mindfulness practice to help you center yourself.',
        duration: 10,
        steps: [
          'Find a quiet, comfortable place to sit',
          'Close your eyes and focus on your breath',
          'Notice thoughts without judgment',
          'Return focus to breathing when mind wanders',
          'Complete the session with intention'
        ]
      });
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimer(0);
  };

  const goToNextStep = () => {
    if (technique && currentStep < technique.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      resetTimer();
      alert('Technique completed!');
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!technique) {
    return <p>Loading technique...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={() => navigate('/techniques')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Techniques
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{technique.name}</span>
            <Badge variant="secondary">
              <Clock className="h-4 w-4 mr-2" />
              {formatTime(timer)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{technique.description}</p>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Step {currentStep + 1}:</h3>
            <p>{technique.steps[currentStep]}</p>
          </div>
          <div className="flex justify-between">
            <Button onClick={toggleTimer}>
              {isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button variant="secondary" onClick={goToNextStep}>
              {currentStep === technique.steps.length - 1 ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </>
              ) : (
                'Next Step'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechniqueSession;
