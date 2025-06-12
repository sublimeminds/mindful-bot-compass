
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, Info, Brain, Heart, Moon, Users, Shield, Lightbulb, Hand, Compass, MessageCircle, Flame } from "lucide-react";

const goalOptions = [
  {
    name: 'Reduce anxiety',
    description: 'Learn techniques to manage worry and stress',
    icon: Brain
  },
  {
    name: 'Manage depression',
    description: 'Build resilience and improve mood',
    icon: Heart
  },
  {
    name: 'Improve sleep',
    description: 'Develop healthy sleep patterns and habits',
    icon: Moon
  },
  {
    name: 'Build confidence',
    description: 'Strengthen self-esteem and self-worth',
    icon: Target
  },
  {
    name: 'Manage stress',
    description: 'Create effective coping strategies',
    icon: Shield
  },
  {
    name: 'Improve relationships',
    description: 'Enhance connections with others',
    icon: Users
  },
  {
    name: 'Work through trauma',
    description: 'Process difficult experiences safely',
    icon: Hand
  },
  {
    name: 'Develop coping skills',
    description: 'Build tools for daily challenges',
    icon: Lightbulb
  },
  {
    name: 'Set boundaries',
    description: 'Learn to protect your energy and time',
    icon: Shield
  },
  {
    name: 'Find life purpose',
    description: 'Discover meaning and direction',
    icon: Compass
  },
  {
    name: 'Improve communication',
    description: 'Express yourself more effectively',
    icon: MessageCircle
  },
  {
    name: 'Manage anger',
    description: 'Control emotional responses healthily',
    icon: Flame
  }
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

      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
        <div className="flex items-start space-x-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Good to know:</p>
            <p>You can adjust your goals and focus areas anytime in your profile settings. Your AI therapist will adapt to your changing needs.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {goalOptions.map((goal) => {
          const IconComponent = goal.icon;
          return (
            <Card 
              key={goal.name}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md h-24 ${
                selectedGoals.includes(goal.name) 
                  ? 'ring-2 ring-therapy-500 bg-therapy-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onGoalToggle(goal.name)}
            >
              <CardContent className="p-3 h-full flex flex-col">
                <div className="flex items-start space-x-2 h-full">
                  <Checkbox 
                    checked={selectedGoals.includes(goal.name)}
                    onChange={() => onGoalToggle(goal.name)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 mb-1">
                      <IconComponent className="h-3 w-3 text-therapy-600 flex-shrink-0" />
                      <span className="font-medium text-xs leading-tight">{goal.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-tight line-clamp-2">
                      {goal.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
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
