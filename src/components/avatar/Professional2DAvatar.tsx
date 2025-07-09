import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Import professional avatar images
import drSarahChenImage from '@/assets/avatars/dr-sarah-chen.jpg';
import drMichaelTorresImage from '@/assets/avatars/dr-michael-torres.jpg';
import drAishaPatelImage from '@/assets/avatars/dr-aisha-patel.jpg';
import drJamesWilsonImage from '@/assets/avatars/dr-james-wilson.jpg';
import drEmilyRodriguezImage from '@/assets/avatars/dr-emily-rodriguez.jpg';
import drDavidKimImage from '@/assets/avatars/dr-david-kim.jpg';

interface Professional2DAvatarProps {
  therapistId: string;
  therapistName: string;
  className?: string;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
  isListening?: boolean;
  isSpeaking?: boolean;
}

const Professional2DAvatar: React.FC<Professional2DAvatarProps> = ({
  therapistId,
  therapistName,
  className = "w-full h-full",
  showName = true,
  size = 'lg',
  emotion = 'neutral',
  isListening = false,
  isSpeaking = false
}) => {
  // Map therapist IDs to their professional images
  const avatarImages: Record<string, string> = {
    'dr-sarah-chen': drSarahChenImage,
    'dr-michael-torres': drMichaelTorresImage,
    'dr-aisha-patel': drAishaPatelImage,
    'dr-james-wilson': drJamesWilsonImage,
    'dr-emily-rodriguez': drEmilyRodriguezImage,
    'dr-david-kim': drDavidKimImage,
    // Add legacy mappings for any missing IDs
    'dr-maya-patel': drAishaPatelImage, // fallback
    'dr-alex-rodriguez': drEmilyRodriguezImage, // fallback
  };

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
  const avatarImage = avatarImages[therapistId];

  // Determine status indicator based on emotion and activity
  const getStatusColor = () => {
    if (isSpeaking) return 'bg-green-500';
    if (isListening) return 'bg-blue-500';
    if (emotion === 'happy' || emotion === 'encouraging') return 'bg-yellow-500';
    if (emotion === 'concerned') return 'bg-orange-500';
    return 'bg-green-500'; // default online status
  };

  // Apply emotion-based styling
  const getEmotionStyling = () => {
    const baseClasses = "transition-all duration-300";
    switch (emotion) {
      case 'happy':
      case 'encouraging':
        return `${baseClasses} brightness-110 saturate-110`;
      case 'concerned':
        return `${baseClasses} brightness-90 contrast-110`;
      case 'thoughtful':
        return `${baseClasses} brightness-95 contrast-105`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className={`${className} flex flex-col items-center justify-center`}>
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} border-2 border-white shadow-lg ${getEmotionStyling()}`}>
          {avatarImage ? (
            <AvatarImage 
              src={avatarImage} 
              alt={`${therapistName} professional headshot`}
              className="object-cover"
            />
          ) : null}
          <AvatarFallback 
            className={`bg-gradient-to-r ${colorClass} text-white font-bold ${textSizes[size]}`}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {/* Status indicator */}
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor()} rounded-full border-2 border-white`}>
          {isListening && (
            <div className="absolute inset-0 bg-blue-300 rounded-full animate-pulse"></div>
          )}
          {isSpeaking && (
            <div className="absolute inset-0 bg-green-300 rounded-full animate-bounce"></div>
          )}
        </div>
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