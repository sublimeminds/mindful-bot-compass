import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Brain, Moon, Zap, Target, BookOpen } from 'lucide-react';

interface SessionAssessmentProps {
  type: 'pre_session' | 'post_session';
  sessionId?: string;
  onComplete?: (assessment: any) => void;
  onSkip?: () => void;
}

const SessionAssessment = ({ type, sessionId, onComplete, onSkip }: SessionAssessmentProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pre-session state
  const [currentMood, setCurrentMood] = useState([5]);
  const [energyLevel, setEnergyLevel] = useState([5]);
  const [stressLevel, setStressLevel] = useState([5]);
  const [sleepQuality, setSleepQuality] = useState([5]);
  const [mainConcerns, setMainConcerns] = useState<string[]>([]);
  const [sessionGoals, setSessionGoals] = useState<string[]>([]);
  const [currentSymptoms, setCurrentSymptoms] = useState<string[]>([]);
  const [medicationChanges, setMedicationChanges] = useState(false);
  const [lifeEvents, setLifeEvents] = useState('');
  
  // Post-session state
  const [sessionHelpfulness, setSessionHelpfulness] = useState([5]);
  const [therapistConnection, setTherapistConnection] = useState([5]);
  const [techniquesLearned, setTechniquesLearned] = useState<string[]>([]);
  const [homeworkAssigned, setHomeworkAssigned] = useState<string[]>([]);
  const [nextSessionGoals, setNextSessionGoals] = useState<string[]>([]);
  const [overallSatisfaction, setOverallSatisfaction] = useState([5]);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  
  // Common state
  const [emotionalState, setEmotionalState] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState([5]);
  const [breakthroughMoments, setBreakthroughMoments] = useState('');
  const [challengesDiscussed, setChallengesDiscussed] = useState<string[]>([]);

  const concernOptions = [
    'Anxiety', 'Depression', 'Stress', 'Relationships', 'Work Issues', 
    'Sleep Problems', 'Self-Esteem', 'Trauma', 'Grief', 'Anger Management'
  ];

  const symptomOptions = [
    'Panic Attacks', 'Racing Thoughts', 'Fatigue', 'Insomnia', 
    'Difficulty Concentrating', 'Mood Swings', 'Withdrawal', 'Irritability'
  ];

  const techniqueOptions = [
    'Deep Breathing', 'Progressive Muscle Relaxation', 'Mindfulness', 
    'Cognitive Restructuring', 'Grounding Techniques', 'Journaling'
  ];

  const handleArrayToggle = (item: string, array: string[], setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const assessmentData = {
        user_id: user.id,
        session_id: sessionId,
        assessment_type: type,
        
        // Pre-session data
        ...(type === 'pre_session' && {
          current_mood: currentMood[0],
          energy_level: energyLevel[0],
          stress_level: stressLevel[0],
          sleep_quality: sleepQuality[0],
          main_concerns: mainConcerns,
          session_goals: sessionGoals,
          current_symptoms: currentSymptoms,
          medication_changes: medicationChanges,
          life_events: lifeEvents || null,
        }),
        
        // Post-session data
        ...(type === 'post_session' && {
          session_helpfulness: sessionHelpfulness[0],
          therapist_connection: therapistConnection[0],
          techniques_learned: techniquesLearned,
          homework_assigned: homeworkAssigned,
          next_session_goals: nextSessionGoals,
          overall_satisfaction: overallSatisfaction[0],
          would_recommend: wouldRecommend,
          additional_feedback: additionalFeedback || null,
        }),
        
        // Common data
        emotional_state: emotionalState || null,
        confidence_level: confidenceLevel[0],
        breakthrough_moments: breakthroughMoments || null,
        challenges_discussed: challengesDiscussed,
        
        responses: {
          type,
          timestamp: new Date().toISOString(),
          ...(type === 'pre_session' ? {
            mood: currentMood[0],
            energy: energyLevel[0],
            stress: stressLevel[0],
            sleep: sleepQuality[0]
          } : {
            helpfulness: sessionHelpfulness[0],
            connection: therapistConnection[0],
            satisfaction: overallSatisfaction[0]
          })
        }
      };

      const { data, error } = await supabase
        .from('session_assessments')
        .insert(assessmentData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Assessment completed",
        description: `Your ${type === 'pre_session' ? 'pre-session' : 'post-session'} assessment has been saved.`,
      });

      onComplete?.(data);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPreSessionQuestions = () => (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-therapy-500" />
              <Label>Current Mood (1-10)</Label>
            </div>
            <Slider
              value={currentMood}
              onValueChange={setCurrentMood}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-center text-sm text-muted-foreground">
              {currentMood[0]}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-therapy-500" />
              <Label>Energy Level (1-10)</Label>
            </div>
            <Slider
              value={energyLevel}
              onValueChange={setEnergyLevel}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-center text-sm text-muted-foreground">
              {energyLevel[0]}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-therapy-500" />
              <Label>Stress Level (1-10)</Label>
            </div>
            <Slider
              value={stressLevel}
              onValueChange={setStressLevel}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-center text-sm text-muted-foreground">
              {stressLevel[0]}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Moon className="h-5 w-5 text-therapy-500" />
              <Label>Sleep Quality (1-10)</Label>
            </div>
            <Slider
              value={sleepQuality}
              onValueChange={setSleepQuality}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-center text-sm text-muted-foreground">
              {sleepQuality[0]}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Main concerns for today's session</Label>
          <div className="flex flex-wrap gap-2">
            {concernOptions.map((concern) => (
              <Badge
                key={concern}
                variant={mainConcerns.includes(concern) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleArrayToggle(concern, mainConcerns, setMainConcerns)}
              >
                {concern}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Current symptoms you're experiencing</Label>
          <div className="flex flex-wrap gap-2">
            {symptomOptions.map((symptom) => (
              <Badge
                key={symptom}
                variant={currentSymptoms.includes(symptom) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleArrayToggle(symptom, currentSymptoms, setCurrentSymptoms)}
              >
                {symptom}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Recent life events or changes</Label>
          <Textarea
            value={lifeEvents}
            onChange={(e) => setLifeEvents(e.target.value)}
            placeholder="Any significant events, changes, or situations you'd like to discuss..."
            className="min-h-20"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="medication-changes"
            checked={medicationChanges}
            onCheckedChange={(checked) => setMedicationChanges(checked as boolean)}
          />
          <Label htmlFor="medication-changes">
            I've had medication changes since my last session
          </Label>
        </div>
      </div>
    </>
  );

  const renderPostSessionQuestions = () => (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label>How helpful was this session? (1-10)</Label>
            <Slider
              value={sessionHelpfulness}
              onValueChange={setSessionHelpfulness}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-center text-sm text-muted-foreground">
              {sessionHelpfulness[0]}
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Connection with therapist (1-10)</Label>
            <Slider
              value={therapistConnection}
              onValueChange={setTherapistConnection}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-center text-sm text-muted-foreground">
              {therapistConnection[0]}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Techniques learned or practiced</Label>
          <div className="flex flex-wrap gap-2">
            {techniqueOptions.map((technique) => (
              <Badge
                key={technique}
                variant={techniquesLearned.includes(technique) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleArrayToggle(technique, techniquesLearned, setTechniquesLearned)}
              >
                {technique}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Overall satisfaction (1-10)</Label>
          <Slider
            value={overallSatisfaction}
            onValueChange={setOverallSatisfaction}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="text-center text-sm text-muted-foreground">
            {overallSatisfaction[0]}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Would you recommend this therapist?</Label>
          <RadioGroup 
            value={wouldRecommend?.toString()} 
            onValueChange={(value) => setWouldRecommend(value === 'true')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="recommend-yes" />
              <Label htmlFor="recommend-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="recommend-no" />
              <Label htmlFor="recommend-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Additional feedback</Label>
          <Textarea
            value={additionalFeedback}
            onChange={(e) => setAdditionalFeedback(e.target.value)}
            placeholder="Any additional thoughts or feedback about this session..."
            className="min-h-20"
          />
        </div>
      </div>
    </>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-6 w-6 text-therapy-500" />
          <span>
            {type === 'pre_session' ? 'Pre-Session Check-In' : 'Post-Session Check-Out'}
          </span>
        </CardTitle>
        <p className="text-muted-foreground">
          {type === 'pre_session' 
            ? 'Help us understand how you\'re feeling before your session begins.'
            : 'Help us understand how your session went and plan for next time.'
          }
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {type === 'pre_session' ? renderPreSessionQuestions() : renderPostSessionQuestions()}
        
        {/* Common questions */}
        <div className="space-y-3">
          <Label>How would you describe your emotional state?</Label>
          <Textarea
            value={emotionalState}
            onChange={(e) => setEmotionalState(e.target.value)}
            placeholder="Describe your current emotional state..."
            className="min-h-16"
          />
        </div>

        <div className="space-y-3">
          <Label>Confidence in managing your mental health (1-10)</Label>
          <Slider
            value={confidenceLevel}
            onValueChange={setConfidenceLevel}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="text-center text-sm text-muted-foreground">
            {confidenceLevel[0]}
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onSkip}>
            Skip Assessment
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-therapy-600 hover:bg-therapy-700"
          >
            {isSubmitting ? 'Submitting...' : 'Complete Assessment'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionAssessment;