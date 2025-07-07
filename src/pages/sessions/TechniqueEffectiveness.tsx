import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, Target, Star } from 'lucide-react';

const TechniqueEffectiveness = () => {
  const techniques = [
    {
      name: "Mindfulness Meditation",
      effectiveness: 94,
      usageCount: 145,
      avgRating: 4.8,
      category: "Mindfulness"
    },
    {
      name: "Cognitive Restructuring",
      effectiveness: 89,
      usageCount: 98,
      avgRating: 4.6,
      category: "CBT"
    },
    {
      name: "Progressive Muscle Relaxation",
      effectiveness: 87,
      usageCount: 76,
      avgRating: 4.5,
      category: "Relaxation"
    },
    {
      name: "Breathing Exercises",
      effectiveness: 92,
      usageCount: 203,
      avgRating: 4.7,
      category: "Mindfulness"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Technique Effectiveness</h1>
          <p className="text-muted-foreground">Analyze the performance of different therapy techniques</p>
        </div>
        <Badge variant="outline" className="text-therapy-600">
          <Brain className="w-4 h-4 mr-1" />
          Technique Analytics
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">12</p>
            <p className="text-sm text-muted-foreground">Active Techniques</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">90.5%</p>
            <p className="text-sm text-muted-foreground">Avg Effectiveness</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">522</p>
            <p className="text-sm text-muted-foreground">Total Applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">4.7</p>
            <p className="text-sm text-muted-foreground">Avg User Rating</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {techniques.map((technique, index) => (
          <Card key={index} className="border-l-4 border-therapy-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{technique.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{technique.category}</Badge>
                  <Badge className="bg-green-100 text-green-800">
                    {technique.effectiveness}% effective
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-therapy-50 rounded-lg">
                  <p className="text-2xl font-bold text-therapy-600">{technique.usageCount}</p>
                  <p className="text-xs text-muted-foreground">Times Used</p>
                </div>
                <div className="p-3 bg-calm-50 rounded-lg">
                  <p className="text-2xl font-bold text-calm-600">{technique.avgRating}</p>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
                <div className="p-3 bg-harmony-50 rounded-lg">
                  <p className="text-2xl font-bold text-harmony-600">{technique.effectiveness}%</p>
                  <p className="text-xs text-muted-foreground">Effectiveness</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Effectiveness Score</span>
                <span className="text-sm font-bold">{technique.effectiveness}%</span>
              </div>
              <Progress value={technique.effectiveness} className="h-3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TechniqueEffectiveness;