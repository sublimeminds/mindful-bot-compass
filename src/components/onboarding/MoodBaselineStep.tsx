
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Heart, Brain, Zap, AlertTriangle } from 'lucide-react';

interface MoodBaselineStepProps {
  onMoodSet: (mood: any) => void;
  onBack: () => void;
}

const MoodBaselineStep: React.FC<MoodBaselineStepProps> = ({ onMoodSet, onBack }) => {
  const [mood, setMood] = useState({
    overall: 5,
    anxiety: 5,
    depression: 5,
    stress: 5,
    energy: 5
  });

  const moodCategories = [
    { key: 'overall', label: 'Overall Mood', icon: Heart, description: 'How do you feel overall right now?' },
    { key: 'anxiety', label: 'Anxiety Level', icon: AlertTriangle, description: 'How anxious or worried do you feel?' },
    { key: 'depression', label: 'Depression Level', icon: Brain, description: 'How sad or down do you feel?' },
    { key: 'stress', label: 'Stress Level', icon: AlertTriangle, description: 'How stressed or overwhelmed do you feel?' },
    { key: 'energy', label: 'Energy Level', icon: Zap, description: 'How energetic do you feel?' }
  ];

  const handleMoodChange = (category: string, value: number[]) => {
    setMood(prev => ({ ...prev, [category]: value[0] }));
  };

  const getMoodColor = (value: number) => {
    if (value <= 3) return 'text-red-500';
    if (value <= 6) return 'text-yellow-500';
    return 'text-green-500';
  };

  const handleSubmit = () => {
    onMoodSet(mood);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">How are you feeling today?</h2>
        <p className="text-muted-foreground">
          This helps us establish a baseline to track your progress over time.
        </p>
      </div>

      <div className="space-y-6">
        {moodCategories.map(category => {
          const IconComponent = category.icon;
          return (
            <Card key={category.key} className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center space-x-3">
                    <IconComponent className="h-5 w-5 text-harmony-600" />
                    <div>
                      <span className="font-medium">{category.label}</span>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </Label>
                  <span className={`text-lg font-semibold ${getMoodColor(mood[category.key])}`}>
                    {mood[category.key]}/10
                  </span>
                </div>
                <Slider
                  value={[mood[category.key]]}
                  onValueChange={(value) => handleMoodChange(category.key, value)}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Very Low</span>
                  <span>Moderate</span>
                  <span>Very High</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit} className="bg-gradient-to-r from-harmony-500 to-flow-500">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default MoodBaselineStep;
