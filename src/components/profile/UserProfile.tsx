
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, CreditCard, Bell, Shield, TrendingUp, Target, Calendar, Activity, Headphones, MessageSquare, Accessibility, Sparkles, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserStats } from '@/hooks/useUserStats';
import { useUserSessions } from '@/hooks/useUserSessions';
import { useUserGoals } from '@/hooks/useUserGoals';
import RealBillingHistory from '@/components/subscription/RealBillingHistory';
import EnhancedAccountSettings from './EnhancedAccountSettings';
import AudioSettings from '@/components/settings/AudioSettings';
import SessionSettings from '@/components/settings/SessionSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import AccessibilitySettings from '@/components/settings/AccessibilitySettings';
import PersonalizationSettings from '@/components/settings/PersonalizationSettings';
import AdvancedSettings from '@/components/settings/AdvancedSettings';

const UserProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const { data: userStats, isLoading: statsLoading } = useUserStats();
  const { data: userSessions, isLoading: sessionsLoading } = useUserSessions();
  const { data: userGoals, isLoading: goalsLoading } = useUserGoals();

  const completedGoals = userGoals?.filter(goal => goal.status === 'completed').length || 0;
  const recentSessions = userSessions?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-therapy-500 to-calm-500 text-white font-bold text-2xl flex items-center justify-center">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">Your Profile</CardTitle>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Member since</p>
                <p className="font-medium">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Activity className="h-6 w-6 text-therapy-600" />
              </div>
              <p className="text-2xl font-bold text-therapy-700">
                {statsLoading ? '...' : userStats?.totalSessions || 0}
              </p>
              <p className="text-sm text-gray-600">Total Sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-700">
                {goalsLoading ? '...' : completedGoals}
              </p>
              <p className="text-sm text-gray-600">Goals Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {statsLoading ? '...' : userStats?.currentStreak || 0}
              </p>
              <p className="text-sm text-gray-600">Current Streak</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-700">
                {statsLoading ? '...' : (userStats?.averageMood?.toFixed(1) || 'N/A')}
              </p>
              <p className="text-sm text-gray-600">Avg Mood</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-therapy-600 mx-auto mb-2"></div>
                Loading sessions...
              </div>
            ) : recentSessions.length > 0 ? (
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-therapy-25 rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{session.sessionType} Session</p>
                      <p className="text-sm text-gray-600">
                        {new Date(session.createdAt).toLocaleDateString()} • {session.durationMinutes} minutes
                      </p>
                    </div>
                    <div className="text-right">
                      {session.moodBefore && session.moodAfter && (
                        <p className="text-sm">
                          Mood: {session.moodBefore} → {session.moodAfter}
                        </p>
                      )}
                      <p className={`text-xs px-2 py-1 rounded ${
                        session.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.completed ? 'Completed' : 'In Progress'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sessions yet. Start your therapy journey today!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9">
            <TabsTrigger value="account" className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="session" className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Sessions</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center space-x-1">
              <Headphones className="h-4 w-4" />
              <span className="hidden sm:inline">Audio</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center space-x-1">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-1">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center space-x-1">
              <Accessibility className="h-4 w-4" />
              <span className="hidden sm:inline">Accessibility</span>
            </TabsTrigger>
            <TabsTrigger value="personalization" className="flex items-center space-x-1">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">AI</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center space-x-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <EnhancedAccountSettings />
          </TabsContent>

          <TabsContent value="session" className="space-y-6">
            <SessionSettings />
          </TabsContent>

          <TabsContent value="audio" className="space-y-6">
            <AudioSettings />
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            <RealBillingHistory />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <PrivacySettings />
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            <AccessibilitySettings />
          </TabsContent>

          <TabsContent value="personalization" className="space-y-6">
            <PersonalizationSettings />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <AdvancedSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
