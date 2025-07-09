import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getPlaceholderAvatar, getInitials, getTherapistColor } from '@/utils/safeAvatarSystem';

interface SafeBulletproofAvatarProps {
  therapistId: string;
  therapistName: string;
  className?: string;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

const SafeBulletproofAvatar: React.FC<SafeBulletproofAvatarProps> = ({
  therapistId,
  therapistName,
  className = "w-full h-full",
  showName = true,
  size = 'lg',
  onClick
}) => {
  // Size mappings
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

  const initials = getInitials(therapistName || 'AI Therapist');
  const colorClass = getTherapistColor(therapistId || 'default');
  const placeholderSrc = getPlaceholderAvatar(therapistId || 'default');

  return (
    <div className={`${className} flex flex-col items-center justify-center`} onClick={onClick}>
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} border-2 border-white shadow-lg transition-all duration-300 hover:scale-105`}>
          <AvatarImage 
            src={placeholderSrc}
            alt={`${therapistName} avatar`}
            className="object-cover"
          />
          <AvatarFallback 
            className={`bg-gradient-to-r ${colorClass} text-white font-bold ${textSizes[size]}`}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {/* Status indicator */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
          <div className="absolute inset-0 bg-green-300 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {showName && (
        <div className="text-center mt-2">
          <p className="text-sm font-medium text-gray-900">{therapistName}</p>
          <p className="text-xs text-muted-foreground">AI Therapist</p>
        </div>
      )}
    </div>
  );
};

export default SafeBulletproofAvatar;