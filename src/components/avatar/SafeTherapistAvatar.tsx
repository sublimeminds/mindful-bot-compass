import React, { useState, useEffect } from 'react';
import AvatarErrorBoundary from './AvatarErrorBoundary';
import BulletproofAvatar from './BulletproofAvatar';
import UniversalTherapistAvatar from './UniversalTherapistAvatar';

interface SafeTherapistAvatarProps {
  therapistId: string;
  therapistName: string;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
  isListening?: boolean;
  isSpeaking?: boolean;
  showControls?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  prefer2D?: boolean;
}

const SafeTherapistAvatar: React.FC<SafeTherapistAvatarProps> = ({
  therapistId,
  therapistName,
  emotion = 'neutral',
  isListening = false,
  isSpeaking = false,
  showControls = false,
  className = "w-full h-full",
  size = 'lg',
  prefer2D = false
}) => {
  const [avatarMode, setAvatarMode] = useState<'3d' | '2d'>('2d');
  const [retryCount, setRetryCount] = useState(0);

  // Start with 2D by default for reliability
  useEffect(() => {
    if (!prefer2D && retryCount === 0) {
      // Only try 3D if not preferring 2D and haven't failed yet
      const timer = setTimeout(() => {
        setAvatarMode('3d');
      }, 100); // Small delay to ensure context is ready
      
      return () => clearTimeout(timer);
    }
  }, [prefer2D, retryCount]);

  const handleAvatarError = () => {
    console.warn(`3D Avatar failed for ${therapistName}, falling back to 2D`);
    setAvatarMode('2d');
    setRetryCount(prev => prev + 1);
  };

  // Always use 2D if we prefer it or have had errors
  if (avatarMode === '2d' || prefer2D || retryCount > 0) {
    return (
      <div className={className}>
        <BulletproofAvatar
          therapistId={therapistId}
          therapistName={therapistName}
          className="w-full h-full"
          showName={false}
          size={size}
        />
      </div>
    );
  }

  // Try 3D avatar with error boundary
  return (
    <div className={className}>
      <AvatarErrorBoundary
        therapistId={therapistId}
        therapistName={therapistName}
        fallback={
          <BulletproofAvatar
            therapistId={therapistId}
            therapistName={therapistName}
            className="w-full h-full"
            showName={false}
            size={size}
          />
        }
      >
        <UniversalTherapistAvatar
          therapistId={therapistId}
          therapistName={therapistName}
          emotion={emotion}
          isListening={isListening}
          isSpeaking={isSpeaking}
          showControls={showControls}
          className="w-full h-full"
          size={size}
          force2D={false}
          priority={1}
        />
      </AvatarErrorBoundary>
    </div>
  );
};

export default SafeTherapistAvatar;