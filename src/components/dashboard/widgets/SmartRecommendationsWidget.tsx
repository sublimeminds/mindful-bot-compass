import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb,
  Calendar,
  BookOpen,
  Activity,
  Heart,
  Target,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface SmartRecommendation {
  id: string;
  type: 'technique' | 'session' | 'goal' | 'routine';
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  estimatedTime: string;
  aiReasoning: string;
  actionPath: string;
  completedToday?: boolean;
}

const SmartRecommendationsWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSmartRecommendations = async () => {
      if (!user) return;
      
      try {
        // Simulate AI-generated personalized recommendations
        const currentHour = new Date().getHours();
        const mockRecommendations: SmartRecommendation[] = [
          {
            id: '1',
            type: 'technique',
            title: '5-Minute Breathing Exercise',
            description: 'Your stress levels seem elevated today. A quick breathing exercise could help.',
            urgency: 'high',
            estimatedTime: '5 min',
            aiReasoning: 'Based on your interaction patterns and time of day',
            actionPath: '/techniques/breathing',
            completedToday: false
          },
          {
            id: '2',
            type: 'session',
            title: 'Check-in with Dr. Sarah',
            description: 'It\'s been 3 days since your last session. A brief check-in could be beneficial.',
            urgency: 'medium',
            estimatedTime: '15-20 min',
            aiReasoning: 'Optimal timing based on your engagement patterns',
            actionPath: '/therapy-chat',
            completedToday: false
          },
          {
            id: '3',
            type: 'goal',
            title: 'Update Daily Mood Entry',
            description: 'You haven\'t logged your mood today. This helps track your progress.',
            urgency: currentHour > 18 ? 'high' : 'medium',
            estimatedTime: '2 min',
            aiReasoning: 'Daily tracking improves therapy effectiveness by 34%',
            actionPath: '/mood-tracker',
            completedToday: false
          },
          {
            id: '4',
            type: 'routine',
            title: 'Evening Wind-down Routine',
            description: 'Your sleep patterns suggest starting your evening routine now.',
            urgency: currentHour > 20 ? 'high' : 'low',
            estimatedTime: '10-15 min',
            aiReasoning: 'Optimal timing for better sleep quality',
            actionPath: '/techniques/sleep',
            completedToday: false
          }
        ];
        
        // Filter and sort by urgency and time relevance
        const filteredRecommendations = mockRecommendations
          .filter(rec => {
            if (rec.type === 'routine' && currentHour < 18) return false;
            return true;
          })
          .sort((a, b) => {
            const urgencyOrder = { high: 3, medium: 2, low: 1 };
            return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
          })
          .slice(0, 3); // Show top 3 recommendations
        
        setRecommendations(filteredRecommendations);
      } catch (error) {
        console.error('Error loading smart recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSmartRecommendations();
  }, [user]);

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'technique': return Activity;
      case 'session': return Heart;
      case 'goal': return Target;
      case 'routine': return Clock;
      default: return Lightbulb;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getRecommendationGradient = (type: string, urgency: string) => {
    if (urgency === 'high') return 'from-red-500 to-red-600';
    switch (type) {
      case 'technique': return 'from-therapy-500 to-therapy-600';
      case 'session': return 'from-harmony-500 to-harmony-600';
      case 'goal': return 'from-flow-500 to-flow-600';
      case 'routine': return 'from-calm-500 to-calm-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-therapy-600" />
            <span>Smart Recommendations</span>
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
            <Lightbulb className="h-5 w-5 text-therapy-600" />
            <span>Smart Recommendations</span>
          </div>
          <Badge variant="outline" className="bg-therapy-50 text-therapy-700 border-therapy-200">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((recommendation) => {
          const IconComponent = getRecommendationIcon(recommendation.type);
          return (
            <div key={recommendation.id} className="group">
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:border-therapy-200 hover:bg-therapy-25 transition-all duration-200">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getRecommendationGradient(recommendation.type, recommendation.urgency)} flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {recommendation.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getUrgencyColor(recommendation.urgency)}`}>
                        {recommendation.urgency}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                    {recommendation.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{recommendation.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-2 mb-2">
                    <p className="text-xs text-gray-600 italic">
                      💡 {recommendation.aiReasoning}
                    </p>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => navigate(recommendation.actionPath)}
                    className="w-full text-xs bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white"
                  >
                    Start Now
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        
        {recommendations.length === 0 && (
          <div className="text-center py-6">
            <Lightbulb className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No immediate recommendations</p>
            <p className="text-xs text-gray-400">Great job staying on track!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartRecommendationsWidget;