import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { therapistPersonas } from './TherapistAvatarPersonas';

interface SimplifiedAvatarDisplayProps {
  therapistId: string;
  therapistName: string;
  className?: string;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SimplifiedAvatarDisplay: React.FC<SimplifiedAvatarDisplayProps> = ({ 
  therapistId,
  therapistName,
  className = "",
  showName = true,
  size = 'md'
}) => {
  // Safely get persona with error handling
  let persona;
  try {
    persona = therapistPersonas[therapistId];
  } catch (error) {
    console.warn('Error loading therapist persona:', error);
    persona = null;
  }
  
  const initials = therapistName.split(' ').map(n => n.charAt(0)).join('').slice(0, 2);
  
  // Size configurations
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16", 
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  };
  
  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl", 
    xl: "text-3xl"
  };

  // Get persona-specific colors
  const avatarStyle = persona ? {
    backgroundColor: persona.appearance.colorPalette.clothing,
  } : {};

  const fallbackClasses = persona 
    ? "text-white font-bold"
    : "bg-gradient-to-r from-therapy-500 to-calm-500 text-white font-bold";

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} border-2 border-white shadow-lg`}>
          <AvatarFallback 
            className={`${fallbackClasses} ${textSizes[size]}`}
            style={persona ? avatarStyle : {}}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {/* Persona-based accent indicator */}
        {persona && (
          <div 
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
            style={{ backgroundColor: persona.appearance.colorPalette.accent }}
          />
        )}
      </div>
      
      {showName && (
        <div className="text-center mt-2">
          <p className="text-sm font-medium text-gray-900">{therapistName}</p>
          {persona && (
            <p className="text-xs text-muted-foreground capitalize">
              {persona.personality.approachStyle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SimplifiedAvatarDisplay;