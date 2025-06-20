
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import { TherapyTechniqueService, TherapyTechnique, TechniqueStep } from '@/services/therapyTechniqueService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import SessionTimer from '@/components/session/SessionTimer';
import VoiceSettings from '@/components/voice/VoiceSettings';
import { ArrowLeft, Play, Pause, SkipForward, CheckCircle, Volume2, VolumeX } from 'lucide-react';
import { voiceService } from '@/services/voiceService';
import { useToast } from '@/hooks/use-toast';

const TechniqueSession = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  
  const [technique, setTechnique] = useState<TherapyTechnique | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionStartTime] = useState(new Date());
  const [stepStartTime, setStepStartTime] = useState<Date | null>(null);
  const [stepTimeRemaining, setStepTimeRemaining] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [moodBefore, setMoodBefore] = useState<number | null>(null);
  const [moodAfter, setMoodAfter] = useState<number | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [hasSpokenInstruction, setHasSpokenInstruction] = useState(false);

  // Define currentStep after state is initialized
  const currentStep = technique?.steps[currentStepIndex];
  const progress = technique ? ((currentStepIndex + 1) / technique.steps.length) * 100 : 0;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (id) {
      const foundTechnique = TherapyTechniqueService.getTechniqueById(id);
      if (foundTechnique) {
        setTechnique(foundTechnique);
      } else {
        navigate('/techniques');
      }
    }
  }, [id, user, loading, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && stepTimeRemaining > 0) {
      interval = setInterval(() => {
        setStepTimeRemaining(prev => {
          if (prev <= 1) {
            handleNextStep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, stepTimeRemaining]);

  // Voice instruction effect
  useEffect(() => {
    if (isActive && currentStep && voiceEnabled && !hasSpokenInstruction) {
      speakInstruction(currentStep.instruction);
      setHasSpokenInstruction(true);
    }
  }, [isActive, currentStep, voiceEnabled, hasSpokenInstruction]);

  const speakInstruction = async (text: string) => {
    if (!voiceEnabled) return;
    
    try {
      await voiceService.playText(text, {
        voiceId: localStorage.getItem('therapy_voice_id') || "9BWtsMINqrJLrRacOk9x",
        stability: 0.75,
        similarityBoost: 0.85
      });
    } catch (error) {
      console.error('Error playing voice instruction:', error);
    }
  };

  const handleStart = () => {
    if (!technique) return;
    
    setIsActive(true);
    setStepStartTime(new Date());
    setHasSpokenInstruction(false);
    
    if (currentStep?.duration) {
      setStepTimeRemaining(currentStep.duration);
    } else {
      // For steps without duration, auto-advance after 5 seconds
      setTimeout(() => {
        handleNextStep();
      }, 5000);
    }
  };

  const handlePause = () => {
    setIsActive(false);
    voiceService.stop();
  };

  const handleNextStep = () => {
    if (!technique) return;

    voiceService.stop();
    setHasSpokenInstruction(false);

    if (currentStepIndex < technique.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const nextStep = technique.steps[nextIndex];
      
      if (nextStep?.duration) {
        setStepTimeRemaining(nextStep.duration);
        setStepStartTime(new Date());
      } else {
        setStepTimeRemaining(0);
        // Auto-advance steps without duration after 5 seconds
        setTimeout(() => {
          handleNextStep();
        }, 5000);
      }
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setIsActive(false);
    voiceService.stop();
    
    if (voiceEnabled) {
      speakInstruction("Great job! You've completed the technique. How are you feeling now?");
    }
  };

  const handleFinishSession = () => {
    console.log('Session completed:', {
      techniqueId: technique?.id,
      startTime: sessionStartTime,
      endTime: new Date(),
      moodBefore,
      moodAfter,
      completed: true
    });
    
    toast({
      title: "Session Complete",
      description: "Your technique session has been saved.",
    });
    
    navigate('/techniques');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  if (!user || !technique) {
    return null;
  }

  if (isCompleted) {
    return (
      <DashboardLayoutWithSidebar>
        <div className="p-6 max-w-2xl mx-auto">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">Session Complete!</CardTitle>
              <p className="text-muted-foreground">
                Great job completing the {technique.title} technique.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  How do you feel now? (1-10)
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                    <Button
                      key={rating}
                      variant={moodAfter === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMoodAfter(rating)}
                    >
                      {rating}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleFinishSession}
                className="w-full bg-therapy-600 hover:bg-therapy-700"
              >
                Finish Session
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayoutWithSidebar>
    );
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/techniques')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Techniques</span>
          </Button>
          
          <SessionTimer 
            startTime={sessionStartTime} 
            onEndSession={() => navigate('/techniques')}
            canEnd={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Session Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{technique.title}</span>
                  <span className="text-sm text-muted-foreground">
                    Step {currentStepIndex + 1} of {technique.steps.length}
                  </span>
                </CardTitle>
                <Progress value={progress} className="w-full" />
              </CardHeader>
              <CardContent className="space-y-6">
                {!isActive && currentStepIndex === 0 && !moodBefore && (
                  <div className="bg-therapy-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Before we start...</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      How are you feeling right now? (1-10)
                    </p>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                        <Button
                          key={rating}
                          variant={moodBefore === rating ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMoodBefore(rating)}
                        >
                          {rating}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep && (
                  <div className="space-y-4">
                    <div className="bg-calm-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium mb-3 text-therapy-700">
                        {currentStep.instruction}
                      </h3>
                      
                      {currentStep.duration && (
                        <div className="text-center">
                          <div className="text-3xl font-mono font-bold text-therapy-600 mb-2">
                            {formatTime(stepTimeRemaining)}
                          </div>
                          {stepTimeRemaining > 0 && (
                            <Progress 
                              value={currentStep.duration ? ((currentStep.duration - stepTimeRemaining) / currentStep.duration) * 100 : 0} 
                              className="w-full"
                            />
                          )}
                        </div>
                      )}

                      {!currentStep.duration && isActive && (
                        <div className="text-center text-sm text-muted-foreground">
                          Take your time, then continue to the next step
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center space-x-4">
                      {!isActive ? (
                        <Button
                          onClick={handleStart}
                          disabled={currentStepIndex === 0 && !moodBefore}
                          className="bg-therapy-600 hover:bg-therapy-700"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {currentStepIndex === 0 ? 'Start Session' : 'Continue'}
                        </Button>
                      ) : (
                        <Button onClick={handlePause} variant="outline">
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                      )}
                      
                      <Button
                        onClick={handleNextStep}
                        variant="outline"
                        disabled={currentStep?.duration ? stepTimeRemaining > 0 && isActive : false}
                      >
                        <SkipForward className="h-4 w-4 mr-2" />
                        {currentStepIndex === technique.steps.length - 1 ? 'Complete' : 'Next Step'}
                      </Button>

                      <Button
                        onClick={() => voiceEnabled && currentStep ? speakInstruction(currentStep.instruction) : null}
                        variant="outline"
                        disabled={!voiceEnabled}
                        className="flex items-center space-x-2"
                      >
                        {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        <span>Repeat</span>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voice Settings */}
            <VoiceSettings 
              isEnabled={voiceEnabled}
              onToggle={setVoiceEnabled}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technique Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-therapy-600 mb-2">Duration</h4>
                  <p className="text-sm text-muted-foreground">{technique.duration} minutes</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-therapy-600 mb-2">Difficulty</h4>
                  <p className="text-sm text-muted-foreground capitalize">{technique.difficulty}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-therapy-600 mb-2">Benefits</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {technique.benefits.slice(0, 3).map((benefit, index) => (
                      <li key={index}>• {benefit}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {technique.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`text-sm p-2 rounded ${
                        index === currentStepIndex
                          ? 'bg-therapy-100 text-therapy-700 font-medium'
                          : index < currentStepIndex
                          ? 'bg-green-50 text-green-700'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {index + 1}. {step.instruction.substring(0, 50)}...
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default TechniqueSession;
