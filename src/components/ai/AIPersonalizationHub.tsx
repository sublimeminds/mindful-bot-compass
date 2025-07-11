import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Lightbulb, 
  Target, 
  Settings,
  BarChart3,
  Zap,
  Eye,
  Users
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleApp } from '@/hooks/useSimpleApp';

const AIPersonalizationHub = () => {
  const { user } = useSimpleApp();
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  // Fetch AI insights from database
  const { data: insights = [], isLoading: isLoadingInsights } = useQuery({
    queryKey: ['goal-insights', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('goal_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Fetch personalized recommendations
  const { data: recommendations = [], isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ['personalized-recommendations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('personalized_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('priority_score', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Mock fallback data structure for compatibility
  const mockInsights = [
    {
      id: 1,
      type: 'behavioral_pattern',
      title: 'Morning Anxiety Peak Detected',
      description: 'Your anxiety levels tend to spike between 8-10 AM. Consider morning meditation.',
      confidence: 87,
      actionable: true,
      category: 'Pattern Recognition'
    },
    {
      id: 2,
      type: 'therapy_recommendation',
      title: 'CBT Techniques Showing 23% Improvement',
      description: 'Cognitive restructuring exercises have been most effective for you.',
      confidence: 94,
      actionable: true,
      category: 'Treatment Effectiveness'
    },
    {
      id: 3,
      type: 'lifestyle_correlation',
      title: 'Sleep Quality Affects Mood by 34%',
      description: 'Better sleep consistently correlates with improved daily mood scores.',
      confidence: 78,
      actionable: true,
      category: 'Lifestyle Impact'
    }
  ];

  // Transform database recommendations to component format
  const transformedRecommendations = recommendations.map(rec => ({
    id: rec.id,
    title: rec.title,
    description: rec.description,
    type: rec.recommendation_type,
    estimatedImpact: rec.estimated_impact > 0.7 ? 'High' : rec.estimated_impact > 0.4 ? 'Medium' : 'Low',
    timeToComplete: '5 min' // Default, could be enhanced with actual data
  }));

  const behavioralPatterns = [
    { pattern: 'Morning Routine Impact', score: 85, trend: 'improving' },
    { pattern: 'Social Interaction Correlation', score: 72, trend: 'stable' },
    { pattern: 'Work Stress Triggers', score: 91, trend: 'improving' },
    { pattern: 'Weekend Recovery Pattern', score: 68, trend: 'declining' }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
            AI Personalization Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered insights and personalized recommendations for your mental health journey
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* AI Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-therapy-200 bg-gradient-to-r from-therapy-25 to-therapy-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-therapy-700">AI Confidence</p>
                <p className="text-2xl font-bold text-therapy-800">87%</p>
              </div>
              <Brain className="h-8 w-8 text-therapy-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-harmony-200 bg-gradient-to-r from-harmony-25 to-harmony-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-harmony-700">Active Insights</p>
                <p className="text-2xl font-bold text-harmony-800">12</p>
              </div>
              <Lightbulb className="h-8 w-8 text-harmony-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-flow-200 bg-gradient-to-r from-flow-25 to-flow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-flow-700">Patterns Found</p>
                <p className="text-2xl font-bold text-flow-800">8</p>
              </div>
              <BarChart3 className="h-8 w-8 text-flow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-calm-200 bg-gradient-to-r from-calm-25 to-calm-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-calm-700">Improvement</p>
                <p className="text-2xl font-bold text-calm-800">+23%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-calm-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="patterns">Behavioral Patterns</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="config">AI Configuration</TabsTrigger>
        </TabsList>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-therapy-600" />
                Latest AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingInsights ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {insights.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No AI insights available yet. Continue using the app to generate personalized insights.
                    </p>
                  ) : (
                    insights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-4 hover:border-therapy-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="font-semibold">{insight.title}</h3>
                          <Badge variant="outline" className="ml-2">
                            {Math.round(insight.confidence_score * 100)}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          {insight.insight_type}
                        </Badge>
                      </div>
                      <Button size="sm">
                        Take Action
                      </Button>
                    </div>
                  </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavioral Patterns Tab */}
        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-therapy-600" />
                Behavioral Pattern Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {behavioralPatterns.map((pattern, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{pattern.pattern}</h3>
                      <div className="flex items-center mt-2">
                        <Progress value={pattern.score} className="w-32 mr-3" />
                        <span className="text-sm text-muted-foreground">{pattern.score}%</span>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        pattern.trend === 'improving' ? 'default' : 
                        pattern.trend === 'stable' ? 'secondary' : 'destructive'
                      }
                    >
                      {pattern.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-therapy-600" />
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingRecommendations ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {transformedRecommendations.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No recommendations available. Continue using the app to receive personalized suggestions.
                    </p>
                  ) : (
                    transformedRecommendations.map((rec) => (
                  <div key={rec.id} className="border rounded-lg p-4 hover:border-therapy-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{rec.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">
                            Impact: {rec.estimatedImpact}
                          </Badge>
                          <Badge variant="secondary">
                            {rec.timeToComplete}
                          </Badge>
                        </div>
                      </div>
                      <Button>
                        Start Now
                      </Button>
                    </div>
                  </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Configuration Tab */}
        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-therapy-600" />
                AI Personalization Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Learning Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pattern Recognition Sensitivity</span>
                      <Progress value={75} className="w-32" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Recommendation Frequency</span>
                      <Progress value={60} className="w-32" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Intervention Threshold</span>
                      <Progress value={80} className="w-32" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Data Sources</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Mood tracking data</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Session transcripts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Goal progress</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Device usage patterns</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIPersonalizationHub;