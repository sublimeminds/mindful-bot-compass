import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Zap, Target, Clock } from 'lucide-react';

const PerformanceMetrics = () => {
  const metrics = [
    {
      name: "Response Accuracy",
      value: 94,
      trend: "+5%",
      color: "therapy"
    },
    {
      name: "Engagement Rate",
      value: 87,
      trend: "+12%", 
      color: "calm"
    },
    {
      name: "Session Completion",
      value: 91,
      trend: "+3%",
      color: "harmony"
    },
    {
      name: "User Satisfaction",
      value: 96,
      trend: "+8%",
      color: "balance"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Performance Metrics</h1>
          <p className="text-muted-foreground">Detailed analysis of session and system performance</p>
        </div>
        <Badge variant="outline" className="text-therapy-600">
          <TrendingUp className="w-4 h-4 mr-1" />
          Live Metrics
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">2.3s</p>
            <p className="text-sm text-muted-foreground">Avg Response Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">99.2%</p>
            <p className="text-sm text-muted-foreground">Uptime</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">847</p>
            <p className="text-sm text-muted-foreground">Sessions Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">+15%</p>
            <p className="text-sm text-muted-foreground">Growth Rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-l-4 border-therapy-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{metric.name}</CardTitle>
                <Badge className="bg-green-100 text-green-800">
                  {metric.trend}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Performance Score</span>
                <span className="text-sm font-bold">{metric.value}%</span>
              </div>
              <Progress value={metric.value} className="h-3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetrics;