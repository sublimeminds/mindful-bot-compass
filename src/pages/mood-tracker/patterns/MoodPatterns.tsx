import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Clock, Calendar, TrendingUp } from 'lucide-react';

const MoodPatterns = () => {
  const patterns = [
    {
      type: "Daily Rhythm",
      description: "Peak mood occurs between 10 AM - 12 PM consistently",
      confidence: 89,
      frequency: "Daily",
      impact: "High"
    },
    {
      type: "Weekly Cycle",
      description: "Mood typically dips on Sundays and peaks on Wednesdays",
      confidence: 76,
      frequency: "Weekly",
      impact: "Medium"
    },
    {
      type: "Activity Correlation",
      description: "Exercise sessions correlate with mood improvements 2-4 hours later",
      confidence: 94,
      frequency: "Per Activity",
      impact: "High"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Mood Patterns</h1>
          <p className="text-muted-foreground">Discover recurring patterns in your emotional wellbeing</p>
        </div>
        <Badge variant="outline" className="text-therapy-600">
          <Activity className="w-4 h-4 mr-1" />
          Pattern Recognition
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">15</p>
            <p className="text-sm text-muted-foreground">Patterns Found</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">86%</p>
            <p className="text-sm text-muted-foreground">Avg Confidence</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">90d</p>
            <p className="text-sm text-muted-foreground">Data Period</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">+24%</p>
            <p className="text-sm text-muted-foreground">Predictability</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {patterns.map((pattern, index) => (
          <Card key={index} className="border-l-4 border-therapy-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{pattern.type}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={pattern.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                    {pattern.impact} Impact
                  </Badge>
                  <Badge variant="outline">{pattern.frequency}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{pattern.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pattern Confidence</span>
                <span className="text-sm font-bold">{pattern.confidence}%</span>
              </div>
              <Progress value={pattern.confidence} className="h-3" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pattern Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-therapy-50 rounded-lg text-center">
              <Clock className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
              <p className="font-medium">Best Time</p>
              <p className="text-sm text-muted-foreground">10 AM - 12 PM</p>
              <p className="text-xs text-therapy-600">Peak performance window</p>
            </div>
            <div className="p-4 bg-calm-50 rounded-lg text-center">
              <Calendar className="w-8 h-8 text-calm-500 mx-auto mb-2" />
              <p className="font-medium">Best Day</p>
              <p className="text-sm text-muted-foreground">Wednesday</p>
              <p className="text-xs text-calm-600">Highest mood scores</p>
            </div>
            <div className="p-4 bg-harmony-50 rounded-lg text-center">
              <Activity className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
              <p className="font-medium">Key Trigger</p>
              <p className="text-sm text-muted-foreground">Exercise</p>
              <p className="text-xs text-harmony-600">+34% mood boost</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodPatterns;