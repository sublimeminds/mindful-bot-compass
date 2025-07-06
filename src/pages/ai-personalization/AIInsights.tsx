import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Brain, User } from 'lucide-react';

const AIInsights = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">AI Insights</h1>
          <p className="text-muted-foreground">Personalized insights powered by artificial intelligence</p>
        </div>
        <Badge variant="outline" className="text-therapy-600">
          <Sparkles className="w-4 h-4 mr-1" />
          AI-Powered
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-therapy-500" />
              <span>Behavioral Patterns</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Your therapy engagement shows consistent improvement with morning sessions performing 23% better than evening sessions.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-calm-500" />
              <span>Progress Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Your mood stability has improved by 40% over the past month, with stress management techniques showing highest effectiveness.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-harmony-500" />
              <span>Personalization Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-therapy-500 to-calm-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-sm font-medium">85%</span>
            </div>
            <p className="text-muted-foreground text-sm mt-2">AI model is highly personalized to your preferences</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Insights Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-therapy-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Optimal Session Times</p>
                <p className="text-muted-foreground text-sm">Your best therapy sessions occur between 9-11 AM, with 30% higher engagement rates.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-calm-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Technique Effectiveness</p>
                <p className="text-muted-foreground text-sm">Mindfulness exercises show 45% better results when combined with breathing techniques.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-harmony-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Mood Correlation</p>
                <p className="text-muted-foreground text-sm">Sleep quality directly correlates with next-day session effectiveness (r=0.78).</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsights;