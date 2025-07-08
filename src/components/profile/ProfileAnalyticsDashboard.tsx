import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3,
  TrendingUp,
  Calendar,
  Target,
  Brain,
  Heart,
  Activity,
  Award,
  Download,
  Share2,
  Sparkles,
  LineChart,
  PieChart
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

interface AnalyticsData {
  progressOverTime: any[];
  moodTrends: any[];
  goalCompletion: any[];
  sessionEffectiveness: any[];
  therapeuticBreakthroughs: any[];
  personalityEvolution: any[];
}

const ProfileAnalyticsDashboard = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('3months');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      if (!user) return;
      
      try {
        // Generate mock analytics data
        const generateData = () => {
          const dates = [];
          const today = new Date();
          for (let i = 90; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split('T')[0]);
          }

          return {
            progressOverTime: dates.map((date, index) => ({
              date,
              overall: 40 + (index * 0.6) + Math.random() * 10,
              anxiety: 7 - (index * 0.02) + Math.random() * 2,
              depression: 6 - (index * 0.03) + Math.random() * 1.5,
              stress: 8 - (index * 0.025) + Math.random() * 2,
              confidence: 4 + (index * 0.04) + Math.random() * 1
            })),
            
            moodTrends: dates.slice(-30).map((date, index) => ({
              date,
              mood: 5.5 + (index * 0.1) + Math.random() * 2,
              energy: 6 + (index * 0.08) + Math.random() * 1.5,
              sleep: 6.5 + (index * 0.05) + Math.random() * 1,
              motivation: 5.8 + (index * 0.12) + Math.random() * 1.8
            })),
            
            goalCompletion: [
              { category: 'Anxiety Management', completed: 8, total: 10, percentage: 80 },
              { category: 'Social Skills', completed: 5, total: 8, percentage: 62.5 },
              { category: 'Sleep Health', completed: 7, total: 7, percentage: 100 },
              { category: 'Work-Life Balance', completed: 4, total: 9, percentage: 44.4 },
              { category: 'Self-Confidence', completed: 6, total: 12, percentage: 50 }
            ],
            
            sessionEffectiveness: dates.slice(-20).map((date, index) => ({
              date,
              session: index + 1,
              effectiveness: 6.5 + (index * 0.15) + Math.random() * 1.5,
              engagement: 7 + (index * 0.1) + Math.random() * 1,
              satisfaction: 7.2 + (index * 0.12) + Math.random() * 0.8,
              therapist: index % 2 === 0 ? 'Dr. Sarah Chen' : 'Dr. Maya Patel'
            })),
            
            therapeuticBreakthroughs: [
              { 
                date: '2024-06-15', 
                title: 'First Emotional Vulnerability', 
                impact: 95, 
                category: 'Trust Building',
                description: 'Shared childhood trauma for the first time'
              },
              { 
                date: '2024-06-22', 
                title: 'Cultural Identity Integration', 
                impact: 88, 
                category: 'Identity',
                description: 'Reconciled personal goals with family expectations'
              },
              { 
                date: '2024-06-28', 
                title: 'Anxiety Coping Mastery', 
                impact: 82, 
                category: 'Coping Skills',
                description: 'Successfully used techniques in high-stress situation'
              },
              { 
                date: '2024-07-03', 
                title: 'Communication Breakthrough', 
                impact: 90, 
                category: 'Communication',
                description: 'Expressed needs clearly in conflict situation'
              }
            ],
            
            personalityEvolution: [
              { trait: 'Openness', initial: 65, current: 85, change: 20 },
              { trait: 'Emotional Stability', initial: 45, current: 72, change: 27 },
              { trait: 'Assertiveness', initial: 35, current: 68, change: 33 },
              { trait: 'Social Confidence', initial: 40, current: 63, change: 23 },
              { trait: 'Self-Compassion', initial: 50, current: 78, change: 28 }
            ]
          };
        };

        setAnalyticsData(generateData());
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [user, selectedTimeframe]);

  const exportData = () => {
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `therapeutic-progress-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  if (loading || !analyticsData) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-therapy-600" />
                <span>Therapeutic Progress Analytics</span>
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Deep insights into your mental health journey and therapeutic outcomes
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="breakthroughs">Breakthroughs</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="personality">Personality</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-therapy-600" />
                <div className="text-2xl font-bold text-therapy-600">
                  {analyticsData.progressOverTime[analyticsData.progressOverTime.length - 1]?.overall.toFixed(0)}%
                </div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="h-6 w-6 mx-auto mb-2 text-harmony-600" />
                <div className="text-2xl font-bold text-harmony-600">
                  {analyticsData.moodTrends[analyticsData.moodTrends.length - 1]?.mood.toFixed(1)}/10
                </div>
                <p className="text-sm text-muted-foreground">Current Mood</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-flow-600" />
                <div className="text-2xl font-bold text-flow-600">
                  {analyticsData.goalCompletion.reduce((sum, goal) => sum + goal.completed, 0)}/
                  {analyticsData.goalCompletion.reduce((sum, goal) => sum + goal.total, 0)}
                </div>
                <p className="text-sm text-muted-foreground">Goals Completed</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Sparkles className="h-6 w-6 mx-auto mb-2 text-calm-600" />
                <div className="text-2xl font-bold text-calm-600">
                  {analyticsData.therapeuticBreakthroughs.length}
                </div>
                <p className="text-sm text-muted-foreground">Breakthroughs</p>
              </CardContent>
            </Card>
          </div>

          {/* Overall Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Progress Trend</CardTitle>
              <p className="text-muted-foreground">Your therapeutic progress over the last 3 months</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={analyticsData.progressOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{fontSize: 12}} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="overall" stroke="#8b5cf6" strokeWidth={3} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Session Effectiveness */}
          <Card>
            <CardHeader>
              <CardTitle>Session Effectiveness</CardTitle>
              <p className="text-muted-foreground">How effective your recent therapy sessions have been</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.sessionEffectiveness}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="effectiveness" fill="#06b6d4" />
                  <Bar dataKey="engagement" fill="#10b981" />
                  <Bar dataKey="satisfaction" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {/* Mood Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Mood & Energy Tracking</CardTitle>
              <p className="text-muted-foreground">Track your emotional well-being patterns</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsLineChart data={analyticsData.moodTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{fontSize: 12}} />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={2} name="Mood" />
                  <Line type="monotone" dataKey="energy" stroke="#06b6d4" strokeWidth={2} name="Energy" />
                  <Line type="monotone" dataKey="sleep" stroke="#10b981" strokeWidth={2} name="Sleep Quality" />
                  <Line type="monotone" dataKey="motivation" stroke="#f59e0b" strokeWidth={2} name="Motivation" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Symptom Reduction */}
          <Card>
            <CardHeader>
              <CardTitle>Symptom Reduction Over Time</CardTitle>
              <p className="text-muted-foreground">Track how your symptoms have improved with therapy</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={analyticsData.progressOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{fontSize: 12}} />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="anxiety" stroke="#ef4444" strokeWidth={2} name="Anxiety" />
                  <Line type="monotone" dataKey="depression" stroke="#8b5cf6" strokeWidth={2} name="Depression" />
                  <Line type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} name="Stress" />
                  <Line type="monotone" dataKey="confidence" stroke="#10b981" strokeWidth={2} name="Confidence" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakthroughs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Therapeutic Breakthroughs Timeline</CardTitle>
              <p className="text-muted-foreground">Key moments of insight and progress in your journey</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsData.therapeuticBreakthroughs.map((breakthrough, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <div className="w-4 h-4 bg-therapy-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{breakthrough.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{breakthrough.category}</Badge>
                        <Badge className="bg-therapy-100 text-therapy-700">
                          {breakthrough.impact}% impact
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{breakthrough.description}</p>
                    <p className="text-xs text-gray-500">{breakthrough.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Goal Completion Analysis</CardTitle>
              <p className="text-muted-foreground">Progress breakdown by therapeutic goal categories</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsData.goalCompletion.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{goal.category}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {goal.completed}/{goal.total}
                      </span>
                      <Badge variant={goal.percentage > 75 ? 'default' : goal.percentage > 50 ? 'secondary' : 'outline'}>
                        {goal.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={goal.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personality Evolution</CardTitle>
              <p className="text-muted-foreground">How your personality traits have evolved through therapy</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsData.personalityEvolution.map((trait, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{trait.trait}</h4>
                    <Badge className={trait.change > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {trait.change > 0 ? '+' : ''}{trait.change} points
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Initial Score</p>
                      <div className="flex items-center space-x-2">
                        <Progress value={trait.initial} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{trait.initial}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Score</p>
                      <div className="flex items-center space-x-2">
                        <Progress value={trait.current} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{trait.current}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {trait.change > 0 ? 'Improved' : 'Stable'} by {Math.abs(trait.change)} points
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileAnalyticsDashboard;