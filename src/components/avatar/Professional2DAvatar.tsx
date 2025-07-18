import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatarImage, hasAnyAvatarImages } from '@/utils/avatarImageImports';

interface Professional2DAvatarProps {
  therapistId: string;
  therapistName: string;
  className?: string;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
  isListening?: boolean;
  isSpeaking?: boolean;
  showVoiceIndicator?: boolean;
  therapeuticMode?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

const Professional2DAvatar: React.FC<Professional2DAvatarProps> = ({
  therapistId,
  therapistName,
  className = "w-full h-full",
  showName = true,
  size = 'lg',
  emotion = 'neutral',
  isListening = false,
  isSpeaking = false,
  showVoiceIndicator = true,
  therapeuticMode = true,
  onLoad,
  onError
}) => {
  const [imageError, setImageError] = useState(false);
  // Add safety checks
  if (!therapistId || !therapistName) {
    console.warn('Professional2DAvatar: Missing required props', { therapistId, therapistName });
    return (
      <div className={`${className} flex flex-col items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg`}>
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-2">
            AI
          </div>
          <p className="text-sm font-medium text-therapy-700">AI Therapist</p>
        </div>
      </div>
    );
  }

  // Get professional avatar image safely
  const avatarImage = getAvatarImage(therapistId);
  const hasImages = hasAnyAvatarImages();
  
  // Debug logging
  console.log('Professional2DAvatar:', { therapistId, avatarImage, hasImages, imageError });

  // Generate initials safely
  const getInitials = (name: string): string => {
    try {
      return name
        .split(' ')
        .map(n => n.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase();
    } catch {
      return 'AI';
    }
  };

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

  // Get color based on therapist ID for fallback
  const getTherapistColor = (id: string): string => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-red-500 to-red-600',
      'from-yellow-500 to-yellow-600',
      'from-indigo-500 to-indigo-600',
      'from-pink-500 to-pink-600',
      'from-teal-500 to-teal-600',
      'from-orange-500 to-orange-600',
      'from-cyan-500 to-cyan-600'
    ];
    
    // Simple hash function to get consistent color
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash + id.charCodeAt(i)) & 0xffffffff;
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials(therapistName);
  const colorClass = getTherapistColor(therapistId);

  // Determine status indicator based on emotion and activity
  const getStatusColor = () => {
    if (isSpeaking) return 'bg-green-500';
    if (isListening) return 'bg-blue-500';
    if (emotion === 'happy' || emotion === 'encouraging') return 'bg-yellow-500';
    if (emotion === 'concerned') return 'bg-orange-500';
    return 'bg-green-500'; // default online status
  };

  // Apply emotion-based styling with therapeutic enhancements
  const getEmotionStyling = () => {
    const baseClasses = "transition-all duration-500 ease-in-out";
    
    switch (emotion) {
      case 'happy':
      case 'encouraging':
        return `${baseClasses} brightness-110 saturate-110 ring-2 ring-therapy-200 shadow-therapy-glow`;
      case 'concerned':
        return `${baseClasses} brightness-90 contrast-110 ring-2 ring-orange-200 shadow-orange-glow`;
      case 'thoughtful':
        return `${baseClasses} brightness-95 contrast-105 ring-2 ring-calm-200 shadow-calm-glow`;
      default:
        return `${baseClasses} ring-2 ring-therapy-100 shadow-therapy-subtle`;
    }
  };

  // Voice visualization circles
  const VoiceVisualization = () => {
    if (!showVoiceIndicator || (!isSpeaking && !isListening)) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Voice wave circles */}
        <div className={`absolute inset-0 rounded-full border-2 ${
          isSpeaking ? 'border-green-400 animate-ping' : 'border-blue-400 animate-pulse'
        } opacity-50`} />
        <div className={`absolute inset-1 rounded-full border-2 ${
          isSpeaking ? 'border-green-300 animate-ping' : 'border-blue-300 animate-pulse'
        } opacity-30 animation-delay-200`} />
        <div className={`absolute inset-2 rounded-full border-2 ${
          isSpeaking ? 'border-green-200 animate-ping' : 'border-blue-200 animate-pulse'
        } opacity-20 animation-delay-400`} />
      </div>
    );
  };

  return (
    <div className={`${className} flex flex-col items-center justify-center`}>
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} border-2 border-white shadow-lg ${getEmotionStyling()}`}>
          {avatarImage && hasImages && !imageError ? (
            <AvatarImage 
              src={avatarImage} 
              alt={`${therapistName} professional headshot`}
              className="object-cover"
              onLoad={() => {
                console.log(`Avatar loaded successfully for ${therapistName}`);
                onLoad?.();
              }}
              onError={(e) => {
                console.warn(`Avatar failed to load for ${therapistName}:`, e);
                console.warn('Avatar image path:', avatarImage);
                setImageError(true);
                onError?.(new Error(`Avatar image failed to load for ${therapistName}`));
              }}
            />
          ) : null}
          <AvatarFallback 
            className={`bg-gradient-to-r ${colorClass} text-white font-bold ${textSizes[size]}`}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {/* Voice Visualization */}
        <VoiceVisualization />
      </div>
      
      {showName && (
        <div className="text-center mt-2">
          <p className="text-sm font-medium text-gray-900">{therapistName}</p>
          <p className="text-xs text-muted-foreground">AI Therapist</p>
          {(isListening || isSpeaking) && (
            <p className="text-xs text-therapy-600 font-medium">
              {isListening ? 'Listening...' : 'Speaking...'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Professional2DAvatar;