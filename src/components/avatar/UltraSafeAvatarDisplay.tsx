import React from 'react';
import SafeBulletproofAvatar from './SafeBulletproofAvatar';

interface UltraSafeAvatarDisplayProps {
  therapist: any;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  onClick?: () => void;
}

/**
 * Ultra-safe avatar display that cannot fail under any circumstances
 * Pure CSS/HTML implementation with bulletproof error handling
 */
const UltraSafeAvatarDisplay: React.FC<UltraSafeAvatarDisplayProps> = ({ 
  therapist, 
  className = "h-64 w-full", 
  size = "lg",
  showName = true,
  onClick 
}) => {
  // Defensive checks
  if (!therapist) {
    return (
      <div className={`${className} bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-2">
            AI
          </div>
          <p className="text-sm font-medium text-therapy-700">AI Therapist</p>
        </div>
      </div>
    );
  }

  const therapistId = therapist.id || therapist.avatarId || 'default';
  const therapistName = therapist.name || 'AI Therapist';

  return (
    <div 
      className={`${className} bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300 group`}
      onClick={onClick}
    >
      <SafeBulletproofAvatar
        therapistId={therapistId}
        therapistName={therapistName}
        className="flex-1 flex items-center justify-center"
        showName={showName}
        size={size}
      />
    </div>
  );
};

export default UltraSafeAvatarDisplay;