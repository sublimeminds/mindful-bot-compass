
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  User, 
  Target, 
  TrendingUp, 
  Heart, 
  Calendar,
  MessageSquare,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PersonalizationProfile {
  userId: string;
  preferences: {
    communicationStyle: 'formal' | 'casual' | 'empathetic' | 'direct';
    sessionFrequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
    focusAreas: string[];
    timePreferences: string[];
  };
  behaviorPatterns: {
    engagementTimes: string[];
    responseStyles: string[];
    progressTrends: number[];
    emotionalPatterns: Record<string, number>;
  };
  aiRecommendations: {
    nextSession: Date;
    suggestedTopics: string[];
    interventionStrategies: string[];
    riskFactors: string[];
  };
}

const AIPersonalizationEngine = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<PersonalizationProfile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    loadPersonalizationProfile();
  }, []);

  const loadPersonalizationProfile = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate AI analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2500));

      const mockProfile: PersonalizationProfile = {
        userId: 'user-123',
        preferences: {
          communicationStyle: 'empathetic',
          sessionFrequency: 'weekly',
          focusAreas: ['Anxiety Management', 'Sleep Improvement', 'Stress Reduction'],
          timePreferences: ['morning', 'evening']
        },
        behaviorPatterns: {
          engagementTimes: ['09:00', '20:00'],
          responseStyles: ['reflective', 'solution-oriented'],
          progressTrends: [65, 70, 75, 78, 82, 85, 88],
          emotionalPatterns: {
            anxiety: 0.3,
            stress: 0.4,
            mood: 0.7,
            energy: 0.6
          }
        },
        aiRecommendations: {
          nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          suggestedTopics: [
            'Mindfulness Techniques',
            'Cognitive Restructuring',
            'Sleep Hygiene',
            'Breathing Exercises'
          ],
          interventionStrategies: [
            'Progressive Muscle Relaxation',
            'Thought Record Exercises',
            'Behavioral Activation'
          ],
          riskFactors: [
            'Increased stress during work hours',
            'Sleep pattern disruption'
          ]
        }
      };

      setProfile(mockProfile);
      setIsAnalyzing(false);

      toast({
        title: "AI Analysis Complete",
        description: "Your personalized therapy profile has been generated",
      });
    } catch (error) {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Failed",
        description: "Could not generate personalization profile",
        variant: "destructive",
      });
    }
  };

  const regenerateProfile = () => {
    loadPersonalizationProfile();
  };

  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 animate-spin text-therapy-600" />
            <span>AI Personalization Engine</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Analyzing your therapy patterns and preferences...
            </p>
            <Progress value={analysisProgress} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {analysisProgress}% Complete
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-therapy-600" />
            <span>AI Personalization Engine</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Generate your personalized AI therapy profile
            </p>
            <Button onClick={loadPersonalizationProfile}>
              <Brain className="h-4 w-4 mr-2" />
              Start AI Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-therapy-600" />
              <span>AI Personalization Profile</span>
            </div>
            <Button variant="outline" onClick={regenerateProfile}>
              Regenerate Profile
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <User className="h-8 w-8 mx-auto mb-2 text-therapy-600" />
              <div className="font-medium">Communication Style</div>
              <Badge variant="outline" className="capitalize">
                {profile.preferences.communicationStyle}
              </Badge>
            </div>
            <div className="text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-therapy-600" />
              <div className="font-medium">Session Frequency</div>
              <Badge variant="outline" className="capitalize">
                {profile.preferences.sessionFrequency}
              </Badge>
            </div>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-therapy-600" />
              <div className="font-medium">Progress Trend</div>
              <Badge variant="default">
                +{profile.behaviorPatterns.progressTrends[profile.behaviorPatterns.progressTrends.length - 1]}%
              </Badge>
            </div>
            <div className="text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-therapy-600" />
              <div className="font-medium">Overall Mood</div>
              <Badge variant={profile.behaviorPatterns.emotionalPatterns.mood > 0.6 ? 'default' : 'secondary'}>
                {Math.round(profile.behaviorPatterns.emotionalPatterns.mood * 100)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Focus Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-therapy-600" />
            <span>Focus Areas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile.preferences.focusAreas.map((area, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {area}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emotional Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-therapy-600" />
            <span>Emotional Patterns</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(profile.behaviorPatterns.emotionalPatterns).map(([emotion, level]) => (
            <div key={emotion} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="capitalize font-medium">{emotion}</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(level * 100)}%
                </span>
              </div>
              <Progress value={level * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-therapy-600" />
            <span>AI Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-2 flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Suggested Topics for Next Session</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {profile.aiRecommendations.suggestedTopics.map((topic, index) => (
                <Badge key={index} variant="secondary" className="justify-center p-2">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Intervention Strategies</h4>
            <div className="space-y-2">
              {profile.aiRecommendations.interventionStrategies.map((strategy, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <span className="text-sm">{strategy}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Recommended Next Session</h4>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-therapy-600" />
              <span className="text-sm">
                {profile.aiRecommendations.nextSession.toLocaleDateString()} at optimal time
              </span>
            </div>
          </div>

          {profile.aiRecommendations.riskFactors.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-amber-600">Areas of Attention</h4>
              <div className="space-y-1">
                {profile.aiRecommendations.riskFactors.map((risk, index) => (
                  <div key={index} className="text-sm text-amber-700 bg-amber-50 p-2 rounded">
                    {risk}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPersonalizationEngine;
