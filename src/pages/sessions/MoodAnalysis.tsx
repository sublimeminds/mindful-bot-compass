import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, TrendingUp, Smile, Frown } from 'lucide-react';

const MoodAnalysis = () => {
  const moodData = [
    {
      session: "Morning Mindfulness",
      preMood: 3.2,
      postMood: 4.8,
      improvement: 50,
      date: "Today 9:00 AM"
    },
    {
      session: "CBT Session",
      preMood: 2.8,
      postMood: 4.2,
      improvement: 50,
      date: "Yesterday 2:00 PM"
    },
    {
      session: "Breathing Exercise",
      preMood: 3.5,
      postMood: 4.6,
      improvement: 31,
      date: "Yesterday 7:00 PM"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Mood Analysis</h1>
          <p className="text-muted-foreground">Track mood changes before and after sessions</p>
        </div>
        <Badge variant="outline" className="text-therapy-600">
          <Heart className="w-4 h-4 mr-1" />
          Mood Tracking
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">4.2</p>
            <p className="text-sm text-muted-foreground">Avg Post-Session</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">+42%</p>
            <p className="text-sm text-muted-foreground">Mood Improvement</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Smile className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">28</p>
            <p className="text-sm text-muted-foreground">Positive Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Frown className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">3</p>
            <p className="text-sm text-muted-foreground">Needs Attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {moodData.map((session, index) => (
          <Card key={index} className="border-l-4 border-therapy-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{session.session}</CardTitle>
                <Badge className="bg-green-100 text-green-800">
                  +{session.improvement}% improvement
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{session.preMood}</p>
                  <p className="text-xs text-muted-foreground">Pre-Session Mood</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{session.postMood}</p>
                  <p className="text-xs text-muted-foreground">Post-Session Mood</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Improvement</span>
                <span className="text-sm font-bold">{session.improvement}%</span>
              </div>
              <Progress value={session.improvement} className="h-3" />
              <p className="text-sm text-muted-foreground">{session.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MoodAnalysis;