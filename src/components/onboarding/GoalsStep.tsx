
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Target } from "lucide-react";

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
        <p className="text-muted-foreground">
          Select the areas you'd like to work on (choose as many as apply)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  checked={selectedGoals.includes(goal)}
                  onChange={() => onGoalToggle(goal)}
                />
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-therapy-600" />
                  <span className="font-medium">{goal}</span>
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
          Continue
        </Button>
      </div>
    </div>
  );
};

export default GoalsStep;
