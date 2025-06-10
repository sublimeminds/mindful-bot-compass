
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GoalsWidget = () => {
  const navigate = useNavigate();

  // Mock goals data
  const goals = [
    {
      id: 1,
      title: "Practice mindfulness daily",
      progress: 75,
      dueDate: "This week",
      status: "active"
    },
    {
      id: 2,
      title: "Complete 3 therapy sessions",
      progress: 66,
      dueDate: "This week",
      status: "active"
    },
    {
      id: 3,
      title: "Exercise 4 times a week",
      progress: 100,
      dueDate: "Completed",
      status: "completed"
    }
  ];

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-therapy-600" />
            Goals Progress
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/goals')}
            className="text-therapy-600 hover:text-therapy-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Goals */}
        <div className="space-y-3">
          {activeGoals.slice(0, 2).map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">{goal.title}</h4>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{goal.dueDate}</span>
                </div>
              </div>
              <Progress value={goal.progress} className="h-2" />
              <div className="text-xs text-muted-foreground text-right">
                {goal.progress}% complete
              </div>
            </div>
          ))}
        </div>

        {/* Completed Goals Summary */}
        {completedGoals.length > 0 && (
          <div className="pt-3 border-t">
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>{completedGoals.length} goal{completedGoals.length !== 1 ? 's' : ''} completed this week!</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/goals')}
            className="w-full"
          >
            Manage All Goals
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsWidget;
