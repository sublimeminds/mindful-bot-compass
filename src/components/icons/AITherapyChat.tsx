import React from 'react';
import aiTherapyChatIcon from '@/assets/icons/ai-therapy-chat.svg';

interface AITherapyChatProps {
  className?: string;
  size?: number;
}

const AITherapyChat: React.FC<AITherapyChatProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={aiTherapyChatIcon} 
      alt="AI Therapy Chat" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default AITherapyChat;