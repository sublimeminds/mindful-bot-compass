import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SimpleAvatarFallbackProps {
  name: string;
  therapistId?: string;
  className?: string;
  showName?: boolean;
}

const SimpleAvatarFallback: React.FC<SimpleAvatarFallbackProps> = ({
  name,
  therapistId,
  className = "w-full h-full",
  showName = true
}) => {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const getColorFromName = (name: string): string => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-red-500 to-red-600',
      'from-yellow-500 to-yellow-600',
      'from-indigo-500 to-indigo-600',
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) & 0xffffffff;
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials(name);
  const colorClass = getColorFromName(name);

  return (
    <div className={`${className} flex flex-col items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg`}>
      <Avatar className="w-24 h-24 border-2 border-white shadow-lg">
        <AvatarFallback className={`bg-gradient-to-r ${colorClass} text-white font-bold text-2xl`}>
          {initials}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <div className="text-center mt-2">
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-muted-foreground">AI Therapist</p>
        </div>
      )}
    </div>
  );
};

export default SimpleAvatarFallback;