
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Target, TrendingUp, Settings, User, Heart } from 'lucide-react';
import { AdvancedPersonalizationService, PersonalizedRecommendation } from '@/services/advancedPersonalizationService';
import { useAuth } from '@/contexts/AuthContext';
import RealTimeEmotionTracker from '@/components/emotion/RealTimeEmotionTracker';

const PersonalizationDashboard: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPersonalizationData();
    }
  }, [user]);

  const loadPersonalizationData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Initialize profile if needed
      const userProfile = await AdvancedPersonalizationService.initializeProfile(user.id);
      setProfile(userProfile);

      // Get personalized recommendations
      const recs = await AdvancedPersonalizationService.generatePersonalizedRecommendations(user.id);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading personalization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationAction = async (rec: PersonalizedRecommendation, action: 'accept' | 'dismiss' | 'later') => {
    if (!user) return;

    try {
      // Track user interaction
      await AdvancedPersonalizationService.trackUserInteraction(user.id, {
        type: 'recommendation_interaction',
        content: { recommendationId: rec.id, action },
        outcome: action === 'accept' ? 'positive' : action === 'dismiss' ? 'negative' : 'neutral',
        timestamp: new Date()
      });

      // Update recommendations list
      setRecommendations(prev => 
        prev.filter(r => r.id !== rec.id)
      );
    } catch (error) {
      console.error('Error handling recommendation action:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      session: <Target className="h-4 w-4" />,
      technique: <Brain className="h-4 w-4" />,
      content: <User className="h-4 w-4" />,
      timing: <Settings className="h-4 w-4" />,
      intervention: <Heart className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || <Target className="h-4 w-4" />;
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Personalized Experience</h2>
        <Button onClick={loadPersonalizationData} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="emotions">Emotional Intelligence</TabsTrigger>
          <TabsTrigger value="profile">Profile & Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>AI-Powered Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-gray-600">Generating personalized recommendations...</p>
                </div>
              ) : recommendations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No recommendations available. Check back later!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.slice(0, 5).map((rec) => (
                    <div key={rec.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(rec.type)}
                          <h3 className="font-medium">{rec.title}</h3>
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {Math.round(rec.confidence * 100)}% confidence
                        </span>
                      </div>
                      
                      <p className="text-gray-700">{rec.description}</p>
                      
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <strong>Why this recommendation:</strong>
                        <p className="mt-1 text-gray-600">{rec.reasoning}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Expected Impact:</span>
                        <Progress value={rec.estimatedImpact * 100} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{Math.round(rec.estimatedImpact * 100)}%</span>
                      </div>

                      <div className="flex items-center space-x-3 pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleRecommendationAction(rec, 'accept')}
                        >
                          Try This
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRecommendationAction(rec, 'later')}
                        >
                          Maybe Later
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleRecommendationAction(rec, 'dismiss')}
                        >
                          Not Interested
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emotions" className="space-y-4">
          <RealTimeEmotionTracker />
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Your Personalization Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Learning Style</label>
                      <Badge variant="outline" className="mt-1">
                        {profile.learningStyle}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Communication Style</label>
                      <Badge variant="outline" className="mt-1">
                        {profile.communicationStyle}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Preferred Therapy Approaches</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.therapyPreferences.approach.map((approach: string) => (
                        <Badge key={approach} variant="secondary">{approach}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Session Preferences</label>
                    <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-gray-500">Length:</span> {profile.therapyPreferences.sessionLength} min
                      </div>
                      <div>
                        <span className="text-gray-500">Frequency:</span> {profile.therapyPreferences.frequency}
                      </div>
                      <div>
                        <span className="text-gray-500">Best Time:</span> {profile.therapyPreferences.timeOfDay}
                      </div>
                    </div>
                  </div>

                  {profile.motivationFactors.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Motivation Factors</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profile.motivationFactors.map((factor: string) => (
                          <Badge key={factor} className="bg-green-100 text-green-800">{factor}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      Update Preferences
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading profile data...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalizationDashboard;
