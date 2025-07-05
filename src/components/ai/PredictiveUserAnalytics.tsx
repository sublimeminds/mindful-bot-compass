
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertTriangle, Target, Clock, BarChart3 } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';

interface PredictiveInsight {
  id: string;
  type: 'mood_pattern' | 'session_timing' | 'technique_effectiveness' | 'risk_factor';
  prediction: string;
  confidence: number;
  timeframe: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
}

const PredictiveUserAnalytics = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPredictiveInsights();
    }
  }, [user]);

  const loadPredictiveInsights = async () => {
    setIsLoading(true);
    try {
      // Mock predictive insights
      const mockInsights: PredictiveInsight[] = [
        {
          id: '1',
          type: 'mood_pattern',
          prediction: 'Mood tends to decline on Mondays',
          confidence: 0.85,
          timeframe: 'Weekly pattern',
          recommendation: 'Schedule extra self-care on Sunday evenings',
          priority: 'medium'
        }
      ];
      setInsights(mockInsights);
    } catch (error) {
      console.error('Error loading predictive insights:', error);
      toast({
        title: 'Error',
        description: 'Failed to load predictive insights.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mood_pattern': return <TrendingUp className="h-4 w-4" />;
      case 'session_timing': return <Clock className="h-4 w-4" />;
      case 'technique_effectiveness': return <Target className="h-4 w-4" />;
      case 'risk_factor': return <AlertTriangle className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Predictive User Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading insights...</div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <div key={insight.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(insight.type)}
                      <h3 className="font-medium">{insight.prediction}</h3>
                    </div>
                    <Badge className={getPriorityColor(insight.priority)}>
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {insight.recommendation}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
                    <span>{insight.timeframe}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveUserAnalytics;
