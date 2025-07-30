
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import NotificationWidget from './NotificationWidget';
import WelcomeWidget from './widgets/WelcomeWidget';
import MoodTrackerWidget from './widgets/MoodTrackerWidget';
import SessionHistoryWidget from './widgets/SessionHistoryWidget';
import QuickActionsWidget from './widgets/QuickActionsWidget';
import ProgressOverviewWidget from './widgets/ProgressOverviewWidget';
import TherapistAvatarWidget from './widgets/TherapistAvatarWidget';
import AIInsightsWidget from './widgets/AIInsightsWidget';
import SmartRecommendationsWidget from './widgets/SmartRecommendationsWidget';
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
import XPProgressWidget from './widgets/XPProgressWidget';
import ComplianceStatusWidget from './widgets/ComplianceStatusWidget';
import RecentAchievementsWidget from './widgets/RecentAchievementsWidget';

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
    <SafeComponentWrapper name="DashboardLayout">
      <div className="p-6 space-y-6 bg-gradient-to-br from-therapy-25 to-calm-25 min-h-full">
        {/* Welcome Section */}
        <SafeComponentWrapper name="WelcomeSection">
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
        </SafeComponentWrapper>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
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

        <Card className="bg-white border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
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

        <Card className="bg-white border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
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

        <Card className="bg-white border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
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

        {/* Bulletproof Dashboard Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Main Widgets */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Actions Widget */}
            <QuickActionsWidget />
            
            {/* Session History Widget */}
            <SessionHistoryWidget />
          </div>

          {/* Right Column - Side Widgets */}
          <div className="lg:col-span-4 space-y-6">
            {/* XP Progress Widget */}
            <XPProgressWidget />
            
            {/* Recent Achievements Widget */}
            <RecentAchievementsWidget />
            
            {/* Compliance Status Widget */}
            <ComplianceStatusWidget />
            
            {/* AI Insights Widget */}
            <AIInsightsWidget />
            
            {/* Smart Recommendations Widget */}
            <SmartRecommendationsWidget />
            
            {/* Therapist Avatar Widget */}
            <TherapistAvatarWidget />
            
            {/* Mood Tracker Widget */}
            <MoodTrackerWidget />
            
            {/* Progress Overview Widget */}
            <ProgressOverviewWidget />
            
            {/* Notifications Widget */}
            <SafeComponentWrapper name="NotificationWidget" fallback={
              <Card className="bg-white border border-therapy-100">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Notifications unavailable</p>
                </CardContent>
              </Card>
            }>
              <NotificationWidget />
            </SafeComponentWrapper>
          </div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default DashboardLayout;
