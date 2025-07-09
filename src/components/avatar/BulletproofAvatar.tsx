import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface BulletproofAvatarProps {
  therapistId: string;
  therapistName: string;
  className?: string;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const BulletproofAvatar: React.FC<BulletproofAvatarProps> = ({
  therapistId,
  therapistName,
  className = "w-full h-full",
  showName = true,
  size = 'lg'
}) => {
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

  // Get color based on therapist ID
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

  return (
    <div className={`${className} flex flex-col items-center justify-center`}>
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} border-2 border-white shadow-lg`}>
          <AvatarFallback 
            className={`bg-gradient-to-r ${colorClass} text-white font-bold ${textSizes[size]}`}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {/* Simple indicator dot */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
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

export default BulletproofAvatar;