import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/hooks/useAuth';
import { PersonalizationService } from '@/services/personalizationService';
import { useToast } from '@/hooks/use-toast';

interface PersonalizationWizardProps {
  onComplete: () => void;
}

const PersonalizationWizard = ({ onComplete }: PersonalizationWizardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    communicationStyle: 'supportive' as 'supportive' | 'direct' | 'analytical' | 'encouraging',
    preferredApproaches: [] as string[],
    sessionPreferences: {
      preferredTime: 'evening',
      sessionLength: 30,
      frequency: 'daily'
    },
    emotionalPatterns: {
      dominantEmotions: [] as string[],
      triggerWords: [] as string[],
      positiveIndicators: [] as string[]
    }
  });

  const communicationStyles = [
    { value: 'supportive', label: 'Supportive & Empathetic', description: 'Warm, understanding, and validating responses' },
    { value: 'direct', label: 'Direct & Solution-Focused', description: 'Clear, actionable advice and practical solutions' },
    { value: 'analytical', label: 'Analytical & Structured', description: 'Data-driven insights and systematic approaches' },
    { value: 'encouraging', label: 'Encouraging & Motivational', description: 'Positive reinforcement and goal-oriented guidance' }
  ];

  const therapyApproaches = [
    'Cognitive Behavioral Therapy (CBT)',
    'Mindfulness-Based Therapy',
    'Dialectical Behavior Therapy (DBT)',
    'Acceptance and Commitment Therapy (ACT)',
    'Psychodynamic Therapy',
    'Humanistic Therapy',
    'Solution-Focused Therapy',
    'Trauma-Informed Therapy'
  ];

  const handleApproachToggle = (approach: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredApproaches: prev.preferredApproaches.includes(approach)
        ? prev.preferredApproaches.filter(a => a !== approach)
        : [...prev.preferredApproaches, approach]
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const success = await PersonalizationService.updateUserProfile({
        userId: user.id,
        ...preferences
      });

      if (success) {
        toast({
          title: "Preferences Saved",
          description: "Your therapy preferences have been configured successfully.",
        });
        onComplete();
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Communication Style</h3>
              <p className="text-muted-foreground mb-4">
                How would you like your AI therapist to communicate with you?
              </p>
              <RadioGroup
                value={preferences.communicationStyle}
                onValueChange={(value) => setPreferences(prev => ({
                  ...prev,
                  communicationStyle: value as typeof prev.communicationStyle
                }))}
              >
                {communicationStyles.map((style) => (
                  <div key={style.value} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value={style.value} id={style.value} className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor={style.value} className="font-medium">
                        {style.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {style.description}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Therapy Approaches</h3>
              <p className="text-muted-foreground mb-4">
                Select the therapeutic approaches you're interested in (you can choose multiple):
              </p>
              <div className="grid grid-cols-1 gap-3">
                {therapyApproaches.map((approach) => (
                  <div key={approach} className="flex items-center space-x-2 p-2">
                    <Checkbox
                      id={approach}
                      checked={preferences.preferredApproaches.includes(approach)}
                      onCheckedChange={() => handleApproachToggle(approach)}
                    />
                    <Label htmlFor={approach} className="text-sm">
                      {approach}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Session Preferences</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Preferred Session Time</Label>
                  <RadioGroup
                    value={preferences.sessionPreferences.preferredTime}
                    onValueChange={(value) => setPreferences(prev => ({
                      ...prev,
                      sessionPreferences: { ...prev.sessionPreferences, preferredTime: value }
                    }))}
                    className="mt-2"
                  >
                    {['morning', 'afternoon', 'evening', 'night'].map((time) => (
                      <div key={time} className="flex items-center space-x-2">
                        <RadioGroupItem value={time} id={time} />
                        <Label htmlFor={time} className="capitalize">{time}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Preferred Session Length: {preferences.sessionPreferences.sessionLength} minutes
                  </Label>
                  <Slider
                    value={[preferences.sessionPreferences.sessionLength]}
                    onValueChange={([value]) => setPreferences(prev => ({
                      ...prev,
                      sessionPreferences: { ...prev.sessionPreferences, sessionLength: value }
                    }))}
                    max={60}
                    min={10}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Session Frequency</Label>
                  <RadioGroup
                    value={preferences.sessionPreferences.frequency}
                    onValueChange={(value) => setPreferences(prev => ({
                      ...prev,
                      sessionPreferences: { ...prev.sessionPreferences, frequency: value }
                    }))}
                    className="mt-2"
                  >
                    {['daily', 'weekly', 'bi-weekly', 'monthly'].map((freq) => (
                      <div key={freq} className="flex items-center space-x-2">
                        <RadioGroupItem value={freq} id={freq} />
                        <Label htmlFor={freq} className="capitalize">{freq}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Personalize Your Therapy Experience</CardTitle>
        <div className="flex space-x-2">
          {[1, 2, 3].map((stepNum) => (
            <div
              key={stepNum}
              className={`h-2 flex-1 rounded ${
                stepNum <= step ? 'bg-therapy-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {renderStep()}
        
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSave}>
              Complete Setup
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizationWizard;
