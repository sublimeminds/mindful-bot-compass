
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';
import { useSessionStats } from '@/hooks/useSessionStats';

const ProgressOverviewWidget = () => {
  const { stats, isLoading } = useSessionStats();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading progress...</div>
        </CardContent>
      </Card>
    );
  }

  const weeklyProgress = stats ? (stats.weeklyProgress / stats.weeklyGoal) * 100 : 0;
  const totalProgress = stats ? Math.min((stats.totalSessions / 20) * 100, 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-therapy-600" />
          Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {stats ? (
          <>
            {/* Weekly Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">This Week</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {stats.weeklyProgress}/{stats.weeklyGoal}
                </span>
              </div>
              <Progress value={weeklyProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {weeklyProgress >= 100 ? 'Goal achieved! 🎉' : `${Math.round(100 - weeklyProgress)}% to weekly goal`}
              </p>
            </div>

            {/* Total Sessions Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-therapy-500" />
                  <span className="text-sm font-medium">Total Sessions</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {stats.totalSessions}/20
                </span>
              </div>
              <Progress value={totalProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Journey to 20 sessions milestone
              </p>
            </div>

            {/* Mood Improvement */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Avg Improvement</span>
                </div>
                <span className="text-sm font-bold text-green-600">
                  +{stats.averageMoodImprovement.toFixed(1)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {stats.averageMoodImprovement > 1.5 
                  ? 'Excellent progress! Your sessions are very effective.'
                  : stats.averageMoodImprovement > 0.5
                  ? 'Good progress! Keep up the consistent practice.'
                  : 'Every session counts. Consistency is key to progress.'
                }
              </div>
            </div>

            {/* Achievements */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Recent Achievements</h4>
              <div className="space-y-2">
                {stats.totalSessions >= 1 && (
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-therapy-500 rounded-full"></div>
                    <span>First session completed</span>
                  </div>
                )}
                {stats.totalSessions >= 5 && (
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-therapy-500 rounded-full"></div>
                    <span>5 sessions milestone</span>
                  </div>
                )}
                {stats.weeklyProgress >= stats.weeklyGoal && (
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Weekly goal achieved</span>
                  </div>
                )}
                {stats.totalSessions === 0 && (
                  <div className="text-sm text-muted-foreground">
                    Start your first session to unlock achievements!
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">
              Progress will appear after your first session
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressOverviewWidget;
