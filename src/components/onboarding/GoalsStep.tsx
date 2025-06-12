
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, Info } from "lucide-react";

const goalOptions = [
  'Reduce anxiety',
  'Manage depression', 
  'Improve sleep',
  'Build confidence',
  'Manage stress',
  'Improve relationships',
  'Work through trauma',
  'Develop coping skills',
  'Set boundaries',
  'Find life purpose',
  'Improve communication',
  'Manage anger'
];

interface GoalsStepProps {
  selectedGoals: string[];
  onGoalToggle: (goal: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const GoalsStep = ({ selectedGoals, onGoalToggle, onNext, onBack }: GoalsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">What are your goals?</h2>
        <p className="text-muted-foreground mb-4">
          Select the areas you'd like to work on. This helps us personalize your therapy experience.
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <div className="flex items-start space-x-2">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Good to know:</p>
            <p>You can adjust your goals and focus areas anytime in your profile settings. Your AI therapist will adapt to your changing needs.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {goalOptions.map((goal) => (
          <Card 
            key={goal}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedGoals.includes(goal) 
                ? 'ring-2 ring-therapy-500 bg-therapy-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onGoalToggle(goal)}
          >
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={selectedGoals.includes(goal)}
                  onChange={() => onGoalToggle(goal)}
                />
                <div className="flex items-center space-x-2 min-w-0">
                  <Target className="h-3 w-3 text-therapy-600 flex-shrink-0" />
                  <span className="text-sm font-medium leading-tight">{goal}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack} disabled>
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={selectedGoals.length === 0}
          className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
        >
          Continue ({selectedGoals.length} selected)
        </Button>
      </div>
    </div>
  );
};

export default GoalsStep;
