import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Clock, 
  Brain,
  Heart,
  Activity,
  BookOpen,
  Users,
  Calendar,
  Star,
  ArrowRight,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Recommendation {
  id: string;
  type: 'technique' | 'activity' | 'goal' | 'session' | 'resource' | 'connection';
  title: string;
  description: string;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: number;
  estimatedTime: string;
  tags: string[];
  actionUrl?: string;
  confidence: number;
  createdAt: string;
}

const SmartRecommendationEngine = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data generator
  const generateMockRecommendations = (): Recommendation[] => [
    {
      id: '1',
      type: 'technique',
      title: 'Try Progressive Muscle Relaxation',
      description: 'Based on your recent mood patterns, this technique could help reduce anxiety levels by 30%.',
      reasoning: 'Your stress levels have been elevated for 3 consecutive days. PMR is proven effective for similar patterns.',
      priority: 'high',
      estimatedImpact: 85,
      estimatedTime: '10-15 minutes',
      tags: ['anxiety', 'relaxation', 'evening'],
      confidence: 92,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'activity',
      title: 'Morning Gratitude Journaling',
      description: 'Start your day with 5 minutes of gratitude practice to boost overall mood.',
      reasoning: 'Your morning mood scores are 15% lower than evening scores. Gratitude practice can help.',
      priority: 'medium',
      estimatedImpact: 70,
      estimatedTime: '5 minutes',
      tags: ['gratitude', 'morning', 'mood'],
      confidence: 78,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      type: 'goal',
      title: 'Set a Sleep Consistency Goal',
      description: 'Improve your sleep schedule with a 30-day consistency challenge.',
      reasoning: 'Irregular sleep patterns correlate with your reported fatigue levels.',
      priority: 'high',
      estimatedImpact: 90,
      estimatedTime: 'Ongoing',
      tags: ['sleep', 'consistency', 'health'],
      confidence: 88,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      type: 'session',
      title: 'Focus Session: Cognitive Restructuring',
      description: 'Address negative thought patterns with targeted CBT techniques.',
      reasoning: 'Your journal entries show recurring negative self-talk patterns.',
      priority: 'medium',
      estimatedImpact: 75,
      estimatedTime: '45 minutes',
      tags: ['CBT', 'thoughts', 'restructuring'],
      confidence: 82,
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      type: 'resource',
      title: 'Recommended Reading: "Atomic Habits"',
      description: 'Build better habits with science-backed strategies for lasting change.',
      reasoning: 'You\'ve expressed interest in building consistent routines.',
      priority: 'low',
      estimatedImpact: 60,
      estimatedTime: '2-3 weeks',
      tags: ['habits', 'reading', 'self-improvement'],
      confidence: 65,
      createdAt: new Date().toISOString(),
    },
    {
      id: '6',
      type: 'connection',
      title: 'Join Anxiety Support Group',
      description: 'Connect with others who understand your journey.',
      reasoning: 'Community support can enhance individual therapy outcomes by 40%.',
      priority: 'medium',
      estimatedImpact: 80,
      estimatedTime: '1 hour/week',
      tags: ['community', 'support', 'anxiety'],
      confidence: 75,
      createdAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    setRecommendations(generateMockRecommendations());
  }, []);

  const refreshRecommendations = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRecommendations(generateMockRecommendations());
      setRefreshing(false);
      toast({
        title: "Recommendations Updated",
        description: "AI has generated new personalized recommendations based on your latest data.",
      });
    }, 1500);
  };

  const handleActionClick = (recommendation: Recommendation) => {
    toast({
      title: "Recommendation Applied",
      description: `Starting: ${recommendation.title}`,
    });
  };

  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'technique': return Brain;
      case 'activity': return Activity;
      case 'goal': return Target;
      case 'session': return Calendar;
      case 'resource': return BookOpen;
      case 'connection': return Users;
      default: return Lightbulb;
    }
  };

  const getPriorityColor = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const filteredRecommendations = activeTab === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.type === activeTab);

  const sortedRecommendations = filteredRecommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Recommendations</h1>
          <p className="text-gray-600 mt-2">AI-powered personalized suggestions for your wellness journey</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={refreshRecommendations}
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Recommendations</p>
                <p className="text-2xl font-bold text-gray-900">{recommendations.length}</p>
              </div>
              <Lightbulb className="h-8 w-8 text-therapy-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {recommendations.filter(r => r.priority === 'high').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Confidence</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(recommendations.reduce((acc, r) => acc + r.confidence, 0) / recommendations.length)}%
                </p>
              </div>
              <Star className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Impact</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(recommendations.reduce((acc, r) => acc + r.estimatedImpact, 0) / recommendations.length)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-therapy-600" />
            <span>Personalized Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="technique">Techniques</TabsTrigger>
              <TabsTrigger value="activity">Activities</TabsTrigger>
              <TabsTrigger value="goal">Goals</TabsTrigger>
              <TabsTrigger value="session">Sessions</TabsTrigger>
              <TabsTrigger value="resource">Resources</TabsTrigger>
              <TabsTrigger value="connection">Community</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="space-y-6">
                {sortedRecommendations.map((recommendation) => {
                  const IconComponent = getTypeIcon(recommendation.type);
                  
                  return (
                    <Card key={recommendation.id} className="border-l-4 border-l-therapy-500">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="p-2 bg-therapy-100 rounded-lg">
                              <IconComponent className="h-5 w-5 text-therapy-600" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {recommendation.title}
                                </h3>
                                <Badge className={getPriorityColor(recommendation.priority)}>
                                  {recommendation.priority}
                                </Badge>
                                <Badge variant="outline">
                                  {recommendation.confidence}% confidence
                                </Badge>
                              </div>
                              
                              <p className="text-gray-600 mb-3">{recommendation.description}</p>
                              
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                <p className="text-sm text-blue-800">
                                  <strong>AI Reasoning:</strong> {recommendation.reasoning}
                                </p>
                              </div>
                              
                              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                                <div className="flex items-center space-x-1">
                                  <Target className="h-4 w-4" />
                                  <span>Impact: {recommendation.estimatedImpact}%</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>Time: {recommendation.estimatedTime}</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                {recommendation.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={() => handleActionClick(recommendation)}
                            className="ml-4 flex items-center space-x-2"
                          >
                            <span>Try This</span>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartRecommendationEngine;