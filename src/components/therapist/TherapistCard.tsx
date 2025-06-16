
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Shield } from 'lucide-react';

interface TherapistCardProps {
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
}

const TherapistCard = ({ therapist, isSelected = false }: TherapistCardProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain':
        return <Brain className="h-6 w-6" />;
      case 'Heart':
        return <Heart className="h-6 w-6" />;
      case 'Shield':
        return <Shield className="h-6 w-6" />;
      default:
        return <Brain className="h-6 w-6" />;
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${
      isSelected ? 'ring-2 ring-therapy-500 bg-therapy-50' : ''
    }`}>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${therapist.colorScheme} text-white`}>
            {getIcon(therapist.icon)}
          </div>
          <div>
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

export default TherapistCard;
