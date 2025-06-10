
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, Brain, Heart } from 'lucide-react';
import { useSessionStats } from '@/hooks/useSessionStats';

const InsightsWidget = () => {
  const { stats } = useSessionStats();

  // Generate insights based on user data
  const generateInsights = () => {
    const insights = [];

    if (!stats) {
      return [
        {
          type: 'info' as const,
          title: 'Welcome!',
          description: 'Start your first therapy session to begin receiving personalized insights.',
          priority: 'high' as const
        }
      ];
    }

    if (stats.totalSessions >= 5) {
      insights.push({
        type: 'positive' as const,
        title: 'Consistency Champion',
        description: `You've completed ${stats.totalSessions} sessions! Regular practice leads to better outcomes.`,
        priority: 'high' as const
      });
    }

    if (stats.averageMoodImprovement > 1.5) {
      insights.push({
        type: 'positive' as const,
        title: 'Effective Sessions',
        description: `Your sessions improve your mood by an average of ${stats.averageMoodImprovement.toFixed(1)} points. Great work!`,
        priority: 'high' as const
      });
    }

    if (stats.weeklyProgress >= stats.weeklyGoal) {
      insights.push({
        type: 'positive' as const,
        title: 'Weekly Goal Achieved',
        description: 'You\'ve met your weekly therapy goal. Consistency is paying off!',
        priority: 'medium' as const
      });
    }

    if (stats.totalSessions > 0 && stats.averageMoodImprovement < 0.5) {
      insights.push({
        type: 'info' as const,
        title: 'Explore Different Approaches',
        description: 'Consider trying different therapeutic techniques to find what works best for you.',
        priority: 'medium' as const
      });
    }

    if (stats.totalSessions >= 10) {
      insights.push({
        type: 'info' as const,
        title: 'Progress Milestone',
        description: 'You\'ve reached 10 sessions! This is when many people start seeing significant benefits.',
        priority: 'medium' as const
      });
    }

    // Default insights if none generated
    if (insights.length === 0) {
      insights.push({
        type: 'info' as const,
        title: 'Building Your Practice',
        description: 'Each session contributes to your mental health journey. Keep going!',
        priority: 'medium' as const
      });
    }

    return insights.slice(0, 3); // Limit to 3 insights
  };

  const insights = generateInsights();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <Brain className="h-4 w-4 text-orange-600" />;
      default:
        return <Heart className="h-4 w-4 text-blue-600" />;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-therapy-600" />
          Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              insight.type === 'positive' 
                ? 'border-green-200 bg-green-50' 
                : insight.type === 'warning'
                ? 'border-orange-200 bg-orange-50'
                : 'border-blue-200 bg-blue-50'
            }`}
          >
            <div className="flex items-start space-x-3">
              {getInsightIcon(insight.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium truncate">{insight.title}</h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getInsightColor(insight.type)}`}
                  >
                    {insight.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Motivational Quote */}
        <div className="pt-4 border-t">
          <div className="text-center p-3 bg-therapy-50 rounded-lg">
            <p className="text-sm italic text-therapy-700 mb-1">
              "Progress, not perfection."
            </p>
            <p className="text-xs text-muted-foreground">
              Every step forward matters 🌱
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsWidget;
