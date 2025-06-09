
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Play, Pause, SkipForward, RotateCcw, Star } from "lucide-react";
import { TherapyTechniqueService, TherapyTechnique, TechniqueStep } from "@/services/therapyTechniqueService";
import { useToast } from "@/hooks/use-toast";

interface GuidedTechniqueProps {
  techniqueId: string;
  onComplete: (rating: number, notes: string, moodBefore: number, moodAfter: number) => void;
  onExit: () => void;
}

const GuidedTechnique = ({ techniqueId, onComplete, onExit }: GuidedTechniqueProps) => {
  const [technique, setTechnique] = useState<TherapyTechnique | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [moodBefore, setMoodBefore] = useState([5]);
  const [moodAfter, setMoodAfter] = useState([5]);
  const [rating, setRating] = useState([3]);
  const [notes, setNotes] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const foundTechnique = TherapyTechniqueService.getTechniqueById(techniqueId);
    setTechnique(foundTechnique || null);
  }, [techniqueId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            handleStepComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const handleStart = () => {
    setHasStarted(true);
    startCurrentStep();
  };

  const startCurrentStep = () => {
    if (!technique) return;
    
    const step = technique.steps[currentStep];
    if (step.duration) {
      setTimeRemaining(step.duration);
      setIsActive(true);
    }
  };

  const handleStepComplete = () => {
    if (!technique) return;
    
    if (currentStep < technique.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      toast({
        title: "Step Complete",
        description: "Moving to next step...",
      });
    } else {
      setShowCompletion(true);
      toast({
        title: "Technique Complete!",
        description: "Great job completing this exercise.",
      });
    }
  };

  const handleNext = () => {
    setIsActive(false);
    handleStepComplete();
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsActive(false);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsActive(false);
    setTimeRemaining(0);
    setShowCompletion(false);
  };

  const handleFinish = () => {
    onComplete(rating[0], notes, moodBefore[0], moodAfter[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!technique) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p>Technique not found</p>
          <Button onClick={onExit} className="mt-4">
            Back to Library
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showCompletion) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Session Complete! 🎉</CardTitle>
          <p className="text-muted-foreground">
            How was your experience with {technique.title}?
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>How is your mood now? (1-10)</Label>
              <Slider
                value={moodAfter}
                onValueChange={setMoodAfter}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low</span>
                <span className="font-semibold">{moodAfter[0]}/10</span>
                <span>High</span>
              </div>
            </div>

            <div>
              <Label>How helpful was this technique? (1-5)</Label>
              <div className="flex space-x-2 mt-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <Button
                    key={num}
                    variant={rating[0] >= num ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRating([num])}
                  >
                    <Star className={`h-4 w-4 ${rating[0] >= num ? 'fill-current' : ''}`} />
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Any thoughts or insights?</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did this technique work for you? Any insights or feelings you'd like to note..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleFinish} className="flex-1">
              Complete Session
            </Button>
            <Button onClick={handleRestart} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentStepData = technique.steps[currentStep];
  const progress = ((currentStep + 1) / technique.steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {!hasStarted && (
        <Card>
          <CardHeader>
            <CardTitle>{technique.title}</CardTitle>
            <p className="text-muted-foreground">{technique.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>How is your mood right now? (1-10)</Label>
              <Slider
                value={moodBefore}
                onValueChange={setMoodBefore}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low</span>
                <span className="font-semibold">{moodBefore[0]}/10</span>
                <span>High</span>
              </div>
            </div>
            
            <Button onClick={handleStart} className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Begin Technique
            </Button>
          </CardContent>
        </Card>
      )}

      {hasStarted && (
        <>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">{technique.title}</h2>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep + 1} of {technique.steps.length}
            </p>
          </div>

          <Card>
            <CardContent className="text-center py-8 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{currentStepData.instruction}</h3>
                
                {currentStepData.duration && (
                  <div className="space-y-4">
                    <div className="text-4xl font-mono font-bold text-primary">
                      {formatTime(timeRemaining)}
                    </div>
                    {timeRemaining > 0 && (
                      <Progress 
                        value={((currentStepData.duration - timeRemaining) / currentStepData.duration) * 100} 
                        className="w-full"
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                
                {currentStepData.duration ? (
                  <Button
                    onClick={() => setIsActive(!isActive)}
                    disabled={timeRemaining === 0}
                  >
                    {isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isActive ? 'Pause' : 'Start'}
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    <SkipForward className="h-4 w-4 mr-2" />
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <div className="text-center">
        <Button onClick={onExit} variant="outline">
          Exit Technique
        </Button>
      </div>
    </div>
  );
};

export default GuidedTechnique;
