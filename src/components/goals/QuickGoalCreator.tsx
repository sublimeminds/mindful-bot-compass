import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Plus, Target, Sparkles, TrendingUp } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useUserGoals } from '@/hooks/useUserGoals';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { useNavigate } from 'react-router-dom';

const QuickGoalCreator: React.FC = () => {
  const { user } = useSimpleApp();
  // Temporary placeholder - will be connected to real hooks
  const createGoal = async (goalData: any) => null;
  const createMoodEntry = async () => null;
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const quickGoals = [
    {
      title: "Reduce Daily Anxiety",
      description: "Practice mindfulness and breathing exercises",
      category: "mental_health",
      targetValue: 30, // 30 days
      currentValue: 0
    },
    {
      title: "Improve Sleep Quality",
      description: "Maintain consistent sleep schedule",
      category: "wellness",
      targetValue: 21, // 21 days
      currentValue: 0
    },
    {
      title: "Daily Mood Tracking",
      description: "Track mood and identify patterns",
      category: "self_awareness", 
      targetValue: 14, // 14 days
      currentValue: 0
    },
    {
      title: "Weekly Therapy Sessions",
      description: "Attend regular therapy sessions",
      category: "therapy",
      targetValue: 4, // 4 weeks
      currentValue: 0
    }
  ];

  const handleCreateGoal = async (goalTemplate: typeof quickGoals[0]) => {
    if (!user?.id || isCreating) return;

    setIsCreating(true);
    try {
      const newGoal = await createGoal({
        ...goalTemplate,
        status: 'active',
        priority: 'medium',
        targetDate: new Date(Date.now() + goalTemplate.targetValue * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        streakCount: 0,
        bestStreak: 0,
      });

      if (newGoal) {
        // If it's mood tracking goal, create first mood entry
        if (goalTemplate.category === 'self_awareness') {
          navigate('/mood-tracker');
        } else if (goalTemplate.category === 'therapy') {
          navigate('/therapist-discovery');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="h-5 w-5 mr-2 text-therapy-600" />
          Quick Goal Setup
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get started with proven therapy goals
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickGoals.map((goal, index) => (
            <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{goal.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {goal.targetValue} days
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {goal.description}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCreateGoal(goal)}
                  disabled={isCreating}
                  className="w-full text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Start Goal
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/goals')}
            className="w-full text-therapy-600 hover:text-therapy-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Create Custom Goal
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickGoalCreator;