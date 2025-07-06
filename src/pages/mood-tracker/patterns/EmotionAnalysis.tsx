import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Brain, Activity, BarChart3 } from 'lucide-react';

const EmotionAnalysis = () => {
  const emotions = [
    { name: 'Joy', percentage: 35, color: 'bg-yellow-500', trend: '+5%' },
    { name: 'Calm', percentage: 28, color: 'bg-blue-500', trend: '+12%' },
    { name: 'Anxiety', percentage: 15, color: 'bg-red-500', trend: '-8%' },
    { name: 'Sadness', percentage: 12, color: 'bg-gray-500', trend: '-3%' },
    { name: 'Excitement', percentage: 10, color: 'bg-orange-500', trend: '+2%' }
  ];

  const emotionalTriggers = [
    { trigger: 'Work Stress', impact: 'High', frequency: '78%', emotion: 'Anxiety' },
    { trigger: 'Exercise', impact: 'High', frequency: '65%', emotion: 'Joy' },
    { trigger: 'Social Time', impact: 'Medium', frequency: '45%', emotion: 'Calm' },
    { trigger: 'Weather', impact: 'Low', frequency: '23%', emotion: 'Various' }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Emotion Analysis</h1>
          <p className="text-muted-foreground">Deep dive into your emotional landscape and triggers</p>
        </div>
        <Badge variant="outline" className="text-therapy-600">
          <Brain className="w-4 h-4 mr-1" />
          Emotion AI
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">8</p>
            <p className="text-sm text-muted-foreground">Emotions Tracked</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">92%</p>
            <p className="text-sm text-muted-foreground">Analysis Accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">156</p>
            <p className="text-sm text-muted-foreground">Data Points</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">+15%</p>
            <p className="text-sm text-muted-foreground">Emotional Growth</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Emotion Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emotions.map((emotion, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${emotion.color}`}></div>
                      <span className="text-sm font-medium">{emotion.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">{emotion.percentage}%</span>
                      <Badge className={emotion.trend.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {emotion.trend}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={emotion.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emotional Intelligence Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-therapy-600 mb-2">78</div>
              <p className="text-muted-foreground">out of 100</p>
              <Badge className="bg-green-100 text-green-800 mt-2">
                +12 points this month
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-therapy-50 rounded-lg">
                <p className="text-2xl font-bold text-therapy-600">82</p>
                <p className="text-xs text-muted-foreground">Self-Awareness</p>
              </div>
              <div className="p-3 bg-calm-50 rounded-lg">
                <p className="text-2xl font-bold text-calm-600">75</p>
                <p className="text-xs text-muted-foreground">Regulation</p>
              </div>
              <div className="p-3 bg-harmony-50 rounded-lg">
                <p className="text-2xl font-bold text-harmony-600">79</p>
                <p className="text-xs text-muted-foreground">Empathy</p>
              </div>
              <div className="p-3 bg-balance-50 rounded-lg">
                <p className="text-2xl font-bold text-balance-600">77</p>
                <p className="text-xs text-muted-foreground">Social Skills</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emotional Triggers Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emotionalTriggers.map((trigger, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{trigger.trigger}</p>
                  <p className="text-sm text-muted-foreground">Primary emotion: {trigger.emotion}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm font-medium">Impact</p>
                    <Badge className={
                      trigger.impact === 'High' ? 'bg-red-100 text-red-800' :
                      trigger.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {trigger.impact}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Frequency</p>
                    <p className="text-sm font-bold">{trigger.frequency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionAnalysis;