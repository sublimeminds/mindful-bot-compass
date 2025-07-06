import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Calendar, Heart } from 'lucide-react';

const MoodInsights = () => {
  const insights = [
    {
      title: "Morning Mood Pattern",
      description: "Your mood is consistently higher in the morning hours (9-11 AM)",
      impact: "High",
      recommendation: "Schedule important activities during this time window"
    },
    {
      title: "Exercise Correlation",
      description: "Days with exercise show 34% higher mood ratings",
      impact: "High",
      recommendation: "Maintain regular physical activity routine"
    },
    {
      title: "Sleep Quality Impact",
      description: "Sleep quality directly correlates with next-day mood (r=0.72)",
      impact: "Medium",
      recommendation: "Focus on consistent sleep schedule"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Mood Insights</h1>
          <p className="text-muted-foreground">AI-powered insights into your emotional patterns</p>
        </div>
        <Badge variant="outline" className="text-therapy-600">
          <BarChart3 className="w-4 h-4 mr-1" />
          Smart Analytics
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">4.3</p>
            <p className="text-sm text-muted-foreground">Monthly Average</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">+18%</p>
            <p className="text-sm text-muted-foreground">Improvement</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">85%</p>
            <p className="text-sm text-muted-foreground">Consistency</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">12</p>
            <p className="text-sm text-muted-foreground">Key Insights</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center">
                  <span className="text-lg mr-2">😊</span>
                  Great Days
                </span>
                <span className="text-sm font-medium">32%</span>
              </div>
              <Progress value={32} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center">
                  <span className="text-lg mr-2">🙂</span>
                  Good Days
                </span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <Progress value={45} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center">
                  <span className="text-lg mr-2">😐</span>
                  Okay Days
                </span>
                <span className="text-sm font-medium">18%</span>
              </div>
              <Progress value={18} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center">
                  <span className="text-lg mr-2">🙁</span>
                  Difficult Days
                </span>
                <span className="text-sm font-medium">5%</span>
              </div>
              <Progress value={5} className="h-2" />
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
                <p className="text-2xl font-bold text-therapy-600">Mon</p>
                <p className="text-xs text-muted-foreground">3.8 avg</p>
              </div>
              <div className="p-3 bg-calm-50 rounded-lg">
                <p className="text-2xl font-bold text-calm-600">Tue</p>
                <p className="text-xs text-muted-foreground">4.2 avg</p>
              </div>
              <div className="p-3 bg-harmony-50 rounded-lg">
                <p className="text-2xl font-bold text-harmony-600">Wed</p>
                <p className="text-xs text-muted-foreground">4.5 avg</p>
              </div>
              <div className="p-3 bg-balance-50 rounded-lg">
                <p className="text-2xl font-bold text-balance-600">Thu</p>
                <p className="text-xs text-muted-foreground">4.3 avg</p>
              </div>
              <div className="p-3 bg-therapy-50 rounded-lg">
                <p className="text-2xl font-bold text-therapy-600">Fri</p>
                <p className="text-xs text-muted-foreground">4.7 avg</p>
              </div>
              <div className="p-3 bg-calm-50 rounded-lg">
                <p className="text-2xl font-bold text-calm-600">Weekend</p>
                <p className="text-xs text-muted-foreground">4.1 avg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <Card key={index} className="border-l-4 border-therapy-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{insight.title}</CardTitle>
                <Badge className={insight.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                  {insight.impact} Impact
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{insight.description}</p>
              <div className="p-3 bg-therapy-50 rounded-lg">
                <p className="font-medium text-sm">Recommendation:</p>
                <p className="text-sm">{insight.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MoodInsights;