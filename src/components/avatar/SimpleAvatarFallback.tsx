import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { therapistPersonas } from './TherapistAvatarPersonas';

interface SimpleAvatarFallbackProps {
  name: string;
  className?: string;
  showName?: boolean;
  therapistId?: string;
}

const SimpleAvatarFallback: React.FC<SimpleAvatarFallbackProps> = ({ 
  name, 
  className = "w-16 h-16", 
  showName = true,
  therapistId 
}) => {
  const initials = name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2);
  
  // Get persona-specific styling if available
  const persona = therapistId ? therapistPersonas[therapistId] : null;
  const backgroundColor = persona?.appearance.colorPalette.clothing || 'from-therapy-500 to-calm-500';
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
      <div className="text-center">
        <Avatar className={className}>
          <AvatarFallback 
            className={`bg-gradient-to-r ${
              persona ? '' : 'from-therapy-500 to-calm-500'
            } text-white font-bold text-xl`}
            style={persona ? { backgroundColor: persona.appearance.colorPalette.clothing } : {}}
          >
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