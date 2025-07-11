import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, CheckCircle2, Plus, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DailyGoal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  estimatedMinutes: number;
}

const SAMPLE_GOALS: DailyGoal[] = [
  {
    id: '1',
    title: 'Morning Mood Check',
    description: 'Record your morning mood and energy level',
    completed: true,
    priority: 'high',
    estimatedMinutes: 5
  },
  {
    id: '2',
    title: 'Practice Deep Breathing',
    description: '10 minutes of focused breathing exercises',
    completed: true,
    priority: 'medium',
    estimatedMinutes: 10
  },
  {
    id: '3',
    title: 'Therapy Journal Entry',
    description: 'Write about today\'s experiences and feelings',
    completed: false,
    priority: 'high',
    estimatedMinutes: 15
  },
  {
    id: '4',
    title: 'Evening Reflection',
    description: 'Reflect on the day and set tomorrow\'s intentions',
    completed: false,
    priority: 'medium',
    estimatedMinutes: 10
  }
];

const DailyGoalsWidget = () => {
  const [goals, setGoals] = useState<DailyGoal[]>(SAMPLE_GOALS);
  
  const completedGoals = goals.filter(g => g.completed).length;
  const totalGoals = goals.length;
  const completionPercentage = (completedGoals / totalGoals) * 100;
  
  const toggleGoal = (goalId: string) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, completed: !goal.completed }
        : goal
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-therapy-200 bg-therapy-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-therapy-100 text-therapy-700',
      low: 'bg-green-100 text-green-700'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  return (
    <Card className="h-full flex flex-col bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg">
      <CardHeader className="pb-3 bg-gradient-to-r from-therapy-50 to-calm-50">
        <CardTitle className="text-base font-semibold text-therapy-800 flex items-center justify-between">
          <div className="flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Daily Goals
          </div>
          <Badge variant="outline" className="text-xs">
            {completedGoals}/{totalGoals}
          </Badge>
        </CardTitle>
        
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-therapy-600">Today's Progress</span>
            <span className="font-medium text-therapy-800">{Math.round(completionPercentage)}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="p-3 flex-1 overflow-hidden">
        <div className="space-y-2 h-full overflow-y-auto">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={cn(
                "p-3 rounded-lg border transition-all duration-200 cursor-pointer",
                goal.completed 
                  ? "bg-green-50 border-green-200 opacity-75" 
                  : getPriorityColor(goal.priority),
                "hover:shadow-sm"
              )}
              onClick={() => toggleGoal(goal.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle2 
                    className={cn(
                      "h-5 w-5 transition-colors",
                      goal.completed 
                        ? "text-green-600" 
                        : "text-gray-300 hover:text-therapy-500"
                    )}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={cn(
                      "text-sm font-medium",
                      goal.completed 
                        ? "text-green-800 line-through" 
                        : "text-gray-900"
                    )}>
                      {goal.title}
                    </h4>
                    
                    <div className="flex items-center space-x-1">
                      <Badge className={cn("text-xs px-1.5 py-0.5", getPriorityBadge(goal.priority))}>
                        {goal.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className={cn(
                    "text-xs leading-relaxed",
                    goal.completed ? "text-green-600" : "text-gray-600"
                  )}>
                    {goal.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{goal.estimatedMinutes} min</span>
                    </div>
                    
                    {goal.completed && (
                      <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                        ✓ Done
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add New Goal Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 text-therapy-600 border-therapy-200 hover:bg-therapy-50 border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyGoalsWidget;