
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { TrendingUp, Target, Award, Calendar, Brain, Heart, CheckCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';

const Progress = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30');

  useSafeSEO({
    title: 'Progress Tracking - TherapySync',
    description: 'Track your mental health progress and celebrate your achievements.',
    keywords: 'mental health progress, therapy goals, wellness tracking, recovery journey'
  });

  // Mock progress data
  const progressData = [
    { date: '2024-01-01', wellnessScore: 65, moodAverage: 6.2, sessionCount: 4 },
    { date: '2024-01-08', wellnessScore: 68, moodAverage: 6.5, sessionCount: 5 },
    { date: '2024-01-15', wellnessScore: 72, moodAverage: 6.8, sessionCount: 6 },
    { date: '2024-01-22', wellnessScore: 75, moodAverage: 7.1, sessionCount: 5 },
    { date: '2024-01-29', wellnessScore: 78, moodAverage: 7.4, sessionCount: 7 }
  ];

  const goals = [
    {
      id: '1',
      title: 'Daily Mood Tracking',
      description: 'Track mood consistently for 30 days',
      progress: 87,
      target: 30,
      current: 26,
      status: 'active',
      deadline: '2024-02-15'
    },
    {
      id: '2',
      title: 'Anxiety Reduction',
      description: 'Reduce average anxiety level below 4',
      progress: 75,
      target: 4,
      current: 3.2,
      status: 'completed',
      deadline: '2024-01-31'
    },
    {
      id: '3',
      title: 'Weekly Therapy Sessions',
      description: 'Complete 2 sessions per week',
      progress: 65,
      target: 8,
      current: 5,
      status: 'active',
      deadline: '2024-02-28'
    }
  ];

  const achievements = [
    {
      id: '1',
      title: 'First Session Complete',
      description: 'Completed your first therapy session',
      icon: '🎯',
      date: '2024-01-01',
      type: 'milestone'
    },
    {
      id: '2',
      title: '7-Day Streak',
      description: 'Logged mood for 7 consecutive days',
      icon: '🔥',
      date: '2024-01-08',
      type: 'streak'
    },
    {
      id: '3',
      title: 'Anxiety Champion',
      description: 'Reduced anxiety levels significantly',
      icon: '🏆',
      date: '2024-01-20',
      type: 'improvement'
    },
    {
      id: '4',
      title: '50 Sessions',
      description: 'Completed 50 therapy sessions',
      icon: '⭐',
      date: '2024-01-25',
      type: 'milestone'
    }
  ];

  const progressStats = {
    overallProgress: 78,
    weeklyImprovement: 12,
    goalsCompleted: 8,
    currentStreak: 26,
    totalSessions: 156,
    averageMood: 7.4
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold therapy-text-gradient">Progress Tracking</h1>
            <p className="text-slate-600 mt-2">Monitor your mental health journey and celebrate achievements</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="therapy-gradient-bg text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-therapy-100">Overall Progress</p>
                  <p className="text-3xl font-bold">{progressStats.overallProgress}%</p>
                  <p className="text-sm text-therapy-100">+{progressStats.weeklyImprovement}% this week</p>
                </div>
                <TrendingUp className="h-12 w-12 text-therapy-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Goals Completed</p>
                  <p className="text-3xl font-bold">{progressStats.goalsCompleted}</p>
                  <p className="text-sm text-green-100">This year</p>
                </div>
                <Target className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Current Streak</p>
                  <p className="text-3xl font-bold">{progressStats.currentStreak}</p>
                  <p className="text-sm text-orange-100">Days</p>
                </div>
                <Award className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Average Mood</p>
                  <p className="text-3xl font-bold">{progressStats.averageMood}/10</p>
                  <p className="text-sm text-blue-100">This month</p>
                </div>
                <Heart className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Progress Overview</TabsTrigger>
            <TabsTrigger value="goals">Goals & Milestones</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-therapy-600" />
                  Wellness Progress Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="wellnessScore"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.3}
                      name="Wellness Score"
                    />
                    <Area
                      type="monotone"
                      dataKey="moodAverage"
                      stroke="#06B6D4"
                      fill="#06B6D4"
                      fillOpacity={0.3}
                      name="Mood Average"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid gap-6">
              {goals.map((goal) => (
                <Card key={goal.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{goal.title}</h3>
                          <Badge className={
                            goal.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }>
                            {goal.status === 'completed' ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Active
                              </>
                            )}
                          </Badge>
                        </div>
                        <p className="text-slate-600 mb-3">{goal.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span>Progress: {goal.current}/{goal.target}</span>
                          <span>•</span>
                          <span>Deadline: {goal.deadline}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold therapy-text-gradient">
                          {goal.progress}%
                        </div>
                      </div>
                    </div>
                    <ProgressBar value={goal.progress} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{achievement.title}</h3>
                        <p className="text-slate-600 mb-2">{achievement.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {achievement.type}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {achievement.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default Progress;
