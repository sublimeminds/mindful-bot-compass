
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NotificationWidget from './NotificationWidget';
import { 
  Brain, 
  Heart, 
  Target, 
  TrendingUp,
  Calendar,
  Award,
  Activity,
  Clock,
  Users,
  MessageSquare,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const DashboardLayout = () => {
  // Mock data - in real app, fetch from API
  const dashboardData = {
    todaysSession: {
      time: '3:00 PM',
      type: 'Anxiety Management',
      duration: '45 minutes'
    },
    weeklyStats: {
      sessionsCompleted: 4,
      moodAverage: 7.8,
      streakDays: 12,
      minutesSpent: 180
    },
    recentAchievements: [
      { id: 1, title: '7-Day Streak', icon: '🔥', date: 'Today' },
      { id: 2, title: 'Mood Tracker Pro', icon: '📊', date: 'Yesterday' }
    ],
    quickActions: [
      { title: 'Start AI Session', icon: Brain, color: 'from-therapy-500 to-calm-500', path: '/therapy-chat' },
      { title: 'Mood Check-in', icon: Heart, color: 'from-harmony-500 to-balance-500', path: '/mood-tracker' },
      { title: 'View Progress', icon: TrendingUp, color: 'from-flow-500 to-therapy-500', path: '/analytics' },
      { title: 'Schedule Session', icon: Calendar, color: 'from-calm-500 to-harmony-500', path: '/schedule' }
    ]
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-therapy-25 to-calm-25 min-h-full">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-therapy-500 to-calm-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-therapy-100 text-lg">
              Ready to continue your mental wellness journey?
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-therapy-100 mb-1">Next Session</div>
            <div className="text-xl font-bold">{dashboardData.todaysSession.time}</div>
            <div className="text-sm text-therapy-100">{dashboardData.todaysSession.type}</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-therapy-700">{dashboardData.weeklyStats.sessionsCompleted}</p>
                <p className="text-sm text-gray-600">Sessions This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-harmony-500 to-balance-500 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-harmony-700">{dashboardData.weeklyStats.moodAverage}</p>
                <p className="text-sm text-gray-600">Average Mood</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700">{dashboardData.weeklyStats.streakDays}</p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-flow-500 to-calm-500 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-flow-700">{dashboardData.weeklyStats.minutesSpent}</p>
                <p className="text-sm text-gray-600">Minutes This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg h-full">
            <CardHeader className="bg-gradient-to-r from-therapy-50 to-calm-50">
              <CardTitle className="text-lg font-semibold text-therapy-800 flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardData.quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Button
                      key={index}
                      className={`h-20 flex-col space-y-2 bg-gradient-to-r ${action.color} text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border-0`}
                    >
                      <IconComponent className="h-6 w-6" />
                      <span className="font-medium">{action.title}</span>
                    </Button>
                  );
                })}
              </div>
              
              {/* Recent Achievements */}
              <div className="mt-6 pt-6 border-t border-therapy-100">
                <h3 className="font-semibold text-therapy-800 mb-3 flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Recent Achievements
                </h3>
                <div className="space-y-2">
                  {dashboardData.recentAchievements.map((achievement) => (
                    <div 
                      key={achievement.id}
                      className="flex items-center space-x-3 p-3 bg-gradient-to-r from-therapy-25 to-calm-25 rounded-lg hover:shadow-md transition-all duration-200"
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <p className="font-medium text-therapy-800">{achievement.title}</p>
                        <p className="text-sm text-gray-600">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Widget */}
        <div className="lg:col-span-1">
          <NotificationWidget />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
