import React from 'react';
import DIDAvatar from './DIDAvatar';

interface ReadyPlayerMeAvatarProps {
  therapistId?: string;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful' | 'empathetic';
  isListening?: boolean;
  isSpeaking?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

// Updated component that uses D-ID avatars instead of Ready Player Me
const ReadyPlayerMeAvatar: React.FC<ReadyPlayerMeAvatarProps> = (props) => {
  // Directly use the new D-ID avatar component
  return <DIDAvatar {...props} isAnimated={true} />;
};

export default ReadyPlayerMeAvatar;