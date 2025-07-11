import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, User, Calendar, TrendingUp, MessageSquare, Target, Clock, Award } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useTherapistFavorites } from '@/hooks/useTherapistFavorites';
import { TherapistSelectionService, TherapistSelection } from '@/services/therapistSelectionService';
import { TherapistMatchingService } from '@/services/therapistMatchingService';
import SimpleFavoriteButton from './SimpleFavoriteButton';

const TherapistDashboard: React.FC = () => {
  const { user } = useSimpleApp();
  const { favorites, loading: favoritesLoading } = useTherapistFavorites();
  const [currentSelection, setCurrentSelection] = useState<TherapistSelection | null>(null);
  const [selectionHistory, setSelectionHistory] = useState<TherapistSelection[]>([]);
  const [latestAssessment, setLatestAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const [selection, history, assessment] = await Promise.all([
        TherapistSelectionService.getCurrentSelection(user.id),
        TherapistSelectionService.getSelectionHistory(user.id),
        TherapistMatchingService.getLatestAssessment(user.id)
      ]);

      setCurrentSelection(selection);
      setSelectionHistory(history);
      setLatestAssessment(assessment);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progressScore = latestAssessment ? 75 : 0; // Mock progress calculation
  const sessionsCompleted = selectionHistory.length; // Mock session count

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Welcome Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.email?.split('@')[0]}!</h1>
              <p className="text-muted-foreground mt-1">
                Your therapeutic journey at a glance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{sessionsCompleted}</div>
                <p className="text-sm text-muted-foreground">Sessions</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-therapy-600">{favorites.length}</div>
                <p className="text-sm text-muted-foreground">Favorites</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Therapist */}
      {currentSelection && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-therapy-600" />
              Your Current Therapist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Therapist Selected</h3>
                <p className="text-sm text-muted-foreground">
                  Selected on {new Date(currentSelection.selected_at).toLocaleDateString()}
                </p>
                {currentSelection.selection_reason && (
                  <p className="text-sm mt-2 italic">"{currentSelection.selection_reason}"</p>
                )}
              </div>
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                <span className="font-medium">Progress</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{progressScore}%</span>
            </div>
            <Progress value={progressScore} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Great progress this month!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                <span className="font-medium">Next Session</span>
              </div>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold">Available Now</p>
            <p className="text-sm text-muted-foreground">
              Start your session anytime
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-600" />
                <span className="font-medium">Achievements</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">3</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Milestones reached this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="favorites" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="favorites">Favorite Therapists</TabsTrigger>
          <TabsTrigger value="history">Selection History</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="favorites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Your Favorite Therapists ({favorites.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {favoritesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : favorites.length > 0 ? (
                <div className="space-y-4">
                  {favorites.map(favorite => (
                    <div key={favorite.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Therapist ID: {favorite.therapist_id}</h4>
                        <p className="text-sm text-muted-foreground">
                          Added {new Date(favorite.created_at).toLocaleDateString()}
                        </p>
                        {favorite.notes && (
                          <p className="text-sm mt-1 italic">"{favorite.notes}"</p>
                        )}
                      </div>
                      <SimpleFavoriteButton
                        therapistId={favorite.therapist_id}
                        therapistName="Favorite Therapist"
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring therapists and save your favorites for easy access.
                  </p>
                  <Button variant="outline">
                    Explore Therapists
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Selection History</CardTitle>
            </CardHeader>
            <CardContent>
              {selectionHistory.length > 0 ? (
                <div className="space-y-4">
                  {selectionHistory.map(selection => (
                    <div key={selection.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Therapist Selection</h4>
                        <Badge variant={selection.is_active ? "default" : "secondary"}>
                          {selection.is_active ? "Active" : "Previous"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Selected {new Date(selection.selected_at).toLocaleDateString()}
                      </p>
                      {selection.selection_reason && (
                        <p className="text-sm mt-2 italic">"{selection.selection_reason}"</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No selections yet</h3>
                  <p className="text-muted-foreground">
                    Take an assessment to get matched with therapists.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-therapy-600" />
                Your Therapy Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {latestAssessment ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Latest Assessment</h4>
                    <p className="text-sm text-muted-foreground">
                      Completed {new Date(latestAssessment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Key Focus Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(latestAssessment.assessment_responses || {}).slice(0, 3).map(key => (
                        <Badge key={key} variant="outline">
                          {key.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Recommended Actions</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Continue regular therapy sessions</li>
                      <li>• Practice mindfulness techniques</li>
                      <li>• Track your mood daily</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No insights available</h3>
                  <p className="text-muted-foreground mb-4">
                    Take an assessment to receive personalized insights.
                  </p>
                  <Button>
                    Take Assessment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TherapistDashboard;