
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  User, Brain, Target, Activity, TrendingUp, Calendar,
  Award, Zap, Heart, Clock, MapPin, Globe
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboardingData } from '@/hooks/useOnboardingData';
import ProfileAnalytics from './ProfileAnalytics';
import ProgressTimeline from './ProgressTimeline';
import PersonalityInsights from './PersonalityInsights';

const EnhancedUserProfile = () => {
  const { user } = useAuth();
  const { onboardingData, isLoading } = useOnboardingData();
  const [profileStats, setProfileStats] = useState({
    totalSessions: 23,
    streakDays: 12,
    goalsCompleted: 7,
    overallProgress: 68,
    emotionalWellness: 75,
    therapyEngagement: 82
  });

  const achievements = [
    { name: "First Session", icon: "🎯", date: "2 weeks ago", type: "milestone" },
    { name: "7-Day Streak", icon: "🔥", date: "1 week ago", type: "consistency" },
    { name: "Emotion Master", icon: "❤️", date: "3 days ago", type: "skill" },
    { name: "Goal Setter", icon: "🎯", date: "1 day ago", type: "progress" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Profile Header */}
        <Card className="border-therapy-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-therapy-500 to-calm-500 text-white font-bold text-3xl flex items-center justify-center">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <CardTitle className="text-3xl mb-2">Your Mental Health Journey</CardTitle>
                  <p className="text-muted-foreground text-lg">{user?.email}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <Badge variant="default" className="bg-therapy-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {profileStats.streakDays} day streak
                    </Badge>
                    <Badge variant="outline">
                      <Award className="h-3 w-3 mr-1" />
                      {achievements.length} achievements
                    </Badge>
                    <Badge variant="outline">
                      <Target className="h-3 w-3 mr-1" />
                      {profileStats.goalsCompleted} goals completed
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-therapy-600">
                  {profileStats.overallProgress}%
                </div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-therapy-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Emotional Wellness</p>
                  <p className="text-2xl font-bold text-therapy-600">{profileStats.emotionalWellness}%</p>
                </div>
                <Heart className="h-8 w-8 text-therapy-500" />
              </div>
              <Progress value={profileStats.emotionalWellness} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="border-calm-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Therapy Engagement</p>
                  <p className="text-2xl font-bold text-calm-600">{profileStats.therapyEngagement}%</p>
                </div>
                <Brain className="h-8 w-8 text-calm-500" />
              </div>
              <Progress value={profileStats.therapyEngagement} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="border-flow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold text-flow-600">{profileStats.totalSessions}</p>
                </div>
                <Activity className="h-8 w-8 text-flow-500" />
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                This month: +12 sessions
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-therapy-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{achievement.icon}</span>
                          <div>
                            <p className="font-medium">{achievement.name}</p>
                            <p className="text-sm text-muted-foreground">{achievement.date}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {achievement.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Current Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Active Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {onboardingData?.goals?.slice(0, 3).map((goal, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{goal}</p>
                          <Badge variant="outline">Active</Badge>
                        </div>
                        <Progress value={Math.random() * 100} className="h-2" />
                      </div>
                    )) || (
                      <p className="text-muted-foreground">No goals set yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="onboarding" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Therapy Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {onboardingData?.goals?.map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-therapy-500" />
                        <span>{goal}</span>
                      </div>
                    )) || <p className="text-muted-foreground">No goals recorded</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Therapy Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {onboardingData?.preferences?.map((preference, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Brain className="h-4 w-4 text-calm-500" />
                        <span>{preference}</span>
                      </div>
                    )) || <p className="text-muted-foreground">No preferences recorded</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <ProfileAnalytics />
          </TabsContent>

          <TabsContent value="timeline">
            <ProgressTimeline />
          </TabsContent>

          <TabsContent value="insights">
            <PersonalityInsights onboardingData={onboardingData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedUserProfile;
