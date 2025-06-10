
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, ArrowRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSessionStats } from '@/hooks/useSessionStats';

const AnalyticsWidget = () => {
  const navigate = useNavigate();
  const { stats, isLoading } = useSessionStats();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading analytics...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-therapy-600" />
            Analytics
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
        {stats ? (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-therapy-50 rounded-lg">
                <div className="text-2xl font-bold text-therapy-700">{stats.totalSessions}</div>
                <div className="text-xs text-muted-foreground">Total Sessions</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">+{stats.averageMoodImprovement.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">Avg Improvement</div>
              </div>
            </div>

            {/* Progress This Week */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Weekly Goal Progress</span>
                <span className="font-medium">{stats.weeklyProgress}/{stats.weeklyGoal}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-therapy-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((stats.weeklyProgress / stats.weeklyGoal) * 100, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>{stats.weeklyGoal} sessions/week</span>
              </div>
            </div>

            {/* Key Insights */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Quick Insights</h4>
              <div className="space-y-2 text-sm">
                {stats.weeklyProgress >= stats.weeklyGoal && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>Weekly goal achieved! 🎉</span>
                  </div>
                )}
                
                {stats.averageMoodImprovement > 1 && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>Sessions effectively improving mood</span>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{stats.totalMessages} total messages exchanged</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground mb-3">No data yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/therapy')}
            >
              Start Your First Session
            </Button>
          </div>
        )}

        {/* Action Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/analytics')}
          className="w-full"
        >
          View Detailed Analytics
        </Button>
      </CardContent>
    </Card>
  );
};

export default AnalyticsWidget;
