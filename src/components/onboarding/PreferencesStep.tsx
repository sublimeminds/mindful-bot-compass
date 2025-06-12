
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings } from "lucide-react";

const preferenceOptions = [
  'Cognitive Behavioral Therapy (CBT)',
  'Mindfulness & Meditation',
  'Talk Therapy',
  'Solution-Focused Therapy',
  'Trauma-Informed Care',
  'Positive Psychology'
];

// Preselected preferences for most users
const defaultPreferences = [
  'Cognitive Behavioral Therapy (CBT)',
  'Mindfulness & Meditation',
  'Talk Therapy'
];

interface PreferencesStepProps {
  selectedPreferences: string[];
  onPreferenceToggle: (preference: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const PreferencesStep = ({ selectedPreferences, onPreferenceToggle, onNext, onBack }: PreferencesStepProps) => {
  // Pre-select default preferences if none are selected
  React.useEffect(() => {
    if (selectedPreferences.length === 0) {
      defaultPreferences.forEach(pref => {
        onPreferenceToggle(pref);
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Therapy Preferences</h2>
        <p className="text-muted-foreground">
          We've pre-selected the most popular approaches. You can customize anytime and change your AI therapist preferences later.
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          💡 <strong>Good to know:</strong> You can change your AI therapist style and preferences anytime in your profile settings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {preferenceOptions.map((preference) => (
          <Card 
            key={preference}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedPreferences.includes(preference) 
                ? 'ring-2 ring-therapy-500 bg-therapy-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onPreferenceToggle(preference)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  checked={selectedPreferences.includes(preference)}
                  onChange={() => onPreferenceToggle(preference)}
                />
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-therapy-600" />
                  <span className="font-medium">{preference}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
