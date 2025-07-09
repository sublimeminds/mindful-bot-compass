import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Brain, 
  Heart, 
  Star, 
  Check,
  ChevronRight,
  Palette
} from 'lucide-react';
import IntersectionObserverAvatar from '@/components/avatar/IntersectionObserverAvatar';
import { AvatarVirtualizationProvider } from '@/components/avatar/AvatarVirtualizationManager';
import { getAvatarIdForTherapist } from '@/services/therapistAvatarMapping';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface TherapistPersonality {
  id: string;
  name: string;
  title: string;
  description: string;
  approach: string;
  specialties: string[];
  communication_style: string;
  experience_level: string;
  color_scheme: string;
  icon: string;
  personality_traits: Record<string, number>;
  effectiveness_areas: Record<string, number>;
}

const TherapistPersonalitySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);

  const { data: therapists, isLoading } = useQuery({
    queryKey: ['therapist-personalities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('therapist_personalities')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching therapists:', error);
        throw error;
      }

      return data as TherapistPersonality[];
    },
  });

  const { data: currentSelection } = useQuery({
    queryKey: ['user-therapist-selection', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Use localStorage for now since the column doesn't exist yet
      const stored = localStorage.getItem('selected_therapist');
      return stored || null;
    },
    enabled: !!user?.id,
  });

  const updateTherapistMutation = useMutation({
    mutationFn: async (therapistId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Store in localStorage for now
      localStorage.setItem('selected_therapist', therapistId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-therapist-selection', user?.id] });
      toast({
        title: "Therapist Updated",
        description: "Your AI therapist selection has been saved successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating therapist:', error);
      toast({
        title: "Error",
        description: "Failed to update therapist selection. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSelectTherapist = (therapistId: string) => {
    setSelectedTherapist(therapistId);
    updateTherapistMutation.mutate(therapistId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  return (
    <AvatarVirtualizationProvider>
      <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Your AI Therapist</h2>
        <p className="text-muted-foreground">
          Select the AI therapist personality that best matches your communication style and therapy goals.
          You can change this anytime.
        </p>
      </div>

      {/* Current Selection */}
      {currentSelection && (
        <Card className="border-therapy-200 bg-therapy-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-therapy-600" />
              <div>
                <h3 className="font-medium">Currently Selected</h3>
                <p className="text-sm text-muted-foreground">
                  {therapists?.find(t => t.id === currentSelection)?.name || 'Unknown therapist'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Therapist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {therapists?.map((therapist) => {
          const isSelected = currentSelection === therapist.id;
          const isBeingSelected = selectedTherapist === therapist.id;
          
          return (
            <Card 
              key={therapist.id} 
              className={`cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'border-therapy-500 bg-therapy-50 shadow-lg' 
                  : 'hover:shadow-md hover:border-therapy-200'
              }`}
              onClick={() => handleSelectTherapist(therapist.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <IntersectionObserverAvatar
                      therapistId={getAvatarIdForTherapist(therapist.id)}
                      therapistName={therapist.name}
                      emotion="neutral"
                      showControls={false}
                      priority={isSelected ? 10 : 1}
                      className="w-16 h-16 rounded-lg"
                    />
                    <div>
                      <CardTitle className="text-lg">{therapist.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{therapist.title}</p>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <Badge className="bg-therapy-600 text-white">
                      <Check className="h-3 w-3 mr-1" />
                      Selected
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm">{therapist.description}</p>

                {/* Approach */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Therapeutic Approach</h4>
                  <Badge variant="outline" className="text-xs">
                    {therapist.approach}
                  </Badge>
                </div>

                {/* Specialties */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    {therapist.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {therapist.specialties.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{therapist.specialties.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Communication Style */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Communication Style</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {therapist.communication_style}
                  </p>
                </div>

                {/* Personality Traits */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Key Traits</h4>
                  <div className="space-y-1">
                    {Object.entries(therapist.personality_traits || {})
                      .slice(0, 3)
                      .map(([trait, value]) => {
                        // Convert value to 1-5 scale for star display
                        const starCount = Math.min(5, Math.max(1, Math.round((value as number))));
                        return (
                          <div key={trait} className="flex items-center justify-between text-xs">
                            <span className="capitalize">{trait.replace('_', ' ')}</span>
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${
                                    i < starCount ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    className={`w-full ${
                      isSelected 
                        ? 'bg-therapy-600 hover:bg-therapy-700' 
                        : 'bg-therapy-500 hover:bg-therapy-600'
                    }`}
                    disabled={updateTherapistMutation.isPending && isBeingSelected}
                  >
                    {updateTherapistMutation.isPending && isBeingSelected 
                      ? 'Selecting...' 
                      : isSelected 
                        ? 'Currently Selected' 
                        : 'Select This Therapist'
                    }
                    {!isSelected && <ChevronRight className="h-4 w-4 ml-2" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Help Text */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Brain className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-900">Switching Therapists</h4>
              <p className="text-sm text-blue-700 mt-1">
                You can change your AI therapist anytime. Your conversation history and progress will be maintained, 
                but the communication style and approach will adapt to your new selection.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </AvatarVirtualizationProvider>
  );
};

export default TherapistPersonalitySettings;