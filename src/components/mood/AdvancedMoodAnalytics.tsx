
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Brain, Heart, AlertTriangle, Calendar, Target } from 'lucide-react';
import { MoodTrackingService } from '@/services/moodTrackingService';
import { useAuth } from '@/contexts/AuthContext';

const AdvancedMoodAnalytics = () => {
  const { user } = useAuth();
  const [moodData, setMoodData] = useState([]);
  const [patterns, setPatterns] = useState(null);
  const [insights, setInsights] = useState([]);
  const [correlations, setCorrelations] = useState([]);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    if (user) {
      loadMoodData();
    }
  }, [user, timeRange]);

  const loadMoodData = async () => {
    try {
      const entries = await MoodTrackingService.getMoodEntries(user.id);
      setMoodData(entries);
      
      const analysisPatterns = MoodTrackingService.analyzeMoodPatterns(entries);
      setPatterns(analysisPatterns);
      
      const generatedInsights = MoodTrackingService.generateMoodInsights(entries);
      setInsights(generatedInsights);
      
      const moodCorrelations = MoodTrackingService.generateMoodCorrelations(entries);
      setCorrelations(moodCorrelations);
    } catch (error) {
      console.error('Error loading mood data:', error);
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Brain className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Brain className="h-4 w-4 text-blue-600" />;
    }
  };

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (!patterns) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Mood</p>
                <p className="text-2xl font-bold">{patterns.averageMood}/10</p>
              </div>
              <Heart className="h-8 w-8 text-therapy-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Trend</p>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(patterns.trend)}
                  <span className="text-lg font-bold capitalize">{patterns.trend}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tracking Streak</p>
                <p className="text-2xl font-bold">{patterns.streak} days</p>
              </div>
              <Calendar className="h-8 w-8 text-calm-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Best Time</p>
                <p className="text-lg font-bold">{patterns.bestTime}</p>
              </div>
              <Target className="h-8 w-8 text-focus-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Selector */}
      <div className="flex space-x-2">
        {['7d', '30d', '90d', '1y'].map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '3 Months' : '1 Year'}
          </Button>
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Mood Trends</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mood Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis domain={[1, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="overall" stroke="hsl(var(--therapy-500))" strokeWidth={2} name="Overall" />
                    <Line type="monotone" dataKey="energy" stroke="hsl(var(--calm-500))" strokeWidth={2} name="Energy" />
                    <Line type="monotone" dataKey="anxiety" stroke="hsl(var(--focus-500))" strokeWidth={2} strokeDasharray="5 5" name="Anxiety" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Time-of-Day Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Best Time</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {patterns.bestTime}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="font-medium">Challenging Time</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      {patterns.worstTime}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mood Stability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Variability Score</span>
                    <span className="font-bold">{patterns.moodVariability.toFixed(1)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${patterns.moodVariability < 1.5 ? 'bg-green-500' : patterns.moodVariability < 2.5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min((patterns.moodVariability / 4) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {patterns.moodVariability < 1.5 ? 'Very stable mood patterns' : 
                     patterns.moodVariability < 2.5 ? 'Moderately stable mood patterns' : 
                     'Variable mood patterns - consider professional support'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="correlations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Impact on Mood</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {correlations.slice(0, 5).map((correlation, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{correlation.activity}</span>
                      <p className="text-sm text-muted-foreground">{correlation.occurrences} occurrences</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${correlation.impact > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className={`font-bold ${correlation.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {correlation.impact > 0 ? '+' : ''}{(correlation.impact * 10).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <Card key={index} className={`${insight.type === 'positive' ? 'border-green-200' : insight.type === 'warning' ? 'border-orange-200' : 'border-blue-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{insight.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(insight.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedMoodAnalytics;
