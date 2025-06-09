
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AnalyticsData } from "@/services/analyticsService";

interface GoalProgressProps {
  goalProgress: AnalyticsData['goalProgress'];
}

const GoalProgress = ({ goalProgress }: GoalProgressProps) => {
  const getTrendIcon = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return 'bg-green-100 text-green-800';
      case 'declining':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const goals = Object.entries(goalProgress);

  if (goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Goal Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No goals set yet. Complete your onboarding to track progress.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Goal Progress
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your progress toward your therapy goals
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.map(([goalName, data]) => (
          <div key={goalName} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{goalName}</h4>
              <div className="flex items-center space-x-2">
                <Badge className={getTrendColor(data.trend)}>
                  {getTrendIcon(data.trend)}
                  <span className="ml-1 capitalize">{data.trend}</span>
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {Math.round(data.progress)}%
                </span>
              </div>
            </div>
            <Progress value={data.progress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>Target: {data.target}%</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default GoalProgress;
