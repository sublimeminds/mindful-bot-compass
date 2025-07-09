import React, { Suspense } from 'react';
import PerformanceOptimizedAvatar from './PerformanceOptimizedAvatar';
import SimpleAvatarFallback from './SimpleAvatarFallback';
import { therapistPersonas } from './TherapistAvatarPersonas';
import { getAvatarIdForTherapist } from '@/services/therapistAvatarMapping';

interface UniversalTherapistAvatarProps {
  therapistId: string;
  therapistName?: string;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
  isListening?: boolean;
  isSpeaking?: boolean;
  userEmotion?: string;
  lipSyncData?: Float32Array;
  showControls?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  force2D?: boolean; // Option to force 2D fallback
  priority?: number; // For performance optimization
}

const UniversalTherapistAvatar: React.FC<UniversalTherapistAvatarProps> = ({
  therapistId,
  therapistName,
  emotion = 'neutral',
  isListening = false,
  isSpeaking = false,
  userEmotion,
  lipSyncData,
  showControls = true,
  className = "w-full h-full",
  size = 'lg',
  force2D = false,
  priority = 0
}) => {
  // Map therapist ID to avatar persona
  const avatarId = getAvatarIdForTherapist(therapistId);
  const persona = therapistPersonas[avatarId];
  const displayName = therapistName || persona?.name || 'Therapist';

  // Progressive enhancement approach
  if (force2D) {
    return (
      <div className={className}>
        <SimpleAvatarFallback 
          name={displayName}
          therapistId={avatarId}
          className="w-full h-full"
          showName={false}
        />
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      <Suspense 
        fallback={
          <SimpleAvatarFallback 
            name={displayName}
            therapistId={avatarId}
            className="w-full h-full"
            showName={false}
          />
        }
      >
        <PerformanceOptimizedAvatar
          therapistId={avatarId}
          therapistName={displayName}
          emotion={emotion}
          isListening={isListening}
          isSpeaking={isSpeaking}
          userEmotion={userEmotion}
          lipSyncData={lipSyncData}
          showControls={showControls}
          className="w-full h-full"
          priority={priority}
          force2D={force2D}
        />
      </Suspense>
    </div>
  );
};

export default UniversalTherapistAvatar;