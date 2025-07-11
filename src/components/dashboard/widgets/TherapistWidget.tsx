
import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/contexts/TherapistContext';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import { getAvatarIdForTherapist } from '@/services/therapistAvatarMapping';
import { useTherapistSelection } from '@/hooks/useTherapistSelection';

const TherapistWidget = () => {
  const navigate = useNavigate();
  const { selectedTherapist, therapists } = useTherapist();
  const { currentSelection } = useTherapistSelection();

  // Use database selection if available, fallback to context
  const currentTherapist = currentSelection 
    ? therapists.find(t => t.id === currentSelection.therapist_id) || selectedTherapist || therapists[0]
    : selectedTherapist || therapists[0];

  if (!currentTherapist) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">No therapist assigned</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-therapy-600" />
            Your Therapist
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/therapist-matching')}
            className="text-therapy-600 hover:text-therapy-700"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Therapist Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            {/* Enhanced Professional 2D Avatar Mini Display */}
            <Suspense fallback={<Skeleton className="w-12 h-12 rounded-full" />}>
              <Professional2DAvatar
                therapistId={getAvatarIdForTherapist(currentTherapist.id)}
                therapistName={currentTherapist.name}
                emotion="neutral"
                size="sm"
                showName={false}
                therapeuticMode={true}
                className="w-12 h-12"
              />
            </Suspense>
            <div className="flex-1">
              <h3 className="font-semibold">{currentTherapist.name}</h3>
              <p className="text-sm text-muted-foreground">{currentTherapist.title}</p>
            </div>
          </div>

          <p className="text-sm leading-relaxed">{currentTherapist.description}</p>

          {/* Approach */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Approach</h4>
            <Badge variant="outline" className="text-xs">
              {currentTherapist.approach}
            </Badge>
          </div>

          {/* Specialties */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Specialties</h4>
            <div className="flex flex-wrap gap-1">
              {currentTherapist.specialties.slice(0, 3).map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {currentTherapist.specialties.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{currentTherapist.specialties.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Communication Style */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Communication Style</h4>
            <p className="text-sm text-muted-foreground">{currentTherapist.communicationStyle}</p>
          </div>
        </div>

        {/* Rating/Compatibility */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">Compatibility</span>
            </div>
            <span className="text-sm text-muted-foreground">95%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }} />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/therapy')}
            className="w-full"
          >
            Start Session with {currentTherapist.name.split(' ')[1]}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/therapist-matching')}
            className="w-full text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50"
          >
            Find Different Therapist
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TherapistWidget;
