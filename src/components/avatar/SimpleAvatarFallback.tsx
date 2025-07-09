import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SimpleAvatarFallbackProps {
  name: string;
  className?: string;
  showName?: boolean;
}

const SimpleAvatarFallback: React.FC<SimpleAvatarFallbackProps> = ({ 
  name, 
  className = "w-16 h-16", 
  showName = true 
}) => {
  const initials = name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2);
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
      <div className="text-center">
        <Avatar className={className}>
          <AvatarFallback className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white font-bold text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        {showName && (
          <p className="text-xs text-muted-foreground mt-2">{name}</p>
        )}
      </div>
    </div>
  );
};

export default SimpleAvatarFallback;