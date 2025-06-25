
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { Target, TrendingUp, Calendar, MessageCircle } from 'lucide-react';

const WelcomeWidget = () => {
  const { user } = useAuth();

  const quickStats = {
    weeklyGoalProgress: 75,
    sessionsThisWeek: 3,
    streakDays: 7,
    moodTrend: 'improving'
  };

  const quickActions = [
    {
      title: 'Start Chat Session',
      description: 'Begin a new therapy conversation',
      icon: MessageCircle,
      href: '/chat',
      color: 'bg-therapy-500'
    },
    {
      title: 'Track Your Progress',
      description: 'View your wellness journey',
      icon: TrendingUp,
      href: '/analytics',
      color: 'bg-blue-500'
    },
    {
      title: 'Set New Goals',
      description: 'Create meaningful objectives',
      icon: Target,
      href: '/goals',
      color: 'bg-green-500'
    },
    {
      title: 'Schedule Session',
      description: 'Book your next appointment',
      icon: Calendar,
      href: '/schedule',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Card className="bg-gradient-to-r from-therapy-50 to-calm-50 border-therapy-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-therapy-900">
            Welcome back, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'there'}! 👋
          </CardTitle>
          <p className="text-therapy-600">
            It's great to see you continuing your wellness journey. Here's what's happening today.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-therapy-700">{quickStats.weeklyGoalProgress}%</div>
              <div className="text-sm text-therapy-600">Weekly Goal Progress</div>
              <Progress value={quickStats.weeklyGoalProgress} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">{quickStats.sessionsThisWeek}</div>
              <div className="text-sm text-blue-600">Sessions This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{quickStats.streakDays}</div>
              <div className="text-sm text-green-600">Day Streak</div>
              <Badge variant="outline" className="mt-1 text-green-700 border-green-200">
                {quickStats.moodTrend}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-therapy-700 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeWidget;
