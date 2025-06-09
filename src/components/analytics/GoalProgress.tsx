
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboardingData } from "@/hooks/useOnboardingData";
import { useSessionStats } from "@/hooks/useSessionStats";

const GoalProgress = () => {
  const { user } = useAuth();
  const { onboardingData } = useOnboardingData();
  const { stats } = useSessionStats();
  const [goalProgress, setGoalProgress] = useState<any[]>([]);

  useEffect(() => {
    if (!onboardingData || !stats) return;

    // Create mock goal progress based on user's goals and actual stats
    const mockProgress = onboardingData.goals.map((goal, index) => {
      let progress = 0;
      let status = 'in-progress';

      // Calculate progress based on goal type and user stats
      if (goal.toLowerCase().includes('stress') || goal.toLowerCase().includes('anxiety')) {
        progress = Math.min(100, (stats.totalSessions * 15) + (stats.averageMoodImprovement * 10));
      } else if (goal.toLowerCase().includes('depression') || goal.toLowerCase().includes('mood')) {
        progress = Math.min(100, Math.max(0, stats.averageMoodImprovement * 20) + (stats.totalSessions * 10));
      } else if (goal.toLowerCase().includes('relationship') || goal.toLowerCase().includes('communication')) {
        progress = Math.min(100, stats.totalSessions * 12);
      } else {
        progress = Math.min(100, stats.totalSessions * 10 + Math.random() * 20);
      }

      if (progress >= 80) status = 'completed';
      else if (progress >= 40) status = 'on-track';

      return {
        id: index,
        goal,
        progress: Math.round(progress),
        status,
        timeframe: '3 months'
      };
    });

    setGoalProgress(mockProgress);
  }, [onboardingData, stats]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'on-track':
        return <Target className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'on-track':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Goal Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!onboardingData || goalProgress.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Complete onboarding to set your therapy goals
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {goalProgress.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(goal.status)}
                    <span className="text-sm font-medium">{goal.goal}</span>
                  </div>
                  <Badge variant={getStatusColor(goal.status)}>
                    {goal.progress}%
                  </Badge>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Target: {goal.timeframe}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalProgress;
