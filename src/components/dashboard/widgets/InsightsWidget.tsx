
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, Clock, Brain, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const InsightsWidget = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: insights = [], isLoading } = useQuery({
    queryKey: ['user-insights', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Get recent session insights
      const { data: sessionInsights } = await supabase
        .from('session_insights')
        .select(`
          *,
          therapy_sessions!inner(user_id)
        `)
        .eq('therapy_sessions.user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (sessionInsights && sessionInsights.length > 0) {
        return sessionInsights.map(insight => ({
          id: insight.id,
          type: insight.insight_type,
          title: insight.title,
          description: insight.description,
          icon: insight.insight_type === 'achievement' ? Brain : 
                insight.insight_type === 'suggestion' ? Clock : TrendingUp,
          priority: insight.priority,
          action: insight.actionable_suggestion || "View Details"
        }));
      }

      // Generate some AI-based insights from user data
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const [sessionsData, moodData] = await Promise.all([
        supabase
          .from('therapy_sessions')
          .select('created_at')
          .eq('user_id', user.id)
          .gte('created_at', oneWeekAgo.toISOString()),
        supabase
          .from('mood_entries')
          .select('overall, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      const generatedInsights = [];

      // Session consistency insight
      if (sessionsData.data && sessionsData.data.length >= 3) {
        generatedInsights.push({
          id: 'consistency-1',
          type: "achievement",
          title: "Consistency Streak",
          description: `You've had ${sessionsData.data.length} sessions this week!`,
          icon: Brain,
          priority: "high",
          action: "Keep It Up!"
        });
      } else if (sessionsData.data && sessionsData.data.length === 0) {
        generatedInsights.push({
          id: 'suggestion-1',
          type: "recommendation",
          title: "Schedule a Session",
          description: "It's been a while since your last therapy session",
          icon: Clock,
          priority: "medium",
          action: "Schedule Now"
        });
      }

      // Mood trend insight
      if (moodData.data && moodData.data.length >= 5) {
        const recentMoods = moodData.data.slice(0, 5);
        const olderMoods = moodData.data.slice(5);
        const recentAvg = recentMoods.reduce((sum, m) => sum + m.overall, 0) / recentMoods.length;
        const olderAvg = olderMoods.length > 0 ? 
          olderMoods.reduce((sum, m) => sum + m.overall, 0) / olderMoods.length : recentAvg;

        if (recentAvg > olderAvg + 0.5) {
          generatedInsights.push({
            id: 'trend-1',
            type: "trend",
            title: "Mood Improvement",
            description: "Your mood has been trending upward recently",
            icon: TrendingUp,
            priority: "high",
            action: "View Mood Analytics"
          });
        }
      }

      return generatedInsights.slice(0, 2);
    },
    enabled: !!user?.id,
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInsightAction = (insight: any) => {
    switch (insight.type) {
      case 'trend':
        navigate('/analytics');
        break;
      case 'recommendation':
        navigate('/chat');
        break;
      case 'achievement':
        navigate('/goals');
        break;
      default:
        navigate('/analytics');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading insights...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-therapy-600" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length === 0 ? (
          <div className="text-center py-4">
            <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground mb-3">
              No insights yet. Complete some sessions to see personalized insights!
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/chat')}
            >
              Start a Session
            </Button>
          </div>
        ) : (
          <>
            {insights.map((insight) => {
              const Icon = insight.icon;
              return (
                <div key={insight.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Icon className="h-5 w-5 text-therapy-600 mt-1" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{insight.title}</h4>
                        <Badge className={getPriorityColor(insight.priority)}>
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {insight.description}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInsightAction(insight)}
                        className="text-xs text-therapy-600 hover:text-therapy-700 p-0 h-auto"
                      >
                        {insight.action}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/analytics')}
              className="w-full mt-3"
            >
              View All Insights
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightsWidget;
