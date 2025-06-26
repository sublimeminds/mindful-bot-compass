
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  TrendingUp, 
  Star, 
  Clock, 
  Eye,
  BookOpen,
  Play,
  Download,
  ThumbsUp,
  Target,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentRecommendation {
  id: string;
  title: string;
  type: 'article' | 'video' | 'audio' | 'worksheet';
  category: string;
  matchScore: number;
  reason: string;
  duration: string;
  rating: number;
  views: number;
  description: string;
  tags: string[];
  thumbnail?: string;
}

interface UserProfile {
  interests: string[];
  recentActivity: string[];
  goals: string[];
  preferredContentTypes: string[];
  engagementLevel: number;
}

const ContentRecommendationEngine = () => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadUserProfile();
    generateRecommendations();
  }, []);

  const loadUserProfile = () => {
    const mockProfile: UserProfile = {
      interests: ['anxiety management', 'mindfulness', 'sleep improvement'],
      recentActivity: ['meditation', 'journaling', 'breathing exercises'],
      goals: ['reduce stress', 'improve sleep', 'build confidence'],
      preferredContentTypes: ['audio', 'article'],
      engagementLevel: 78
    };
    setUserProfile(mockProfile);
  };

  const generateRecommendations = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockRecommendations: ContentRecommendation[] = [
      {
        id: '1',
        title: 'Advanced Mindfulness Techniques for Anxiety',
        type: 'article',
        category: 'Anxiety Management',
        matchScore: 94,
        reason: 'Matches your interest in anxiety management and mindfulness practice',
        duration: '8 min read',
        rating: 4.8,
        views: 1205,
        description: 'Explore advanced mindfulness techniques specifically designed for managing anxiety symptoms.',
        tags: ['mindfulness', 'anxiety', 'meditation', 'techniques']
      },
      {
        id: '2',
        title: 'Sleep Hygiene Masterclass',
        type: 'video',
        category: 'Sleep Improvement',
        matchScore: 91,
        reason: 'Aligns with your goal to improve sleep quality',
        duration: '25 min',
        rating: 4.9,
        views: 2340,
        description: 'Comprehensive guide to developing healthy sleep habits and routines.',
        tags: ['sleep', 'hygiene', 'routine', 'wellness']
      },
      {
        id: '3',
        title: 'Guided Body Scan Meditation',
        type: 'audio',
        category: 'Relaxation',
        matchScore: 88,
        reason: 'Perfect for your preferred audio content and meditation practice',
        duration: '15 min',
        rating: 4.7,
        views: 980,
        description: 'Relaxing body scan meditation to release tension and promote deep relaxation.',
        tags: ['meditation', 'relaxation', 'body-scan', 'mindfulness']
      },
      {
        id: '4',
        title: 'Confidence Building Worksheet',
        type: 'worksheet',
        category: 'Self-Esteem',
        matchScore: 85,
        reason: 'Supports your goal of building confidence through structured exercises',
        duration: '30 min',
        rating: 4.6,
        views: 756,
        description: 'Interactive worksheet with exercises to identify and build upon your strengths.',
        tags: ['confidence', 'self-esteem', 'exercises', 'worksheets']
      },
      {
        id: '5',
        title: 'Stress Response Understanding',
        type: 'article',
        category: 'Stress Management',
        matchScore: 82,
        reason: 'Based on your recent stress reduction activities',
        duration: '6 min read',
        rating: 4.5,
        views: 1120,
        description: 'Learn how your body responds to stress and effective management strategies.',
        tags: ['stress', 'physiology', 'management', 'education']
      }
    ];

    setRecommendations(mockRecommendations);
    setIsGenerating(false);
    
    toast({
      title: "Recommendations Generated",
      description: "New personalized content recommendations are ready!",
    });
  };

  const handleContentAction = (content: ContentRecommendation, action: string) => {
    toast({
      title: `${action} Content`,
      description: `${action} "${content.title}"`,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <BookOpen className="h-4 w-4" />;
      case 'video': return <Play className="h-4 w-4" />;
      case 'audio': return <Eye className="h-4 w-4" />;
      case 'worksheet': return <Download className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const categories = ['all', ...Array.from(new Set(recommendations.map(r => r.category)))];
  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Brain className="h-7 w-7 mr-2 text-therapy-600" />
            AI Content Recommendations
          </h2>
          <p className="text-muted-foreground">Personalized content suggestions based on your profile and goals</p>
        </div>
        <Button onClick={generateRecommendations} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Refresh Recommendations
            </>
          )}
        </Button>
      </div>

      {/* User Profile Insights */}
      {userProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Your Learning Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h4 className="font-medium mb-2">Top Interests</h4>
                <div className="space-y-1">
                  {userProfile.interests.slice(0, 3).map((interest, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Current Goals</h4>
                <div className="space-y-1">
                  {userProfile.goals.slice(0, 3).map((goal, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Preferred Content</h4>
                <div className="space-y-1">
                  {userProfile.preferredContentTypes.map((type, index) => (
                    <Badge key={index} variant="default" className="text-xs capitalize">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Engagement Level</h4>
                <div className="space-y-2">
                  <Progress value={userProfile.engagementLevel} className="h-2" />
                  <span className="text-sm text-muted-foreground">
                    {userProfile.engagementLevel}% Active
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
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

      {/* Recommendations Grid */}
      {isGenerating ? (
        <div className="text-center py-12">
          <Sparkles className="h-16 w-16 text-therapy-600 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-semibold mb-2">Generating Recommendations</h3>
          <p className="text-muted-foreground">AI is analyzing your profile and preferences...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((recommendation) => (
            <Card key={recommendation.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(recommendation.type)}
                    <span className="text-sm font-medium capitalize">{recommendation.type}</span>
                  </div>
                  <Badge className={`text-xs font-medium ${getMatchScoreColor(recommendation.matchScore)}`}>
                    {recommendation.matchScore}% match
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{recommendation.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {recommendation.description}
                </p>
                
                <div className="space-y-3">
                  <div className="p-2 bg-blue-50 rounded text-xs text-blue-800">
                    🎯 {recommendation.reason}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {recommendation.duration}
                      </span>
                      <span className="flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {recommendation.rating}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {recommendation.views}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {recommendation.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleContentAction(recommendation, 'View')}
                    >
                      View Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContentAction(recommendation, 'Save')}
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredRecommendations.length === 0 && !isGenerating && (
        <div className="text-center py-12">
          <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
          <p className="text-muted-foreground">Generate personalized recommendations based on your profile</p>
        </div>
      )}
    </div>
  );
};

export default ContentRecommendationEngine;
