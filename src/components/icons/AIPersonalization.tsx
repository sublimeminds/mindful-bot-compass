import React from 'react';
import aiPersonalizationIcon from '@/assets/icons/ai-personalization.svg';

interface AIPersonalizationProps {
  className?: string;
  size?: number;
}

const AIPersonalization: React.FC<AIPersonalizationProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={aiPersonalizationIcon} 
      alt="AI Personalization" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default AIPersonalization;