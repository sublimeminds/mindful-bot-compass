
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Lightbulb, 
  Star, 
  Clock, 
  Target,
  BookOpen,
  Music,
  Activity,
  MessageCircle,
  TrendingUp
} from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'technique' | 'goal' | 'session' | 'content' | 'therapist';
  title: string;
  description: string;
  reason: string;
  confidence: number;
  timeEstimate?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  icon: React.ReactNode;
}

const SmartRecommendationEngine = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const mockRecommendations: Recommendation[] = [
      {
        id: '1',
        type: 'technique',
        title: 'Progressive Muscle Relaxation',
        description: 'A guided relaxation technique to reduce physical tension',
        reason: 'Based on your reported shoulder tension and stress levels',
        confidence: 92,
        timeEstimate: '15 min',
        difficulty: 'easy',
        category: 'relaxation',
        icon: <Activity className="h-5 w-5" />
      },
      {
        id: '2',
        type: 'session',
        title: 'Evening Reflection Session',
        description: 'Structured journaling to process today\'s experiences',
        reason: 'Your mood improves 78% after evening reflection',
        confidence: 87,
        timeEstimate: '10 min',
        difficulty: 'easy',
        category: 'reflection',
        icon: <BookOpen className="h-5 w-5" />
      },
      {
        id: '3',
        type: 'goal',
        title: 'Daily Mindfulness Goal',
        description: 'Set a small, achievable mindfulness practice',
        reason: 'You complete 90% of daily goals vs. 45% of weekly goals',
        confidence: 85,
        timeEstimate: '5 min/day',
        difficulty: 'easy',
        category: 'mindfulness',
        icon: <Target className="h-5 w-5" />
      },
      {
        id: '4',
        type: 'content',
        title: 'Sleep Hygiene Audio Guide',
        description: 'Personalized sleep improvement recommendations',
        reason: 'Sleep quality affects your mood scores by 65%',
        confidence: 81,
        timeEstimate: '20 min',
        difficulty: 'medium',
        category: 'sleep',
        icon: <Music className="h-5 w-5" />
      },
      {
        id: '5',
        type: 'therapist',
        title: 'Dr. Sarah Chen Session',
        description: 'Video session with your matched therapist',
        reason: 'Best compatibility match (94%) and available tonight',
        confidence: 96,
        timeEstimate: '50 min',
        difficulty: 'medium',
        category: 'therapy',
        icon: <MessageCircle className="h-5 w-5" />
      }
    ];

    setRecommendations(mockRecommendations);
  }, []);

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(recommendations.map(r => r.category)))];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-6 w-6 text-therapy-600" />
            <span>Smart Recommendations</span>
          </CardTitle>
          <p className="text-muted-foreground">
            AI-powered suggestions tailored to your progress and preferences
          </p>
        </CardHeader>
        <CardContent>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Recommendations List */}
          <div className="space-y-4">
            {filteredRecommendations.map((rec) => (
              <Card key={rec.id} className="border-l-4 border-l-therapy-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 bg-therapy-100 rounded-lg">
                        {rec.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold">{rec.title}</h4>
                          <Badge variant="outline" className={getDifficultyColor(rec.difficulty)}>
                            {rec.difficulty}
                          </Badge>
                          {rec.timeEstimate && (
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{rec.timeEstimate}</span>
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {rec.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3" />
                            <span className={getConfidenceColor(rec.confidence)}>
                              {rec.confidence}% match
                            </span>
                          </div>
                          <span className="text-muted-foreground">
                            {rec.category}
                          </span>
                        </div>
                        <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                          💡 {rec.reason}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button size="sm">
                        Start Now
                      </Button>
                      <Button size="sm" variant="outline">
                        Save for Later
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRecommendations.length === 0 && (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No recommendations found for this category.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">94%</div>
            <div className="text-sm text-muted-foreground">Recommendation Accuracy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">23</div>
            <div className="text-sm text-muted-foreground">Completed This Week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">12m</div>
            <div className="text-sm text-muted-foreground">Avg. Time Saved</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmartRecommendationEngine;
