
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock, Target, Lightbulb, Play, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSessionStats } from '@/hooks/useSessionStats';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface SessionRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'focus' | 'stress' | 'anxiety' | 'mood' | 'general';
  priority: 'high' | 'medium' | 'low';
  estimatedDuration: number;
  techniques: string[];
  reasoning: string;
  aiConfidence: number;
  benefits: string[];
}

const SessionRecommendationEngine = () => {
  const { user } = useAuth();
  const { stats } = useSessionStats();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<SessionRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);

  useEffect(() => {
    generateRecommendations();
  }, [user, stats]);

  const generateRecommendations = async () => {
    setIsGenerating(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockRecommendations: SessionRecommendation[] = [
      {
        id: '1',
        title: 'Stress Relief & Grounding',
        description: 'A focused session to help manage current stress levels and build resilience',
        type: 'stress',
        priority: 'high',
        estimatedDuration: 25,
        techniques: ['Deep Breathing', 'Progressive Muscle Relaxation', 'Grounding Exercises'],
        reasoning: 'Your recent sessions indicate elevated stress patterns. This approach has shown 85% effectiveness for similar cases.',
        aiConfidence: 89,
        benefits: ['Immediate stress reduction', 'Improved focus', 'Better sleep preparation']
      },
      {
        id: '2',
        title: 'Cognitive Restructuring',
        description: 'Work on identifying and changing negative thought patterns',
        type: 'mood',
        priority: 'medium',
        estimatedDuration: 30,
        techniques: ['CBT Techniques', 'Thought Recording', 'Reframing'],
        reasoning: 'Based on your conversation history, addressing cognitive patterns could provide lasting benefits.',
        aiConfidence: 76,
        benefits: ['Long-term mood improvement', 'Enhanced self-awareness', 'Better emotional regulation']
      },
      {
        id: '3',
        title: 'Mindfulness & Present Moment',
        description: 'A gentle session focused on mindfulness and staying present',
        type: 'general',
        priority: 'low',
        estimatedDuration: 20,
        techniques: ['Mindfulness Meditation', 'Body Scan', 'Awareness Exercises'],
        reasoning: 'Regular mindfulness practice complements your current therapeutic approach.',
        aiConfidence: 82,
        benefits: ['Increased awareness', 'Reduced anxiety', 'Enhanced emotional balance']
      }
    ];

    setRecommendations(mockRecommendations);
    setIsGenerating(false);
  };

  const handleStartSession = (recommendation: SessionRecommendation) => {
    // Store recommendation data for session
    sessionStorage.setItem('sessionRecommendation', JSON.stringify(recommendation));
    
    toast({
      title: "Session Started",
      description: `Starting ${recommendation.title} session`,
    });

    navigate('/chat');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stress': return '🧘';
      case 'anxiety': return '🌊';
      case 'mood': return '🌟';
      case 'focus': return '🎯';
      default: return '💭';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-therapy-500" />
              <CardTitle>AI Session Recommendations</CardTitle>
            </div>
            <Button 
              variant="outline" 
              onClick={generateRecommendations}
              disabled={isGenerating}
            >
              {isGenerating ? 'Analyzing...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-therapy-500 mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Analyzing your progress and generating personalized recommendations...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Based on your recent sessions, mood patterns, and progress data, our AI has identified the most beneficial approaches for your current needs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-therapy-500">{recommendations.length}</p>
                  <p className="text-xs text-muted-foreground">Recommendations</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-green-500">
                    {recommendations.length > 0 ? Math.round(recommendations.reduce((sum, r) => sum + r.aiConfidence, 0) / recommendations.length) : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Confidence</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-blue-500">
                    {recommendations.filter(r => r.priority === 'high').length}
                  </p>
                  <p className="text-xs text-muted-foreground">High Priority</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((recommendation) => (
          <Card 
            key={recommendation.id} 
            className={`transition-all duration-200 hover:shadow-md ${
              selectedRecommendation === recommendation.id ? 'ring-2 ring-therapy-300' : ''
            }`}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getTypeIcon(recommendation.type)}</span>
                      <h3 className="text-lg font-semibold">{recommendation.title}</h3>
                      <Badge className={getPriorityColor(recommendation.priority)}>
                        {recommendation.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{recommendation.estimatedDuration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">{recommendation.aiConfidence}% match</span>
                    </div>
                  </div>
                </div>

                {/* AI Confidence */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>AI Confidence Score</span>
                    <span>{recommendation.aiConfidence}%</span>
                  </div>
                  <Progress value={recommendation.aiConfidence} className="h-2" />
                </div>

                {/* Techniques */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Recommended Techniques:</h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.techniques.map((technique, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {technique}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Expected Benefits:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {recommendation.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Target className="h-3 w-3 text-therapy-500" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Reasoning */}
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="h-4 w-4 text-therapy-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium mb-1">AI Analysis:</h4>
                      <p className="text-xs text-muted-foreground">{recommendation.reasoning}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRecommendation(
                      selectedRecommendation === recommendation.id ? null : recommendation.id
                    )}
                  >
                    {selectedRecommendation === recommendation.id ? 'Collapse' : 'View Details'}
                  </Button>
                  
                  <Button
                    onClick={() => handleStartSession(recommendation)}
                    className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recommendations.length === 0 && !isGenerating && (
        <Card>
          <CardContent className="text-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Recommendations Available</h3>
            <p className="text-muted-foreground mb-4">
              Complete a few therapy sessions to receive personalized AI recommendations.
            </p>
            <Button onClick={() => navigate('/chat')}>
              Start Your First Session
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionRecommendationEngine;
