
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Clock, Brain, Target, TrendingUp, Zap, Calendar, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AITimingOptimizationService, OptimalTimingPrediction, UserEngagementPattern } from '@/services/aiTimingOptimizationService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const TimingOptimizationDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [patterns, setPatterns] = useState<UserEngagementPattern[]>([]);
  const [predictions, setPredictions] = useState<Record<string, OptimalTimingPrediction>>({});
  const [isOptimizationEnabled, setIsOptimizationEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Load user patterns
      const userPatterns = await AITimingOptimizationService.analyzeUserPatterns(user.id);
      setPatterns(userPatterns);

      // Generate predictions for different notification types
      const notificationTypes = ['session_reminder', 'mood_check', 'milestone_achieved', 'insight_generated'];
      const newPredictions: Record<string, OptimalTimingPrediction> = {};
      
      for (const type of notificationTypes) {
        const prediction = await AITimingOptimizationService.predictOptimalTiming(user.id, type);
        newPredictions[type] = prediction;
      }
      
      setPredictions(newPredictions);
    } catch (error) {
      console.error('Error loading timing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatEngagementData = () => {
    const hourlyData = patterns.reduce((acc, pattern) => {
      const hour = pattern.timeOfDay;
      if (!acc[hour]) {
        acc[hour] = { hour: `${hour}:00`, total: 0, count: 0 };
      }
      acc[hour].total += pattern.engagementScore;
      acc[hour].count += 1;
      return acc;
    }, {} as Record<number, any>);

    return Object.values(hourlyData).map((data: any) => ({
      ...data,
      engagement: data.count > 0 ? (data.total / data.count * 100).toFixed(1) : 0
    }));
  };

  const formatDayData = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyData = patterns.reduce((acc, pattern) => {
      const day = pattern.dayOfWeek;
      if (!acc[day]) {
        acc[day] = { day: dayNames[day], total: 0, count: 0 };
      }
      acc[day].total += pattern.engagementScore;
      acc[day].count += 1;
      return acc;
    }, {} as Record<number, any>);

    return Object.values(dailyData).map((data: any) => ({
      ...data,
      engagement: data.count > 0 ? (data.total / data.count * 100).toFixed(1) : 0
    }));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'session_reminder': return <Calendar className="h-4 w-4" />;
      case 'mood_check': return <Target className="h-4 w-4" />;
      case 'milestone_achieved': return <TrendingUp className="h-4 w-4" />;
      case 'insight_generated': return <Brain className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const formatTypeName = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Please sign in to view timing optimization</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Timing Optimization</h2>
          <p className="text-muted-foreground">Personalize notification timing based on your engagement patterns</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">AI Optimization:</label>
            <Switch
              checked={isOptimizationEnabled}
              onCheckedChange={setIsOptimizationEnabled}
            />
          </div>
          <Button onClick={loadData} disabled={isLoading} variant="outline">
            <Brain className="h-4 w-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{patterns.length}</p>
                <p className="text-sm text-muted-foreground">Data Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {patterns.length > 0 ? (patterns.reduce((sum, p) => sum + p.engagementScore, 0) / patterns.length * 100).toFixed(0) : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Avg Engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">
                  {patterns.length > 0 ? Math.round(patterns.reduce((sum, p) => sum + p.responseTime, 0) / patterns.length) : 0}m
                </p>
                <p className="text-sm text-muted-foreground">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {Object.values(predictions).filter(p => p.confidence > 0.7).length}
                </p>
                <p className="text-sm text-muted-foreground">High Confidence</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Engagement by Time of Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatEngagementData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Engagement']} />
                <Line type="monotone" dataKey="engagement" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement by Day of Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formatDayData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Engagement']} />
                <Bar dataKey="engagement" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>Optimal Timing Predictions</CardTitle>
          <p className="text-sm text-muted-foreground">
            AI-generated recommendations for when to send different types of notifications
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(predictions).map(([type, prediction]) => (
              <div key={type} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(type)}
                    <h4 className="font-medium">{formatTypeName(type)}</h4>
                  </div>
                  <Badge className={getConfidenceColor(prediction.confidence)}>
                    {Math.round(prediction.confidence * 100)}% confidence
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Recommended Time:</p>
                  <p className="font-medium">
                    {format(prediction.recommendedTime, 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">AI Reasoning:</p>
                  <p className="text-sm">{prediction.reasoning}</p>
                </div>

                {prediction.contextualFactors.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Contextual Factors:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {prediction.contextualFactors.map((factor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {prediction.alternativeTimes.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Alternative Times:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {prediction.alternativeTimes.slice(0, 3).map((time, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {format(time, 'HH:mm')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {patterns.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Building Your Profile</h3>
            <p className="text-muted-foreground mb-4">
              Interact with a few notifications to start building your personalized timing profile
            </p>
            <Badge variant="outline">AI will learn from your engagement patterns</Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TimingOptimizationDashboard;
