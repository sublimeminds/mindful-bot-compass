
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface PreferencesStepProps {
  selectedPreferences: string[];
  onPreferenceToggle: (preference: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const PreferencesStep = ({ selectedPreferences, onPreferenceToggle, onNext, onBack }: PreferencesStepProps) => {
  const preferences = [
    'Morning sessions',
    'Evening sessions',
    'Short daily check-ins',
    'Weekly deep dives',
    'Guided meditations',
    'Journaling prompts'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Communication Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {preferences.map((preference) => (
              <div key={preference} className="flex items-center space-x-2">
                <Checkbox
                  id={preference}
                  checked={selectedPreferences.includes(preference)}
                  onCheckedChange={() => onPreferenceToggle(preference)}
                />
                <Label htmlFor={preference}>{preference}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={onNext}>
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default PreferencesStep;
