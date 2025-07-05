import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Activity,
  Calendar,
  Clock,
  BarChart3
} from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const ProgressOverviewWidget = () => {
  // Mock progress data - in real app, fetch from API
  const progressData = {
    weeklyGoal: {
      current: 4,
      target: 7,
      unit: 'sessions'
    },
    monthlyStats: {
      sessionsCompleted: 12,
      averageMood: 7.8,
      streakDays: 12,
      totalMinutes: 540
    },
    achievements: [
      { id: 1, title: 'First Week', icon: '🎉', unlocked: true },
      { id: 2, title: 'Consistency', icon: '🔥', unlocked: true },
      { id: 3, title: 'Mood Master', icon: '😊', unlocked: false },
      { id: 4, title: '30 Days', icon: '📅', unlocked: false }
    ],
    trends: {
      mood: { direction: 'up', change: '+12%' },
      sessions: { direction: 'up', change: '+8%' },
      engagement: { direction: 'stable', change: '0%' }
    }
  };

  const getProgressPercentage = () => {
    return (progressData.weeklyGoal.current / progressData.weeklyGoal.target) * 100;
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <SafeComponentWrapper name="ProgressOverviewWidget">
      <Card className="bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-flow-50 to-therapy-50">
          <CardTitle className="flex items-center justify-between text-flow-800">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Progress Overview
            </div>
            <Badge variant="secondary" className="text-xs">
              This month
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Weekly Goal Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-therapy-800">Weekly Goal</span>
              <span className="text-xs text-muted-foreground">
                {progressData.weeklyGoal.current}/{progressData.weeklyGoal.target} {progressData.weeklyGoal.unit}
              </span>
            </div>
            <Progress 
              value={getProgressPercentage()} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {Math.round(getProgressPercentage())}% complete • Keep it up!
            </p>
          </div>

          {/* Monthly Stats Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-gradient-to-r from-therapy-25 to-calm-25 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-therapy-600" />
                <div>
                  <p className="text-lg font-bold text-therapy-800">
                    {progressData.monthlyStats.sessionsCompleted}
                  </p>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-harmony-25 to-balance-25 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-harmony-600" />
                <div>
                  <p className="text-lg font-bold text-harmony-800">
                    {progressData.monthlyStats.streakDays}
                  </p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trends */}
          <div className="pt-3 border-t border-therapy-100">
            <h4 className="text-sm font-medium text-therapy-800 mb-2">Trends</h4>
            <div className="space-y-2">
              {Object.entries(progressData.trends).map(([key, trend]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground capitalize">{key}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">{getTrendIcon(trend.direction)}</span>
                    <span className={`text-xs font-medium ${getTrendColor(trend.direction)}`}>
                      {trend.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="pt-3 border-t border-therapy-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-therapy-800">Achievements</h4>
              <Badge variant="outline" className="text-xs">
                {progressData.achievements.filter(a => a.unlocked).length}/{progressData.achievements.length}
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {progressData.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-2 rounded-lg text-center transition-all duration-200 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' 
                      : 'bg-gray-50 border border-gray-200 opacity-50'
                  }`}
                >
                  <div className="text-lg mb-1">{achievement.icon}</div>
                  <p className="text-xs font-medium">{achievement.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2 text-therapy-600 border-therapy-200 hover:bg-therapy-50"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Detailed Analytics
          </Button>
        </CardContent>
      </Card>
    </SafeComponentWrapper>
  );
};

export default ProgressOverviewWidget;