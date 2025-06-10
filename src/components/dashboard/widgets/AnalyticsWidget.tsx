
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Calendar, Brain, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSessionStats } from '@/hooks/useSessionStats';
import { useSessionHistory } from '@/hooks/useSessionHistory';

const AnalyticsWidget = () => {
  const navigate = useNavigate();
  const { stats, isLoading: statsLoading } = useSessionStats();
  const { sessionSummaries, isLoading: sessionsLoading } = useSessionHistory();

  if (statsLoading || sessionsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading analytics...</div>
        </CardContent>
      </Card>
    );
  }

  const hasData = stats && stats.totalSessions > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-therapy-600" />
            Analytics Overview
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/analytics')}
            className="text-therapy-600 hover:text-therapy-700"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasData ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-therapy-50 rounded-lg">
                <div className="text-2xl font-bold text-therapy-700">{stats.totalSessions}</div>
                <div className="text-xs text-muted-foreground">Total Sessions</div>
              </div>
              <div className="text-center p-3 bg-calm-50 rounded-lg">
                <div className="text-2xl font-bold text-calm-700">
                  +{stats.averageMoodImprovement.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Avg Improvement</div>
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Weekly Goal Progress</span>
                <span className="font-medium">
                  {stats.weeklyProgress}/{stats.weeklyGoal} sessions
                </span>
              </div>
              <Progress 
                value={(stats.weeklyProgress / stats.weeklyGoal) * 100} 
                className="h-2" 
              />
            </div>

            {/* Quick Insights */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Quick Insights</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-muted-foreground">
                    {stats.averageMoodImprovement > 0 ? 'Positive trend' : 'Room for improvement'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3 text-blue-500" />
                  <span className="text-muted-foreground">
                    {stats.weeklyProgress >= stats.weeklyGoal ? 'Goal achieved this week!' : 'Keep up the good work'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/analytics')}
              className="w-full"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Detailed Analytics
            </Button>
          </>
        ) : (
          <div className="text-center py-6">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground mb-3">No analytics data yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/chat')}
            >
              Start Your First Session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsWidget;
