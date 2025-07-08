import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain,
  TrendingUp,
  Target,
  Lightbulb,
  ArrowRight,
  Star,
  Activity,
  Heart
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface AIInsight {
  id: string;
  type: 'pattern' | 'progress' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  relatedAction?: {
    label: string;
    path: string;
  };
}

const AIInsightsWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAIInsights = async () => {
      if (!user) return;
      
      try {
        // Simulate AI-generated insights based on user data
        const mockInsights: AIInsight[] = [
          {
            id: '1',
            type: 'pattern',
            title: 'Improved Evening Mood',
            description: 'Your mood ratings have been 40% higher in the evenings this week compared to last week.',
            confidence: 0.87,
            actionable: true,
            priority: 'high',
            relatedAction: {
              label: 'View Mood Patterns',
              path: '/mood-tracker'
            }
          },
          {
            id: '2',
            type: 'progress',
            title: 'Coping Strategy Effectiveness',
            description: 'Deep breathing exercises show 73% success rate in reducing your anxiety levels.',
            confidence: 0.92,
            actionable: true,
            priority: 'medium',
            relatedAction: {
              label: 'Practice Techniques',
              path: '/techniques'
            }
          },
          {
            id: '3',
            type: 'recommendation',
            title: 'Optimal Session Timing',
            description: 'Based on your engagement patterns, 3-4 PM appears to be your most receptive time for therapy.',
            confidence: 0.78,
            actionable: true,
            priority: 'medium',
            relatedAction: {
              label: 'Schedule Session',
              path: '/therapy-chat'
            }
          },
          {
            id: '4',
            type: 'achievement',
            title: '7-Day Consistency Streak',
            description: 'You\'ve maintained daily engagement for a full week. This shows strong commitment to your mental health.',
            confidence: 1.0,
            actionable: false,
            priority: 'high'
          }
        ];
        
        setInsights(mockInsights);
      } catch (error) {
        console.error('Error loading AI insights:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAIInsights();
  }, [user]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return TrendingUp;
      case 'progress': return Target;
      case 'recommendation': return Lightbulb;
      case 'achievement': return Star;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string, priority: string) => {
    if (type === 'achievement') return 'from-yellow-500 to-orange-500';
    if (priority === 'high') return 'from-therapy-500 to-therapy-600';
    if (priority === 'medium') return 'from-harmony-500 to-harmony-600';
    return 'from-calm-500 to-calm-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-therapy-600" />
            <span>AI Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-therapy-600" />
            <span>AI Insights</span>
          </div>
          <Badge variant="outline" className="bg-therapy-50 text-therapy-700 border-therapy-200">
            <Activity className="h-3 w-3 mr-1" />
            {insights.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => {
          const IconComponent = getInsightIcon(insight.type);
          return (
            <div key={insight.id} className="group">
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:border-therapy-200 hover:bg-therapy-25 transition-all duration-200">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getInsightColor(insight.type, insight.priority)} flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {insight.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {insight.priority !== 'low' && (
                        <Badge className={`text-xs ${getPriorityColor(insight.priority)}`}>
                          {insight.priority}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                    {insight.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Confidence:</span>
                      <Progress 
                        value={insight.confidence * 100} 
                        className="w-12 h-1.5"
                      />
                      <span className="text-xs font-medium text-gray-600">
                        {Math.round(insight.confidence * 100)}%
                      </span>
                    </div>
                    
                    {insight.relatedAction && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(insight.relatedAction!.path)}
                        className="text-xs text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        {insight.relatedAction.label}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="pt-2 border-t border-gray-100">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/ai-dashboard')}
            className="w-full text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50"
          >
            <Brain className="h-4 w-4 mr-2" />
            View AI Hub Dashboard
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsWidget;