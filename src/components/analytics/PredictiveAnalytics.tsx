
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Clock,
  Lightbulb
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PredictiveInsight {
  id: string;
  type: 'mood_pattern' | 'session_timing' | 'technique_effectiveness' | 'risk_factor';
  prediction: string;
  confidence: number;
  timeframe: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
  impact_score: number;
}

const PredictiveAnalytics = () => {
  const { toast } = useToast();
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPredictiveInsights();
  }, []);

  const loadPredictiveInsights = async () => {
    setIsLoading(true);
    try {
      // Simulate API call for predictive insights
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockInsights: PredictiveInsight[] = [
        {
          id: '1',
          type: 'mood_pattern',
          prediction: 'User mood tends to decline on Mondays by 15%',
          confidence: 0.85,
          timeframe: 'Weekly pattern',
          recommendation: 'Schedule extra self-care activities on Sunday evenings',
          priority: 'medium',
          impact_score: 7.2
        },
        {
          id: '2',
          type: 'session_timing',
          prediction: 'Evening sessions show 23% higher engagement',
          confidence: 0.78,
          timeframe: 'Daily pattern',
          recommendation: 'Suggest scheduling sessions between 7-9 PM',
          priority: 'high',
          impact_score: 8.1
        },
        {
          id: '3',
          type: 'technique_effectiveness',
          prediction: 'CBT techniques show declining effectiveness over 6 weeks',
          confidence: 0.72,
          timeframe: '6-week trend',
          recommendation: 'Introduce mindfulness techniques as complementary approach',
          priority: 'medium',
          impact_score: 6.8
        },
        {
          id: '4',
          type: 'risk_factor',
          prediction: 'Stress levels may spike during work deadlines',
          confidence: 0.91,
          timeframe: 'Project-based pattern',
          recommendation: 'Implement proactive stress management protocols',
          priority: 'high',
          impact_score: 9.3
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mood_pattern': return 'Mood Pattern';
      case 'session_timing': return 'Session Timing';
      case 'technique_effectiveness': return 'Technique Effectiveness';
      case 'risk_factor': return 'Risk Factor';
      default: return 'General Insight';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Predictive Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600 mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Analyzing patterns and generating insights...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-therapy-600" />
              Predictive Analytics
            </div>
            <Badge variant="outline" className="text-blue-600">
              AI-Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Advanced machine learning models analyze user patterns to predict behaviors and recommend interventions.
          </p>
        </CardContent>
      </Card>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight) => (
          <Card key={insight.id} className="hover:shadow-lg transition-shadow">
            <CardHead>
r>
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(insight.type)}
                  <span>{getTypeLabel(insight.type)}</span>
                </div>
                <Badge className={getPriorityColor(insight.priority)}>
                  {insight.priority}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Prediction */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Prediction</h4>
                <p className="text-sm text-gray-600">{insight.prediction}</p>
              </div>

              {/* Confidence & Impact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500">Confidence</span>
                    <span className="text-xs text-gray-600">{Math.round(insight.confidence * 100)}%</span>
                  </div>
                  <Progress value={insight.confidence * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500">Impact Score</span>
                    <span className="text-xs text-gray-600">{insight.impact_score}/10</span>
                  </div>
                  <Progress value={insight.impact_score * 10} className="h-2" />
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-therapy-50 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <Lightbulb className="h-4 w-4 text-therapy-600 mr-2" />
                  <span className="font-medium text-therapy-800">Recommendation</span>
                </div>
                <p className="text-sm text-therapy-700">{insight.recommendation}</p>
              </div>

              {/* Timeframe */}
              <div className="text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {insight.timeframe}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-therapy-600">{insights.length}</div>
              <p className="text-sm text-muted-foreground">Active Insights</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">Avg Confidence</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {insights.filter(i => i.priority === 'high').length}
              </div>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {(insights.reduce((sum, i) => sum + i.impact_score, 0) / insights.length).toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Avg Impact Score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalytics;
