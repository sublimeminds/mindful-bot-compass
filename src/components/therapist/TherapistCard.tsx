
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brain, Heart, RefreshCw, Clock } from "lucide-react";

interface Therapist {
  id: string;
  name: string;
  title: string;
  description: string;
  approach: string;
  specialties: string[];
  communicationStyle: string;
  icon: string;
  colorScheme: string;
}

interface TherapistCardProps {
  therapist: Therapist;
  isActive?: boolean;
  onSwitch?: () => void;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ 
  therapist, 
  isActive = false, 
  onSwitch 
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart':
        return <Heart className="h-5 w-5" />;
      case 'Brain':
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  return (
    <Card className={`relative ${isActive ? 'ring-2 ring-therapy-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`/therapist-${therapist.id}.jpg`} />
              <AvatarFallback className="bg-therapy-100 text-therapy-700">
                {getIcon(therapist.icon)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">{therapist.name}</h3>
              <p className="text-xs text-muted-foreground">{therapist.title}</p>
            </div>
          </div>
          {isActive && (
            <div className="flex items-center space-x-1 text-green-600">
              <Clock className="h-3 w-3" />
              <span className="text-xs font-medium">Active</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Approach */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Approach</p>
          <Badge variant="secondary" className="text-xs">
            {therapist.approach}
          </Badge>
        </div>

        {/* Communication Style */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Style</p>
          <p className="text-xs">{therapist.communicationStyle}</p>
        </div>

        {/* Specialties */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Specialties</p>
          <div className="flex flex-wrap gap-1">
            {therapist.specialties.slice(0, 3).map((specialty, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {therapist.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{therapist.specialties.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {therapist.description}
        </p>

        {/* Switch Therapist Button */}
        {onSwitch && (
          <Button
            onClick={onSwitch}
            variant="outline"
            size="sm"
            className="w-full text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Switch Therapist
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TherapistCard;
