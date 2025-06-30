
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Brain, Heart, Calendar, Target, Award, AlertTriangle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';

const Analytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('mood');

  useSafeSEO({
    title: 'Mental Health Analytics - TherapySync Dashboard',
    description: 'Track your mental health progress with comprehensive analytics and insights.',
    keywords: 'mental health analytics, therapy progress, mood tracking, wellness insights'
  });

  // Mock data - in real app, this would come from your analytics service
  const moodData = [
    { date: '2024-01-01', mood: 6, anxiety: 4, stress: 5, energy: 7, sleep: 8 },
    { date: '2024-01-02', mood: 7, anxiety: 3, stress: 4, energy: 8, sleep: 7 },
    { date: '2024-01-03', mood: 5, anxiety: 6, stress: 7, energy: 5, sleep: 6 },
    { date: '2024-01-04', mood: 8, anxiety: 2, stress: 3, energy: 9, sleep: 8 },
    { date: '2024-01-05', mood: 7, anxiety: 3, stress: 4, energy: 8, sleep: 7 },
    { date: '2024-01-06', mood: 6, anxiety: 4, stress: 5, energy: 6, sleep: 7 },
    { date: '2024-01-07', mood: 9, anxiety: 2, stress: 2, energy: 9, sleep: 9 }
  ];

  const sessionStats = [
    { month: 'Dec', sessions: 12, effectiveness: 85, duration: 45 },
    { month: 'Jan', sessions: 18, effectiveness: 88, duration: 48 },
    { month: 'Feb', sessions: 15, effectiveness: 92, duration: 52 },
    { month: 'Mar', sessions: 22, effectiveness: 89, duration: 47 },
    { month: 'Apr', sessions: 20, effectiveness: 94, duration: 55 },
    { month: 'May', sessions: 25, effectiveness: 91, duration: 50 },
    { month: 'Jun', sessions: 28, effectiveness: 96, duration: 58 }
  ];

  const therapyTechniques = [
    { name: 'CBT', sessions: 45, effectiveness: 92, color: '#8B5CF6' },
    { name: 'Mindfulness', sessions: 38, effectiveness: 89, color: '#06B6D4' },
    { name: 'DBT', sessions: 25, effectiveness: 87, color: '#F59E0B' },
    { name: 'Solution-Focused', sessions: 32, effectiveness: 85, color: '#EF4444' },
    { name: 'Psychodynamic', sessions: 18, effectiveness: 83, color: '#10B981' }
  ];

  const wellnessMetrics = {
    currentMood: 7.8,
    moodTrend: '+12%',
    weeklyAverage: 7.2,
    totalSessions: 156,
    longestStreak: 23,
    completedGoals: 8,
    crisisEvents: 0,
    overallProgress: 89
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
            <h1 className="text-3xl font-bold therapy-text-gradient">Mental Health Analytics</h1>
            <p className="text-slate-600 mt-2">Track your progress and gain insights into your mental wellness journey</p>
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
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="therapy-gradient-bg text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-therapy-100">Current Mood</p>
                  <p className="text-3xl font-bold">{wellnessMetrics.currentMood}/10</p>
                  <p className="text-sm text-therapy-100">
                    {wellnessMetrics.moodTrend} this week
                  </p>
                </div>
                <Heart className="h-12 w-12 text-therapy-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Sessions</p>
                  <p className="text-3xl font-bold">{wellnessMetrics.totalSessions}</p>
                  <p className="text-sm text-blue-100">This year</p>
                </div>
                <Brain className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Completed Goals</p>
                  <p className="text-3xl font-bold">{wellnessMetrics.completedGoals}</p>
                  <p className="text-sm text-green-100">Out of 12 set</p>
                </div>
                <Target className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Progress Score</p>
                  <p className="text-3xl font-bold">{wellnessMetrics.overallProgress}%</p>
                  <p className="text-sm text-orange-100">Overall wellness</p>
                </div>
                <TrendingUp className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="mood" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="mood">Mood Tracking</TabsTrigger>
            <TabsTrigger value="sessions">Session Analytics</TabsTrigger>
            <TabsTrigger value="techniques">Technique Effectiveness</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="mood" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-therapy-600" />
                  Mood Trends Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="mood" stroke="#8B5CF6" strokeWidth={3} name="Mood" />
                    <Line type="monotone" dataKey="anxiety" stroke="#EF4444" strokeWidth={2} name="Anxiety" />
                    <Line type="monotone" dataKey="stress" stroke="#F59E0B" strokeWidth={2} name="Stress" />
                    <Line type="monotone" dataKey="energy" stroke="#10B981" strokeWidth={2} name="Energy" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Mood Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Excellent (8-10)', value: 35, fill: '#10B981' },
                          { name: 'Good (6-7)', value: 40, fill: '#06B6D4' },
                          { name: 'Fair (4-5)', value: 20, fill: '#F59E0B' },
                          { name: 'Poor (1-3)', value: 5, fill: '#EF4444' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mood Patterns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Best Day</span>
                    <Badge className="bg-green-100 text-green-800">Sunday</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Most Challenging Day</span>
                    <Badge className="bg-red-100 text-red-800">Monday</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Best Time</span>
                    <Badge className="bg-blue-100 text-blue-800">Morning</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Improvement Trend</span>
                    <Badge className="bg-green-100 text-green-800">+15% this month</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-therapy-600" />
                  Session Activity & Effectiveness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={sessionStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sessions" fill="#8B5CF6" name="Sessions" />
                    <Bar yAxisId="right" dataKey="effectiveness" fill="#06B6D4" name="Effectiveness %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Session Streaks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-therapy-600">{wellnessMetrics.longestStreak}</div>
                    <div className="text-sm text-slate-600">Longest Streak (Days)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">7</div>
                    <div className="text-sm text-slate-600">Current Streak</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Session Quality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg. Duration</span>
                    <span className="font-semibold">52 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completion Rate</span>
                    <span className="font-semibold">96%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Satisfaction</span>
                    <span className="font-semibold">4.8/5</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Peak Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Most Active Hour</span>
                    <Badge>7-8 PM</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Preferred Day</span>
                    <Badge>Wednesday</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Session Type</span>
                    <Badge>Voice Chat</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="techniques" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-therapy-600" />
                  Therapy Technique Effectiveness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {therapyTechniques.map((technique) => (
                    <div key={technique.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{technique.name}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-slate-600">{technique.sessions} sessions</span>
                          <Badge className="bg-green-100 text-green-800">
                            {technique.effectiveness}% effective
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${technique.effectiveness}%`,
                            backgroundColor: technique.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-r from-therapy-50 to-calm-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-therapy-700">
                    <Award className="h-5 w-5 mr-2" />
                    AI-Generated Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-therapy-200">
                    <h4 className="font-semibold text-therapy-700 mb-2">🎯 Progress Highlight</h4>
                    <p className="text-sm text-slate-700">
                      Your mood has improved by 15% this month, with particularly strong progress in anxiety management. 
                      CBT techniques are showing excellent results for you.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-therapy-200">
                    <h4 className="font-semibold text-therapy-700 mb-2">📈 Trend Analysis</h4>
                    <p className="text-sm text-slate-700">
                      You tend to have better sessions in the evening (7-8 PM) and on weekdays. 
                      Consider scheduling more sessions during these optimal times.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-therapy-200">
                    <h4 className="font-semibold text-therapy-700 mb-2">💡 Recommendation</h4>
                    <p className="text-sm text-slate-700">
                      Based on your progress, incorporating more mindfulness exercises could further enhance 
                      your emotional regulation skills.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-therapy-600" />
                    Upcoming Goals & Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-green-700">30-Day Streak Goal</h4>
                      <Badge className="bg-green-100 text-green-800">23/30 days</Badge>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '77%' }}></div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-blue-700">Anxiety Reduction</h4>
                      <Badge className="bg-blue-100 text-blue-800">Target: <5</Badge>
                    </div>
                    <p className="text-sm text-blue-600">Current average: 3.2/10 (Excellent!)</p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-orange-700">Sleep Quality</h4>
                      <Badge className="bg-orange-100 text-orange-800">Target: >7</Badge>
                    </div>
                    <p className="text-sm text-orange-600">Current average: 7.4/10 (On track!)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default Analytics;
