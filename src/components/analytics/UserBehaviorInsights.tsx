
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Calendar, 
  Activity, 
  TrendingUp,
  User,
  Brain,
  Heart,
  Target
} from 'lucide-react';

const UserBehaviorInsights = () => {
  const [insights] = useState({
    sessionPatterns: {
      peakHours: ['9:00 AM', '2:00 PM', '7:00 PM'],
      averageDuration: 28,
      preferredDays: ['Monday', 'Wednesday', 'Friday'],
      completionRate: 85
    },
    engagementMetrics: {
      interactionScore: 8.4,
      contentPreference: 'guided_meditation',
      responseTime: 1.2,
      retentionRate: 92
    },
    wellnessPatterns: {
      moodConsistency: 7.8,
      stressReduction: 32,
      goalAchievement: 67,
      selfReflectionFreq: 4.2
    }
  });

  const behaviorTrends = [
    {
      category: 'Session Engagement',
      score: 88,
      trend: 'up',
      description: 'Consistent participation in scheduled sessions',
      color: 'bg-blue-500'
    },
    {
      category: 'Mood Stability',
      score: 76,
      trend: 'up',
      description: 'Reduced mood fluctuations over time',
      color: 'bg-green-500'
    },
    {
      category: 'Goal Completion',
      score: 64,
      trend: 'neutral',
      description: 'Meeting most weekly objectives',
      color: 'bg-yellow-500'
    },
    {
      category: 'Content Interaction',
      score: 82,
      trend: 'up',
      description: 'High engagement with therapeutic content',
      color: 'bg-purple-500'
    }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Session Time</p>
                <p className="text-2xl font-bold">{insights.sessionPatterns.averageDuration}min</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{insights.sessionPatterns.completionRate}%</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement Score</p>
                <p className="text-2xl font-bold">{insights.engagementMetrics.interactionScore}/10</p>
              </div>
              <Heart className="h-8 w-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Retention Rate</p>
                <p className="text-2xl font-bold">{insights.engagementMetrics.retentionRate}%</p>
              </div>
              <User className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Behavior Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-therapy-600" />
            <span>Behavioral Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {behaviorTrends.map((trend, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${trend.color}`} />
                  <span className="font-medium">{trend.category}</span>
                  {getTrendIcon(trend.trend)}
                </div>
                <span className="text-sm font-medium">{trend.score}%</span>
              </div>
              <Progress value={trend.score} className="h-2" />
              <p className="text-sm text-muted-foreground">{trend.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Usage Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Timing Patterns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Peak Usage Hours</h4>
              <div className="flex flex-wrap gap-2">
                {insights.sessionPatterns.peakHours.map((hour, index) => (
                  <Badge key={index} variant="secondary">{hour}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Preferred Days</h4>
              <div className="flex flex-wrap gap-2">
                {insights.sessionPatterns.preferredDays.map((day, index) => (
                  <Badge key={index} variant="outline">{day}</Badge>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Average Response Time</span>
                <span className="font-medium">{insights.engagementMetrics.responseTime}s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wellness Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Mood Consistency</span>
                <div className="flex items-center space-x-2">
                  <Progress value={insights.wellnessPatterns.moodConsistency * 10} className="w-16 h-2" />
                  <span className="text-sm font-medium">{insights.wellnessPatterns.moodConsistency}/10</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Stress Reduction</span>
                <div className="flex items-center space-x-2">
                  <Progress value={insights.wellnessPatterns.stressReduction} className="w-16 h-2" />
                  <span className="text-sm font-medium">{insights.wellnessPatterns.stressReduction}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Goal Achievement</span>
                <div className="flex items-center space-x-2">
                  <Progress value={insights.wellnessPatterns.goalAchievement} className="w-16 h-2" />
                  <span className="text-sm font-medium">{insights.wellnessPatterns.goalAchievement}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Self-Reflection Frequency</span>
                <span className="text-sm font-medium">{insights.wellnessPatterns.selfReflectionFreq}/week</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <span>Personalized Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Optimal Session Timing</h4>
              <p className="text-sm text-blue-700">
                Based on your patterns, scheduling sessions around 2:00 PM shows highest engagement rates.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Content Preference</h4>
              <p className="text-sm text-green-700">
                You respond well to guided meditation content. Consider exploring advanced mindfulness techniques.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Goal Optimization</h4>
              <p className="text-sm text-purple-700">
                Breaking larger goals into smaller, weekly targets could improve your completion rate.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Consistency Boost</h4>
              <p className="text-sm text-yellow-700">
                Adding weekend sessions could help maintain momentum and improve overall wellness scores.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserBehaviorInsights;
