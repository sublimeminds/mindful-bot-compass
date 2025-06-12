
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, Brain, Heart, MessageCircle, Target, Shield, Smile } from "lucide-react";

const preferenceOptions = [
  {
    name: 'Cognitive Behavioral Therapy (CBT)',
    description: 'Evidence-based approach focusing on changing thought patterns',
    icon: Brain,
    keywords: ['anxiety', 'depression', 'stress', 'confidence']
  },
  {
    name: 'Mindfulness & Meditation',
    description: 'Present-moment awareness and relaxation techniques',
    icon: Heart,
    keywords: ['stress', 'anxiety', 'sleep', 'anger']
  },
  {
    name: 'Talk Therapy',
    description: 'Open conversation to explore thoughts and feelings',
    icon: MessageCircle,
    keywords: ['depression', 'relationships', 'communication', 'life purpose']
  },
  {
    name: 'Solution-Focused Therapy',
    description: 'Goal-oriented approach building on your strengths',
    icon: Target,
    keywords: ['confidence', 'life purpose', 'coping skills']
  },
  {
    name: 'Trauma-Informed Care',
    description: 'Safe, sensitive approach for processing difficult experiences',
    icon: Shield,
    keywords: ['trauma', 'boundaries']
  },
  {
    name: 'Positive Psychology',
    description: 'Focus on building happiness and life satisfaction',
    icon: Smile,
    keywords: ['confidence', 'life purpose', 'relationships']
  }
];

interface PreferencesStepProps {
  selectedPreferences: string[];
  selectedGoals: string[];
  onPreferenceToggle: (preference: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const PreferencesStep = ({ selectedPreferences, selectedGoals, onPreferenceToggle, onNext, onBack }: PreferencesStepProps) => {
  // Smart pre-selection based on goals
  useEffect(() => {
    if (selectedPreferences.length === 0 && selectedGoals.length > 0) {
      const goalKeywords = selectedGoals.map(goal => goal.toLowerCase());
      
      const smartSelections = preferenceOptions.filter(pref => 
        pref.keywords.some(keyword => 
          goalKeywords.some(goal => goal.includes(keyword))
        )
      );

      // Always include CBT and Talk Therapy as defaults
      const defaultSelections = ['Cognitive Behavioral Therapy (CBT)', 'Talk Therapy'];
      
      const recommendations = [...new Set([
        ...defaultSelections,
        ...smartSelections.slice(0, 2).map(pref => pref.name)
      ])];

      recommendations.forEach(pref => {
        onPreferenceToggle(pref);
      });
    }
  }, [selectedGoals, selectedPreferences.length, onPreferenceToggle]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Therapy Preferences</h2>
        <p className="text-muted-foreground">
          We've pre-selected approaches based on your goals. You can customize anytime.
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          💡 <strong>Good to know:</strong> You can change your AI therapist style and preferences anytime in your profile settings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {preferenceOptions.map((preference) => {
          const IconComponent = preference.icon;
          return (
            <Card 
              key={preference.name}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedPreferences.includes(preference.name) 
                  ? 'ring-2 ring-therapy-500 bg-therapy-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onPreferenceToggle(preference.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    checked={selectedPreferences.includes(preference.name)}
                    onChange={() => onPreferenceToggle(preference.name)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <IconComponent className="h-4 w-4 text-therapy-600" />
                      <span className="font-medium text-sm">{preference.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {preference.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onNext}
          className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PreferencesStep;
