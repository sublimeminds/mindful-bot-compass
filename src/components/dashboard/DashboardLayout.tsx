import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Sparkles
} from 'lucide-react';

const DashboardLayout = () => {
  const { user } = useAuth();
  const { data: dashboardData, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error loading dashboard data</p>
          <p className="text-sm text-gray-600 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  // Use real data with fallbacks
  const stats = dashboardData?.userStats || {
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    averageMood: null
  };

  const quickActions = [
    { title: 'Start AI Session', icon: Brain, color: 'from-therapy-500 to-calm-500', path: '/therapy-chat' },
    { title: 'Mood Check-in', icon: Heart, color: 'from-harmony-500 to-balance-500', path: '/mood-tracker' },
    { title: 'View Progress', icon: TrendingUp, color: 'from-flow-500 to-therapy-500', path: '/analytics' },
    { title: 'Schedule Session', icon: Calendar, color: 'from-calm-500 to-harmony-500', path: '/schedule' }
  ];

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
            <div className="text-sm text-therapy-100 mb-1">Sessions Completed</div>
            <div className="text-xl font-bold">{stats.totalSessions}</div>
            <div className="text-sm text-therapy-100">Total Sessions</div>
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
                <p className="text-2xl font-bold text-therapy-700">{stats.totalSessions}</p>
                <p className="text-sm text-gray-600">Total Sessions</p>
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
                <p className="text-2xl font-bold text-harmony-700">
                  {stats.averageMood ? stats.averageMood.toFixed(1) : 'N/A'}
                </p>
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
                <p className="text-2xl font-bold text-orange-700">{stats.currentStreak}</p>
                <p className="text-sm text-gray-600">Current Streak</p>
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
                <p className="text-2xl font-bold text-flow-700">{stats.totalMinutes}</p>
                <p className="text-sm text-gray-600">Total Minutes</p>
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
                {quickActions.map((action, index) => {
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
              
              {/* Recent Activity */}
              <div className="mt-6 pt-6 border-t border-therapy-100">
                <h3 className="font-semibold text-therapy-800 mb-3 flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Recent Activity
                </h3>
                <div className="space-y-2">
                  {dashboardData?.recentSessions?.slice(0, 3).map((session: any) => (
                    <div 
                      key={session.id}
                      className="flex items-center space-x-3 p-3 bg-gradient-to-r from-therapy-25 to-calm-25 rounded-lg hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-8 h-8 bg-therapy-500 rounded-full flex items-center justify-center">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-therapy-800">Therapy Session</p>
                        <p className="text-sm text-gray-600">
                          {new Date(session.start_time).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-sm">No recent sessions</p>
                  )}
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