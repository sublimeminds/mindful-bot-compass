
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipForward, RotateCcw, Star, Clock, Heart, Brain, Wind, Anchor, Waves, PenTool, ArrowLeft, CheckCircle, Target } from "lucide-react";
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
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
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

  const getCategoryIcon = (category: string) => {
    const icons = {
      breathing: Wind,
      mindfulness: Brain,
      cbt: Heart,
      grounding: Anchor,
      relaxation: Waves,
      journaling: PenTool
    };
    return icons[category as keyof typeof icons] || Brain;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStart = () => {
    setHasStarted(true);
    setSessionStartTime(new Date());
    startCurrentStep();
    toast({
      title: "Session Started! 🎯",
      description: `Beginning your ${technique?.title} practice session.`,
    });
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
        title: "Step Complete ✓",
        description: "Moving to next step...",
      });
    } else {
      setShowCompletion(true);
      toast({
        title: "Technique Complete! 🎉",
        description: "Excellent work completing this exercise.",
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
      const step = technique?.steps[currentStep - 1];
      if (step?.duration) {
        setTimeRemaining(step.duration);
      }
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsActive(false);
    setTimeRemaining(0);
    setShowCompletion(false);
    setHasStarted(false);
    setSessionStartTime(null);
    toast({
      title: "Session Reset",
      description: "Ready to start fresh!",
    });
  };

  const handleFinish = () => {
    onComplete(rating[0], notes, moodBefore[0], moodAfter[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionDuration = () => {
    if (!sessionStartTime) return '';
    const duration = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60);
    return `${duration} minute${duration !== 1 ? 's' : ''}`;
  };

  if (!technique) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Technique not found</h3>
          <p className="text-muted-foreground mb-4">
            The requested technique could not be loaded.
          </p>
          <Button onClick={onExit} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showCompletion) {
    const IconComponent = getCategoryIcon(technique.category);
    
    return (
      <Card className="max-w-2xl mx-auto border-l-4 border-l-green-500">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-700">Session Complete! 🎉</CardTitle>
          <p className="text-muted-foreground">
            Congratulations on completing your <strong>{technique.title}</strong> session
            {sessionStartTime && ` in ${getSessionDuration()}`}!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">What you accomplished:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Completed {technique.steps.length} guided steps</li>
              <li>• Practiced {technique.category} techniques</li>
              <li>• Invested {technique.duration} minutes in your wellbeing</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <Label>How is your mood now? (1-10)</Label>
              <Slider
                value={moodAfter}
                onValueChange={setMoodAfter}
                max={10}
                min={1}
                step={1}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low</span>
                <span className="font-semibold">{moodAfter[0]}/10</span>
                <span>High</span>
              </div>
              {moodAfter[0] > moodBefore[0] && (
                <p className="text-sm text-green-600 mt-1">
                  Great! Your mood improved by {moodAfter[0] - moodBefore[0]} points! 📈
                </p>
              )}
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
                    className={rating[0] >= num ? "bg-therapy-600 hover:bg-therapy-700" : ""}
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
                placeholder="How did this technique work for you? Any insights, feelings, or observations you'd like to note..."
                rows={3}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleFinish} className="flex-1 bg-therapy-600 hover:bg-therapy-700">
              <Target className="h-4 w-4 mr-2" />
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

  if (!hasStarted) {
    const IconComponent = getCategoryIcon(technique.category);
    
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-l-4 border-l-therapy-500">
          <CardHeader>
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 rounded-lg bg-therapy-100 flex items-center justify-center">
                <IconComponent className="h-6 w-6 text-therapy-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl text-therapy-700">{technique.title}</CardTitle>
                <p className="text-muted-foreground text-lg mt-1">{technique.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <Badge className={getDifficultyColor(technique.difficulty)} variant="outline">
                {technique.difficulty}
              </Badge>
              <Badge variant="outline" className="bg-therapy-50 text-therapy-700 border-therapy-200">
                <Clock className="h-3 w-3 mr-1" />
                {technique.duration} minutes
              </Badge>
              <Badge variant="outline" className="bg-calm-50 text-calm-700 border-calm-200">
                {technique.category}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-therapy-600">Key Benefits:</h4>
                <ul className="space-y-1">
                  {technique.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-therapy-600">Best for:</h4>
                <ul className="space-y-1">
                  {technique.whenToUse.map((situation, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center">
                      <Target className="h-3 w-3 text-therapy-500 mr-2 flex-shrink-0" />
                      {situation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-therapy-50 p-4 rounded-lg border border-therapy-200">
              <h4 className="font-medium text-therapy-700 mb-2">What to expect:</h4>
              <p className="text-sm text-therapy-600">
                This guided session will take you through {technique.steps.length} steps over approximately {technique.duration} minutes. 
                Each step includes clear instructions and, where applicable, timed breathing or meditation exercises.
              </p>
            </div>

            <div>
              <Label>How is your mood right now? (1-10)</Label>
              <Slider
                value={moodBefore}
                onValueChange={setMoodBefore}
                max={10}
                min={1}
                step={1}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Very Low</span>
                <span className="font-semibold">{moodBefore[0]}/10</span>
                <span>Very High</span>
              </div>
            </div>
            
            <Button onClick={handleStart} className="w-full bg-therapy-600 hover:bg-therapy-700 text-white py-3">
              <Play className="h-5 w-5 mr-2" />
              Begin Practice Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStepData = technique.steps[currentStep];
  const progress = ((currentStep + 1) / technique.steps.length) * 100;
  const IconComponent = getCategoryIcon(technique.category);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <IconComponent className="h-6 w-6 text-therapy-600" />
          <h2 className="text-2xl font-semibold text-therapy-700">{technique.title}</h2>
        </div>
        <Progress value={progress} className="w-full h-2" />
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Step {currentStep + 1} of {technique.steps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      <Card className="border-l-4 border-l-therapy-500">
        <CardContent className="text-center py-8 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-therapy-700">{currentStepData.instruction}</h3>
            
            {currentStepData.duration && (
              <div className="space-y-4">
                <div className="text-5xl font-mono font-bold text-therapy-600">
                  {formatTime(timeRemaining)}
                </div>
                {timeRemaining > 0 && (
                  <Progress 
                    value={((currentStepData.duration - timeRemaining) / currentStepData.duration) * 100} 
                    className="w-full h-3"
                  />
                )}
                <p className="text-sm text-muted-foreground">
                  {isActive ? 'In progress...' : 'Ready to begin'}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentStep === 0}
              className="min-w-[100px]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentStepData.duration ? (
              <Button
                onClick={() => setIsActive(!isActive)}
                disabled={timeRemaining === 0}
                className="min-w-[100px] bg-therapy-600 hover:bg-therapy-700"
              >
                {isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isActive ? 'Pause' : 'Start'}
              </Button>
            ) : (
              <Button onClick={handleNext} className="min-w-[100px] bg-therapy-600 hover:bg-therapy-700">
                Next
                <SkipForward className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {currentStepData.type === 'breathing' && (
            <div className="bg-calm-50 p-4 rounded-lg border border-calm-200 mt-6">
              <p className="text-sm text-calm-700">
                💨 <strong>Breathing Tip:</strong> Focus on slow, controlled breaths. 
                If you feel lightheaded, pause and breathe normally.
              </p>
            </div>
          )}

          {currentStepData.type === 'visualization' && (
            <div className="bg-therapy-50 p-4 rounded-lg border border-therapy-200 mt-6">
              <p className="text-sm text-therapy-700">
                🧘 <strong>Visualization Tip:</strong> Let your imagination guide you. 
                There's no wrong way to visualize - trust your mind's eye.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={onExit} variant="outline" className="min-w-[120px]">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Exit Session
        </Button>
      </div>
    </div>
  );
};

export default GuidedTechnique;
