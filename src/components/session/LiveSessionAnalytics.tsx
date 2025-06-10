
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Heart, Brain, MessageSquare, Clock } from 'lucide-react';

interface LiveMetric {
  timestamp: Date;
  emotionalState: number;
  engagementLevel: number;
  responseTime: number;
  sentimentScore: number;
}

const LiveSessionAnalytics = () => {
  const [metrics, setMetrics] = useState<LiveMetric[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    averageEmotionalState: 7.2,
    peakEngagement: 94,
    averageResponseTime: 3.2,
    sentimentTrend: 'positive'
  });

  useEffect(() => {
    // Simulate live metrics collection
    const interval = setInterval(() => {
      const newMetric: LiveMetric = {
        timestamp: new Date(),
        emotionalState: Math.random() * 3 + 6, // 6-9 range
        engagementLevel: Math.random() * 20 + 70, // 70-90 range
        responseTime: Math.random() * 2 + 2, // 2-4 seconds
        sentimentScore: Math.random() * 2 + 6 // 6-8 range
      };

      setMetrics(prev => {
        const updated = [...prev, newMetric];
        return updated.slice(-20); // Keep last 20 data points
      });

      // Update current metrics
      setCurrentMetrics(prev => ({
        ...prev,
        averageEmotionalState: newMetric.emotionalState,
        peakEngagement: Math.max(prev.peakEngagement, newMetric.engagementLevel)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const chartData = metrics.map((metric, index) => ({
    time: index,
    emotional: metric.emotionalState,
    engagement: metric.engagementLevel,
    sentiment: metric.sentimentScore
  }));

  return (
    <div className="space-y-6">
      {/* Live Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Emotional State</p>
                <p className="text-2xl font-bold">{currentMetrics.averageEmotionalState.toFixed(1)}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">Improving</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Peak Engagement</p>
                <p className="text-2xl font-bold">{currentMetrics.peakEngagement.toFixed(0)}%</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">High engagement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">{currentMetrics.averageResponseTime.toFixed(1)}s</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-muted-foreground">Optimal range</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sentiment Trend</p>
                <p className="text-2xl font-bold capitalize">{currentMetrics.sentimentTrend}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">Trending up</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Emotional State Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="emotional" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Emotional State"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement & Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="engagement" 
                  stackId="1"
                  stroke="#8b5cf6" 
                  fill="#8b5cf6"
                  name="Engagement %"
                />
                <Area 
                  type="monotone" 
                  dataKey="sentiment" 
                  stackId="2"
                  stroke="#10b981" 
                  fill="#10b981"
                  name="Sentiment Score"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Live AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Emotional Stability Detected</p>
                <p className="text-sm text-blue-700">The user is showing consistent emotional regulation patterns. Consider introducing more challenging therapeutic techniques.</p>
                <p className="text-xs text-blue-600 mt-1">Confidence: 87%</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">High Engagement Period</p>
                <p className="text-sm text-green-700">User engagement has been consistently high for the past 5 minutes. This is an optimal time for deeper exploration.</p>
                <p className="text-xs text-green-600 mt-1">Suggested action: Explore root causes</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <MessageSquare className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium text-purple-900">Communication Pattern Analysis</p>
                <p className="text-sm text-purple-700">Response patterns indicate readiness for cognitive restructuring exercises.</p>
                <p className="text-xs text-purple-600 mt-1">Recommended technique: Thought challenging</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveSessionAnalytics;
