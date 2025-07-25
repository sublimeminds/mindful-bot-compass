import React from 'react';
import voiceAITherapyIcon from '@/assets/icons/voice-ai-therapy.svg';

interface VoiceAITherapyProps {
  className?: string;
  size?: number;
}

const VoiceAITherapy: React.FC<VoiceAITherapyProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={voiceAITherapyIcon} 
      alt="Voice AI Therapy" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default VoiceAITherapy;