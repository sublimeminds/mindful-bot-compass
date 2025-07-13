import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  MessageSquare, 
  TrendingUp, 
  Brain, 
  Heart, 
  Target, 
  ArrowRight,
  Lightbulb,
  CheckCircle,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TranscriptionInsight {
  id: string;
  insight_type: string;
  title: string;
  description: string;
  confidence_score: number;
  created_at: string;
}

const TranscriptionInsightsWidget = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<TranscriptionInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentBreakthroughs, setRecentBreakthroughs] = useState(0);
  const [adaptationsMade, setAdaptationsMade] = useState(0);

  useEffect(() => {
    if (user) {
      fetchTranscriptionInsights();
      fetchAdaptationMetrics();
    }
  }, [user]);

  const fetchTranscriptionInsights = async () => {
    try {
      // Mock data for now since session_insights table doesn't exist yet
      const mockInsights: TranscriptionInsight[] = [
        {
          id: '1',
          insight_type: 'breakthrough',
          title: 'Emotional Breakthrough',
          description: 'Identified improved emotional regulation during stress discussions',
          confidence_score: 0.92,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          insight_type: 'pattern',
          title: 'Communication Pattern',
          description: 'You respond better to reflective questioning approach',
          confidence_score: 0.87,
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setInsights(mockInsights);
    } catch (error) {
      console.error('Error fetching transcription insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdaptationMetrics = async () => {
    try {
      // Mock data for now since tables don't exist yet
      setRecentBreakthroughs(2);
      setAdaptationsMade(5);
    } catch (error) {
      console.error('Error fetching adaptation metrics:', error);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'breakthrough':
        return <Lightbulb className="h-4 w-4 text-yellow-600" />;
      case 'pattern':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'emotional':
        return <Heart className="h-4 w-4 text-pink-600" />;
      case 'behavioral':
        return <Target className="h-4 w-4 text-green-600" />;
      default:
        return <Brain className="h-4 w-4 text-purple-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'breakthrough':
        return 'bg-yellow-50 border-yellow-200';
      case 'pattern':
        return 'bg-blue-50 border-blue-200';
      case 'emotional':
        return 'bg-pink-50 border-pink-200';
      case 'behavioral':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-purple-50 border-purple-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Session Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          AI Session Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold text-green-600">{recentBreakthroughs}</div>
            <p className="text-xs text-muted-foreground">Breakthroughs This Week</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{adaptationsMade}</div>
            <p className="text-xs text-muted-foreground">AI Adaptations Made</p>
          </div>
        </div>

        {/* Recent Insights */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Recent Insights</h4>
          {insights.length > 0 ? (
            insights.map((insight) => (
              <div 
                key={insight.id} 
                className={`p-3 rounded-lg border ${getInsightColor(insight.insight_type)}`}
              >
                <div className="flex items-start gap-2 mb-2">
                  {getInsightIcon(insight.insight_type)}
                  <div className="flex-1">
                    <h5 className="text-sm font-medium">{insight.title}</h5>
                    <p className="text-xs text-muted-foreground mb-2">
                      {insight.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Progress value={insight.confidence_score * 100} className="w-16 h-2" />
                        <span className="text-xs text-muted-foreground">
                          {Math.round(insight.confidence_score * 100)}% confidence
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(insight.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No insights available yet</p>
              <p className="text-xs">Complete a session to generate AI insights</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => window.location.href = '/ai-personalization'}
        >
          <Brain className="w-4 h-4 mr-2" />
          View Full AI Analysis
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default TranscriptionInsightsWidget;