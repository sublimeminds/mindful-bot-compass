import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTherapistFavorites } from '@/hooks/useTherapistFavorites';
import SimpleFavoriteButton from '@/components/therapist/SimpleFavoriteButton';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, loading, error } = useTherapistFavorites();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/20">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center mb-2">
            <Heart className="h-6 w-6 mr-3 text-red-500" />
            <h1 className="text-3xl font-bold">Your Favorite Therapists</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your saved therapists and easily access their profiles.
          </p>
        </div>

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold mb-4">No favorites yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start exploring therapists and save your favorites for quick access. 
                Click the heart icon on any therapist card to add them to your favorites.
              </p>
              <div className="space-x-4">
                <Button onClick={() => navigate('/therapist-discovery')}>
                  Explore Therapists
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/therapist-assessment')}
                >
                  Take Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {favorites.length} Saved Therapist{favorites.length > 1 ? 's' : ''}
              </h2>
              <Button 
                variant="outline"
                onClick={() => navigate('/therapist-discovery')}
              >
                Find More Therapists
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <Card key={favorite.id} className="relative hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          Therapist Profile
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          ID: {favorite.therapist_id.slice(0, 8)}...
                        </p>
                      </div>
                      <SimpleFavoriteButton
                        therapistId={favorite.therapist_id}
                        therapistName="Favorite Therapist"
                        size="sm"
                      />
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Added to favorites</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(favorite.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      {favorite.notes && (
                        <div>
                          <p className="text-sm font-medium">Notes</p>
                          <p className="text-sm text-muted-foreground italic">
                            "{favorite.notes}"
                          </p>
                        </div>
                      )}

                      <div className="pt-4 border-t space-y-2">
                        <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => navigate('/therapist-selection', {
                            state: { preSelectedTherapist: favorite.therapist_id }
                          })}
                        >
                          Select This Therapist
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          size="sm"
                          onClick={() => navigate('/therapist-discovery')}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/therapist-assessment')}
                    className="h-16"
                  >
                    <div className="text-center">
                      <div className="font-medium">Take Assessment</div>
                      <div className="text-sm text-muted-foreground">Find new matches</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/therapist-discovery')}
                    className="h-16"
                  >
                    <div className="text-center">
                      <div className="font-medium">Browse All</div>
                      <div className="text-sm text-muted-foreground">Explore therapists</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/therapist-dashboard')}
                    className="h-16"
                  >
                    <div className="text-center">
                      <div className="font-medium">Dashboard</div>
                      <div className="text-sm text-muted-foreground">View your progress</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;