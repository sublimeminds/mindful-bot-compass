
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Lightbulb, Target, Heart, Zap, Shield } from 'lucide-react';

interface PersonalityInsightsProps {
  onboardingData: any;
}

const PersonalityInsights = ({ onboardingData }: PersonalityInsightsProps) => {
  const personalityTraits = [
    { name: 'Openness to Experience', score: 85, description: 'Highly curious and creative' },
    { name: 'Emotional Resilience', score: 72, description: 'Good ability to bounce back from setbacks' },
    { name: 'Social Connectivity', score: 68, description: 'Moderate comfort with social interactions' },
    { name: 'Stress Management', score: 64, description: 'Developing healthy coping strategies' },
    { name: 'Self-Awareness', score: 78, description: 'Strong understanding of emotions and triggers' }
  ];

  const therapeuticRecommendations = [
    {
      technique: 'Cognitive Behavioral Therapy (CBT)',
      match: 92,
      reason: 'High analytical thinking and goal-oriented personality',
      icon: <Brain className="h-4 w-4" />
    },
    {
      technique: 'Mindfulness-Based Stress Reduction',
      match: 87,
      reason: 'Openness to new experiences and stress management needs',
      icon: <Heart className="h-4 w-4" />
    },
    {
      technique: 'Dialectical Behavior Therapy (DBT)',
      match: 73,
      reason: 'Social connectivity patterns and emotional regulation',
      icon: <Shield className="h-4 w-4" />
    }
  ];

  const aiInsights = [
    {
      category: 'Behavioral Patterns',
      insight: 'Your session engagement is highest in the morning hours, suggesting you are a natural early riser who processes emotions better with a clear mind.',
      icon: <Zap className="h-4 w-4" />,
      confidence: 89
    },
    {
      category: 'Emotional Triggers',
      insight: 'Analysis shows increased stress levels correlate with social situations involving large groups, but you thrive in one-on-one therapeutic conversations.',
      icon: <Heart className="h-4 w-4" />,
      confidence: 76
    },
    {
      category: 'Progress Prediction',
      insight: 'Based on your current trajectory and personality profile, you are likely to see significant improvement in anxiety management within 6-8 weeks.',
      icon: <Target className="h-4 w-4" />,
      confidence: 82
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchColor = (match: number) => {
    if (match >= 85) return 'bg-green-100 text-green-800 border-green-200';
    if (match >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="space-y-6">
      {/* Personality Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI Personality Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {personalityTraits.map((trait, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{trait.name}</span>
                  <span className={`font-bold ${getScoreColor(trait.score)}`}>
                    {trait.score}%
                  </span>
                </div>
                <Progress value={trait.score} className="h-2" />
                <p className="text-sm text-muted-foreground">{trait.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Therapeutic Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Personalized Therapy Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {therapeuticRecommendations.map((rec, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {rec.icon}
                    <span className="font-medium">{rec.technique}</span>
                  </div>
                  <Badge variant="outline" className={getMatchColor(rec.match)}>
                    {rec.match}% match
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{rec.reason}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            AI-Generated Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="p-4 bg-therapy-50 border border-therapy-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {insight.icon}
                    <span className="font-medium text-therapy-700">{insight.category}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {insight.confidence}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">{insight.insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cultural Context (if available) */}
      {onboardingData && (
        <Card>
          <CardHeader>
            <CardTitle>Cultural Context & Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Therapy Goals</h4>
                <div className="space-y-1">
                  {onboardingData.goals?.map((goal: string, index: number) => (
                    <Badge key={index} variant="outline" className="mr-2">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Preferences</h4>
                <div className="space-y-1">
                  {onboardingData.preferences?.map((pref: string, index: number) => (
                    <Badge key={index} variant="secondary" className="mr-2">
                      {pref}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalityInsights;
