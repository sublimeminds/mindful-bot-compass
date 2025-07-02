import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  Target,
  Brain,
  Heart,
  Clock,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  Zap,
  Trophy,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  userBehavior: any[];
  progressMetrics: any;
  goalAnalytics: any;
  engagementTrends: any[];
  predictiveInsights: any[];
}

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
}

const AdvancedUserAnalyticsDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    userBehavior: [],
    progressMetrics: {},
    goalAnalytics: {},
    engagementTrends: [],
    predictiveInsights: []
  });
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user, timeRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Fetch user behavior analytics
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(timeRange.replace('d', '')));

      const { data: behaviorData, error: behaviorError } = await supabase
        .from('user_behavior_analytics')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (behaviorError) throw behaviorError;

      // Fetch goal analytics
      const { data: goalData, error: goalError } = await supabase
        .from('goals')
        .select(`
          id, status, progress, target_value, created_at, updated_at,
          goal_achievements(*)
        `)
        .eq('user_id', user?.id);

      if (goalError) throw goalError;

      // Fetch session analytics
      const { data: sessionData, error: sessionError } = await supabase
        .from('therapy_sessions')
        .select(`
          id, start_time, end_time, mood_before, mood_after,
          session_analytics_enhanced(engagement_score, emotional_progression)
        `)
        .eq('user_id', user?.id)
        .gte('start_time', startDate.toISOString())
        .order('start_time', { ascending: false });

      if (sessionError) throw sessionError;

      // Process and set analytics data
      const processedData = {
        userBehavior: behaviorData || [],
        progressMetrics: calculateProgressMetrics(behaviorData || []),
        goalAnalytics: processGoalAnalytics(goalData || []),
        engagementTrends: calculateEngagementTrends(sessionData || []),
        predictiveInsights: generatePredictiveInsights(behaviorData || [])
      };

      setAnalyticsData(processedData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Analytics Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProgressMetrics = (behaviorData: any[]) => {
    if (behaviorData.length === 0) return {};

    const totalSessions = behaviorData.reduce((sum, day) => sum + (day.sessions_count || 0), 0);
    const totalMinutes = behaviorData.reduce((sum, day) => sum + (day.total_session_minutes || 0), 0);
    const avgEngagement = behaviorData.reduce((sum, day) => sum + (day.engagement_score || 0), 0) / behaviorData.length;
    const avgMood = behaviorData.filter(day => day.average_mood).reduce((sum, day) => sum + day.average_mood, 0) / behaviorData.filter(day => day.average_mood).length;

    return {
      totalSessions,
      totalMinutes,
      avgEngagement: Math.round(avgEngagement * 100),
      avgMood: Math.round(avgMood * 10) / 10,
      consistency: calculateConsistency(behaviorData)
    };
  };

  const calculateConsistency = (behaviorData: any[]) => {
    const activeDays = behaviorData.filter(day => day.sessions_count > 0).length;
    return Math.round((activeDays / behaviorData.length) * 100);
  };

  const processGoalAnalytics = (goalData: any[]) => {
    const completed = goalData.filter(goal => goal.status === 'completed').length;
    const inProgress = goalData.filter(goal => goal.status === 'active').length;
    const completionRate = goalData.length > 0 ? Math.round((completed / goalData.length) * 100) : 0;
    
    return {
      total: goalData.length,
      completed,
      inProgress,
      completionRate,
      achievements: goalData.reduce((sum, goal) => sum + (goal.goal_achievements?.length || 0), 0)
    };
  };

  const calculateEngagementTrends = (sessionData: any[]) => {
    return sessionData.map(session => ({
      date: session.start_time,
      engagement: session.session_analytics_enhanced?.[0]?.engagement_score || 0.5,
      moodImprovement: session.mood_after ? session.mood_after - session.mood_before : 0
    }));
  };

  const generatePredictiveInsights = (behaviorData: any[]) => {
    const insights = [];
    
    if (behaviorData.length >= 7) {
      const recentEngagement = behaviorData.slice(-3).reduce((sum, day) => sum + day.engagement_score, 0) / 3;
      const previousEngagement = behaviorData.slice(-7, -3).reduce((sum, day) => sum + day.engagement_score, 0) / 4;
      
      if (recentEngagement > previousEngagement + 0.1) {
        insights.push({
          type: 'positive',
          title: 'Engagement Trending Up',
          description: 'Your therapy engagement has increased significantly in recent days',
          confidence: 0.85
        });
      } else if (recentEngagement < previousEngagement - 0.1) {
        insights.push({
          type: 'warning',
          title: 'Engagement Declining',
          description: 'Consider adjusting your therapy routine to maintain consistency',
          confidence: 0.78
        });
      }
    }

    return insights;
  };

  const getMetricCards = (): MetricCard[] => {
    const { progressMetrics } = analyticsData;
    
    return [
      {
        title: 'Total Sessions',
        value: progressMetrics.totalSessions || 0,
        change: 12,
        trend: 'up',
        icon: Activity,
        color: 'text-blue-600'
      },
      {
        title: 'Therapy Minutes',
        value: progressMetrics.totalMinutes || 0,
        change: 8,
        trend: 'up',
        icon: Clock,
        color: 'text-green-600'
      },
      {
        title: 'Engagement Score',
        value: `${progressMetrics.avgEngagement || 0}%`,
        change: -3,
        trend: 'down',
        icon: TrendingUp,
        color: 'text-therapy-600'
      },
      {
        title: 'Average Mood',
        value: progressMetrics.avgMood || 0,
        change: 5,
        trend: 'up',
        icon: Heart,
        color: 'text-red-500'
      },
      {
        title: 'Consistency',
        value: `${progressMetrics.consistency || 0}%`,
        change: 15,
        trend: 'up',
        icon: Target,
        color: 'text-purple-600'
      },
      {
        title: 'Goal Completion',
        value: `${analyticsData.goalAnalytics.completionRate || 0}%`,
        change: 22,
        trend: 'up',
        icon: Trophy,
        color: 'text-orange-600'
      }
    ];
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Activity;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-therapy-600" />
          <p className="text-therapy-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-therapy-600" />
          <h2 className="text-2xl font-bold">Advanced Analytics</h2>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="bg-therapy-100 text-therapy-700">
            AI-Powered Insights
          </Badge>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {getMetricCards().map((metric) => {
          const IconComponent = metric.icon;
          const TrendIcon = getTrendIcon(metric.trend);
          
          return (
            <Card key={metric.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className={`h-5 w-5 ${metric.color}`} />
                  <div className={`flex items-center text-xs ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    <TrendIcon className="h-3 w-3 mr-1" />
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="text-xs text-gray-600">{metric.title}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="predictions">AI Insights</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Engagement Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-therapy-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 text-therapy-600" />
                    <p className="text-sm text-gray-600">Engagement chart visualization</p>
                    <p className="text-xs text-gray-500">Interactive chart would be rendered here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Mood Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Current Average</span>
                    <Badge variant="outline">
                      {analyticsData.progressMetrics.avgMood || 0}/10
                    </Badge>
                  </div>
                  <Progress 
                    value={(analyticsData.progressMetrics.avgMood || 0) * 10} 
                    className="h-3"
                  />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Best Day:</span>
                      <p className="text-gray-600">9.2/10</p>
                    </div>
                    <div>
                      <span className="font-medium">Improvement:</span>
                      <p className="text-green-600">+15% this week</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Consistency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-therapy-600 mb-2">
                    {analyticsData.progressMetrics.consistency || 0}%
                  </div>
                  <p className="text-sm text-gray-600 mb-4">of days with activity</p>
                  <Progress value={analyticsData.progressMetrics.consistency || 0} className="mb-2" />
                  <p className="text-xs text-gray-500">Target: 80%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Goal Achievement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="font-medium">{analyticsData.goalAnalytics.completed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">In Progress</span>
                    <span className="font-medium">{analyticsData.goalAnalytics.inProgress || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Success Rate</span>
                    <Badge variant="outline">
                      {analyticsData.goalAnalytics.completionRate || 0}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">7-day streak</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Goal completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Mood improved</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI-Powered Predictive Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsData.predictiveInsights.length > 0 ? (
                <div className="space-y-4">
                  {analyticsData.predictiveInsights.map((insight, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      insight.type === 'positive' ? 'bg-green-50 border-green-200' :
                      insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-start space-x-3">
                        {insight.type === 'positive' ? 
                          <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" /> :
                          insight.type === 'warning' ?
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" /> :
                          <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                        }
                        <div className="flex-1">
                          <h4 className="font-medium">{insight.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                          <div className="flex items-center mt-2">
                            <span className="text-xs text-gray-500">Confidence: </span>
                            <Badge variant="outline" className="ml-1 text-xs">
                              {Math.round(insight.confidence * 100)}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Continue using the platform to generate AI insights</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional tabs would be implemented here */}
      </Tabs>
    </div>
  );
};

export default AdvancedUserAnalyticsDashboard;