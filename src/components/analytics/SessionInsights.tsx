
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, Target, Lightbulb, Calendar } from 'lucide-react';
import { SessionStats, AnalyticsInsight } from '@/services/analyticsService';

interface SessionInsightsProps {
  sessionStats: SessionStats;
  insights: AnalyticsInsight[];
  patterns: {
    bestDay: string;
    bestTime: string;
    mostEffectiveTechnique: string;
  };
}

const SessionInsights = ({ sessionStats, insights, patterns }: SessionInsightsProps) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <Target className="h-4 w-4 text-orange-600" />;
      default:
        return <Lightbulb className="h-4 w-4 text-blue-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{sessionStats.totalSessions}</p>
              </div>
              <Calendar className="h-6 w-6 text-therapy-500" />
            </div>
            <div className="mt-2">
              <Progress value={(sessionStats.totalSessions / 20) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Goal: 20 sessions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Duration</p>
                <p className="text-2xl font-bold">{sessionStats.averageDuration}min</p>
              </div>
              <Clock className="h-6 w-6 text-therapy-500" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                Total: {Math.round(sessionStats.totalMinutes / 60)}h {sessionStats.totalMinutes % 60}m
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mood Improvement</p>
                <p className="text-2xl font-bold">+{sessionStats.averageMoodImprovement}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                Average per session
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm mt-1">{insight.description}</p>
                    {insight.actionable && (
                      <p className="text-sm font-medium mt-2">💡 {insight.actionable}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Complete more sessions to see personalized insights.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Your Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-therapy-50 rounded-lg">
              <h4 className="font-medium">Best Day</h4>
              <p className="text-2xl font-bold text-therapy-600">{patterns.bestDay}</p>
            </div>
            <div className="text-center p-4 bg-calm-50 rounded-lg">
              <h4 className="font-medium">Best Time</h4>
              <p className="text-2xl font-bold text-calm-600">{patterns.bestTime}</p>
            </div>
            <div className="text-center p-4 bg-focus-50 rounded-lg">
              <h4 className="font-medium">Top Technique</h4>
              <p className="text-lg font-bold text-focus-600">{patterns.mostEffectiveTechnique}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionInsights;
