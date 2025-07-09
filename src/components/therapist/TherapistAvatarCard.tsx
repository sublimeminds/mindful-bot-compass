import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import AvatarErrorBoundary from '@/components/avatar/AvatarErrorBoundary';
import { getAvatarIdForTherapist } from '@/services/therapistAvatarMapping';

interface TherapistAvatarCardProps {
  therapist: {
    id: string;
    name: string;
    title: string;
    description: string;
    approach: string;
    specialties: string[];
    communicationStyle: string;
    icon: string;
    colorScheme: string;
  };
  isSelected?: boolean;
  showMiniAvatar?: boolean;
  onSelect?: () => void;
}

const TherapistAvatarCard = ({ 
  therapist, 
  isSelected = false, 
  showMiniAvatar = true,
  onSelect 
}: TherapistAvatarCardProps) => {
  const avatarId = getAvatarIdForTherapist(therapist.id);

  return (
    <Card 
      className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
        isSelected ? 'ring-2 ring-therapy-500 bg-therapy-50' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader>
        <div className="flex items-center space-x-3">
          {/* Professional 2D Avatar */}
          {showMiniAvatar ? (
            <div className="w-16 h-16 rounded-lg overflow-hidden">
              <AvatarErrorBoundary therapistId={avatarId} therapistName={therapist.name}>
                <Professional2DAvatar
                  therapistId={avatarId}
                  therapistName={therapist.name}
                  className="w-full h-full"
                  showName={false}
                  size="md"
                  emotion="neutral"
                />
              </AvatarErrorBoundary>
            </div>
          ) : (
            <div className={`p-3 rounded-lg bg-gradient-to-r ${therapist.colorScheme} text-white w-16 h-16 flex items-center justify-center`}>
              👤
            </div>
          )}
          
          <div className="flex-1">
            <CardTitle className="text-lg">{therapist.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{therapist.title}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm">{therapist.description}</p>
        
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium">Approach:</span>
            <Badge variant="outline" className="ml-2">
              {therapist.approach}
            </Badge>
          </div>
          
          <div>
            <span className="text-sm font-medium">Communication Style:</span>
            <p className="text-sm text-muted-foreground">{therapist.communicationStyle}</p>
          </div>
          
          <div>
            <span className="text-sm font-medium">Specialties:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {therapist.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TherapistAvatarCard;