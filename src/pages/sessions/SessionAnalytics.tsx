import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Clock, Target } from 'lucide-react';

const SessionAnalytics = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Session Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your therapy session performance</p>
        </div>
        <Badge variant="outline" className="text-therapy-600">
          <BarChart3 className="w-4 h-4 mr-1" />
          Analytics Dashboard
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">156</p>
            <p className="text-sm text-muted-foreground">Total Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">23%</p>
            <p className="text-sm text-muted-foreground">Improvement Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">22m</p>
            <p className="text-sm text-muted-foreground">Avg Duration</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">87%</p>
            <p className="text-sm text-muted-foreground">Goal Achievement</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Effectiveness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Mindfulness Sessions</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">CBT Sessions</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Group Therapy</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-therapy-50 rounded-lg">
                <p className="text-2xl font-bold text-therapy-600">5.2</p>
                <p className="text-xs text-muted-foreground">Sessions/Week</p>
              </div>
              <div className="p-3 bg-calm-50 rounded-lg">
                <p className="text-2xl font-bold text-calm-600">+12%</p>
                <p className="text-xs text-muted-foreground">Weekly Growth</p>
              </div>
              <div className="p-3 bg-harmony-50 rounded-lg">
                <p className="text-2xl font-bold text-harmony-600">94%</p>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </div>
              <div className="p-3 bg-balance-50 rounded-lg">
                <p className="text-2xl font-bold text-balance-600">4.6</p>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionAnalytics;