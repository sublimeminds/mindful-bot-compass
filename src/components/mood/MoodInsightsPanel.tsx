import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  Lightbulb, 
  Target,
  Heart,
  Activity,
  Sun,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const MoodInsightsPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: recentMoods, isLoading } = useQuery({
    queryKey: ['recent-moods', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(14);

      if (error) {
        console.error('Error fetching recent moods:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  // Generate AI insights based on mood data
  const insights = React.useMemo(() => {
    if (!recentMoods || recentMoods.length === 0) {
      return {
        patterns: [],
        recommendations: [],
        achievements: [],
        concerns: []
      };
    }

    const avgMood = recentMoods.reduce((sum, m) => sum + m.overall, 0) / recentMoods.length;
    const avgAnxiety = recentMoods.reduce((sum, m) => sum + m.anxiety, 0) / recentMoods.length;
    const avgEnergy = recentMoods.reduce((sum, m) => sum + m.energy, 0) / recentMoods.length;
    const avgSleep = recentMoods.reduce((sum, m) => sum + m.sleep_quality, 0) / recentMoods.length;

    const patterns = [];
    const recommendations = [];
    const achievements = [];
    const concerns = [];

    // Pattern recognition
    if (avgMood > 7) {
      patterns.push({
        icon: TrendingUp,
        title: 'Positive Mood Trend',
        description: 'Your mood has been consistently positive over the past two weeks.',
        type: 'positive'
      });
    }

    if (avgAnxiety < 4) {
      achievements.push({
        icon: CheckCircle,
        title: 'Low Anxiety Levels',
        description: 'You\'ve maintained low anxiety levels - great job managing stress!',
        type: 'achievement'
      });
    }

    if (avgEnergy < 4) {
      concerns.push({
        icon: AlertTriangle,
        title: 'Low Energy Levels',
        description: 'Your energy levels have been below average. Consider reviewing sleep and exercise habits.',
        type: 'concern'
      });
      
      recommendations.push({
        icon: Sun,
        title: 'Energy Boost Strategy',
        description: 'Try morning sunlight exposure and light exercise to naturally increase energy.',
        action: 'Create Energy Plan',
        type: 'recommendation'
      });
    }

    if (avgSleep < 5) {
      recommendations.push({
        icon: Brain,
        title: 'Sleep Optimization',
        description: 'Poor sleep quality affects mood and energy. Consider a sleep hygiene routine.',
        action: 'Sleep Assessment',
        type: 'recommendation'
      });
    }

    // Correlation insights
    const sleepMoodCorrelation = recentMoods.reduce((sum, m, index) => {
      if (index === 0) return 0;
      const prevSleep = recentMoods[index - 1].sleep_quality;
      return sum + (prevSleep > 6 && m.overall > 6 ? 1 : 0);
    }, 0);

    if (sleepMoodCorrelation > recentMoods.length * 0.5) {
      patterns.push({
        icon: Brain,
        title: 'Sleep-Mood Connection',
        description: 'Good sleep strongly correlates with better mood the next day.',
        type: 'insight'
      });
    }

    return { patterns, recommendations, achievements, concerns };
  }, [recentMoods]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  const allInsights = [
    ...insights.achievements,
    ...insights.patterns,
    ...insights.recommendations,
    ...insights.concerns
  ];

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card className="bg-gradient-to-r from-therapy-50 to-calm-50 border-therapy-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-6 w-6 mr-2 text-therapy-600" />
            AI-Powered Mood Insights
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Personalized insights based on your mood tracking data
          </p>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Insights Generated</p>
                <p className="text-2xl font-bold text-therapy-600">{allInsights.length}</p>
              </div>
              <Lightbulb className="h-8 w-8 text-therapy-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold text-green-600">{insights.achievements.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recommendations</p>
                <p className="text-2xl font-bold text-blue-600">{insights.recommendations.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Grid */}
      {allInsights.length > 0 ? (
        <div className="space-y-4">
          {/* Achievements */}
          {insights.achievements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-700 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.achievements.map((insight, index) => (
                  <Card key={index} className="border-green-200 bg-green-50">
                    <CardContent className="pt-4">
                      <div className="flex items-start space-x-3">
                        <insight.icon className="h-5 w-5 text-green-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium text-green-900">{insight.title}</h4>
                          <p className="text-sm text-green-700 mt-1">{insight.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Patterns */}
          {insights.patterns.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-700 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Patterns Discovered
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.patterns.map((insight, index) => (
                  <Card key={index} className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-4">
                      <div className="flex items-start space-x-3">
                        <insight.icon className="h-5 w-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-900">{insight.title}</h4>
                          <p className="text-sm text-blue-700 mt-1">{insight.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {insights.recommendations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-therapy-700 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Personalized Recommendations
              </h3>
              <div className="space-y-3">
                {insights.recommendations.map((insight, index) => (
                  <Card key={index} className="border-therapy-200 bg-therapy-50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <insight.icon className="h-5 w-5 text-therapy-600 mt-1" />
                          <div className="flex-1">
                            <h4 className="font-medium text-therapy-900">{insight.title}</h4>
                            <p className="text-sm text-therapy-700 mt-1">{insight.description}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="ml-4 border-therapy-300 text-therapy-700 hover:bg-therapy-100"
                          onClick={() => navigate('/goals')}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Concerns */}
          {insights.concerns.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-orange-700 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Areas for Attention
              </h3>
              <div className="space-y-3">
                {insights.concerns.map((insight, index) => (
                  <Card key={index} className="border-orange-200 bg-orange-50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <insight.icon className="h-5 w-5 text-orange-600 mt-1" />
                          <div className="flex-1">
                            <h4 className="font-medium text-orange-900">{insight.title}</h4>
                            <p className="text-sm text-orange-700 mt-1">{insight.description}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          className="ml-4 bg-orange-600 hover:bg-orange-700 text-white"
                          onClick={() => navigate('/therapy-chat')}
                        >
                          Discuss
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">No Insights Yet</h3>
            <p className="text-muted-foreground mb-4">
              Track your mood for a few days to get personalized insights and recommendations.
            </p>
            <Button onClick={() => navigate('/mood-tracker')}>
              Start Tracking
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-therapy-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Discuss with AI Therapist</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Talk about your mood patterns and get personalized guidance.
                </p>
              </div>
              <Button 
                onClick={() => navigate('/therapy-chat')}
                className="bg-therapy-600 hover:bg-therapy-700"
              >
                Start Chat
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Set Mood Goals</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Create specific goals based on your mood insights.
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate('/goals')}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Create Goals
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MoodInsightsPanel;