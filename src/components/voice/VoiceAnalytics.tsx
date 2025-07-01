
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Mic, Volume2 } from 'lucide-react';

const VoiceAnalytics = () => {
  const emotionData = [
    { emotion: 'Calm', value: 35, color: '#22c55e' },
    { emotion: 'Anxious', value: 25, color: '#f59e0b' },
    { emotion: 'Sad', value: 15, color: '#3b82f6' },
    { emotion: 'Happy', value: 20, color: '#8b5cf6' },
    { emotion: 'Neutral', value: 5, color: '#6b7280' }
  ];

  const sessionMetrics = {
    totalSessions: 12,
    averageLength: 25,
    voiceUsage: 80,
    emotionalProgress: 65
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Voice Analytics
        </h3>
        <Badge variant="outline">Last 30 days</Badge>
      </div>
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{sessionMetrics.totalSessions}</p>
              </div>
              <Mic className="h-8 w-8 text-therapy-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Length</p>
                <p className="text-2xl font-bold">{sessionMetrics.averageLength}m</p>
              </div>
              <Volume2 className="h-8 w-8 text-therapy-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Voice Usage Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Voice Feature Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Voice Responses</span>
                <span>{sessionMetrics.voiceUsage}%</span>
              </div>
              <Progress value={sessionMetrics.voiceUsage} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Emotional Progress</span>
                <span>{sessionMetrics.emotionalProgress}%</span>
              </div>
              <Progress value={sessionMetrics.emotionalProgress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Emotion Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Emotion Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emotionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="emotion" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              You've shown increased calmness in recent sessions
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Voice responses help improve engagement by 40%
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Consistent session length indicates good routine
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAnalytics;
