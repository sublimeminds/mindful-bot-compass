import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getPlaceholderAvatar, getInitials, getTherapistColor } from '@/utils/safeAvatarSystem';
import { getTherapistAvatarById } from '@/utils/therapistAvatarImages';
import { useTherapist } from '@/hooks/useTherapistDatabase';

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
  const { therapist, loading } = useTherapist(therapistId);

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

  // Get avatar source with database-first approach
  const getAvatarSrc = () => {
    // Use database avatar URL if available
    if (therapist?.avatar_image_url) {
      return therapist.avatar_image_url;
    }
    
    // Fallback to AI-generated avatars
    const aiGeneratedAvatar = getTherapistAvatarById(therapistId || 'default');
    if (aiGeneratedAvatar) return aiGeneratedAvatar;
    
    // Then try placeholder avatar
    const placeholderSrc = getPlaceholderAvatar(therapistId || 'default');
    if (placeholderSrc) return placeholderSrc;
    
    return null;
  };

  const displayName = therapist?.name || therapistName || 'AI Therapist';
  const initials = getInitials(displayName);
  const colorClass = getTherapistColor(therapistId || 'default');
  const avatarSrc = getAvatarSrc();

  if (loading) {
    return (
      <div className={`${className} flex flex-col items-center justify-center`}>
        <div className={`${sizeClasses[size]} bg-muted animate-pulse rounded-full border-2 border-white shadow-lg`} />
        {showName && (
          <div className="text-center mt-2">
            <div className="h-4 w-16 bg-muted animate-pulse rounded mb-1" />
            <div className="h-3 w-12 bg-muted animate-pulse rounded" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${className} flex flex-col items-center justify-center`} onClick={onClick}>
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} border-2 border-white shadow-lg transition-all duration-300 hover:scale-105`}>
          <AvatarImage 
            src={avatarSrc}
            alt={`${displayName} avatar`}
            className="object-cover"
          />
          <AvatarFallback 
            className={`bg-gradient-to-r ${colorClass} text-white font-bold ${textSizes[size]}`}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        
      </div>
      
      {showName && (
        <div className="text-center mt-2">
          <p className="text-sm font-medium text-gray-900">{displayName}</p>
          <p className="text-xs text-muted-foreground">{therapist?.title || 'AI Therapist'}</p>
        </div>
      )}
    </div>
  );
};

export default SafeBulletproofAvatar;