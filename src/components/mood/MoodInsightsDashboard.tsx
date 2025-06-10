
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Brain, Heart, AlertTriangle } from 'lucide-react';

interface MoodData {
  date: string;
  overall: number;
  anxiety: number;
  energy: number;
  stress: number;
}

interface MoodInsight {
  type: 'positive' | 'warning' | 'info';
  title: string;
  description: string;
  confidence: number;
}

interface MoodPattern {
  bestTimeOfDay: string;
  worstTimeOfDay: string;
  averageMood: number;
  moodVariability: number;
  streak: number;
}

interface MoodInsightsDashboardProps {
  moodData: MoodData[];
  insights: MoodInsight[];
  patterns: MoodPattern;
}

const MoodInsightsDashboard = ({ moodData, insights, patterns }: MoodInsightsDashboardProps) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Brain className="h-4 w-4 text-blue-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getTrendIcon = (variability: number) => {
    if (variability < 1.5) return <Minus className="h-4 w-4 text-gray-600" />;
    if (patterns.averageMood > 6) return <TrendingUp className="h-4 w-4 text-green-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Mood</p>
                <p className="text-2xl font-bold">{patterns.averageMood.toFixed(1)}</p>
              </div>
              <Heart className="h-6 w-6 text-therapy-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">{patterns.streak}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Best Time</p>
                <p className="text-lg font-bold">{patterns.bestTimeOfDay}</p>
              </div>
              <Brain className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stability</p>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(patterns.moodVariability)}
                  <span className="text-lg font-bold">
                    {patterns.moodVariability < 1.5 ? 'Stable' : 'Variable'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[1, 10]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="overall"
                  stroke="hsl(var(--therapy-500))"
                  strokeWidth={2}
                  name="Overall"
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="hsl(var(--calm-500))"
                  strokeWidth={2}
                  name="Energy"
                />
                <Line
                  type="monotone"
                  dataKey="anxiety"
                  stroke="hsl(var(--focus-500))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Anxiety (inverted)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg ${getInsightColor(insight.type)}`}>
              <div className="flex items-start space-x-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(insight.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm mt-1">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodInsightsDashboard;
