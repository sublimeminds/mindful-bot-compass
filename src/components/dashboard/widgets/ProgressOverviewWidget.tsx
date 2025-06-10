
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Calendar, MessageSquare, Award, Zap } from 'lucide-react';

const ProgressOverviewWidget = () => {
  // Mock stats data - in a real app this would come from your analytics service
  const stats = {
    totalSessions: 12,
    totalMessages: 156,
    averageMoodImprovement: 1.8,
    weeklyGoal: 3,
    weeklyProgress: 2,
    longestStreak: 7
  };

  const progressPercentage = (stats.weeklyProgress / stats.weeklyGoal) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-therapy-600" />
          Your Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-therapy-50 rounded-lg">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-therapy-600" />
            <div className="text-2xl font-bold text-therapy-700">{stats.totalSessions}</div>
            <div className="text-sm text-muted-foreground">Total Sessions</div>
          </div>
          
          <div className="text-center p-4 bg-calm-50 rounded-lg">
            <MessageSquare className="h-6 w-6 mx-auto mb-2 text-calm-600" />
            <div className="text-2xl font-bold text-calm-700">{stats.totalMessages}</div>
            <div className="text-sm text-muted-foreground">Messages</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-700">
              +{stats.averageMoodImprovement.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Mood Improvement</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Award className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-700">{stats.longestStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-therapy-600" />
              <span className="text-sm font-medium">Weekly Goal Progress</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {stats.weeklyProgress}/{stats.weeklyGoal} sessions
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          {progressPercentage >= 100 && (
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <Zap className="h-3 w-3" />
              <span>Goal achieved! Great work!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressOverviewWidget;
