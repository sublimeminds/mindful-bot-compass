import React from 'react';
import culturalAIIcon from '@/assets/icons/cultural-ai.svg';

interface CulturalAIProps {
  className?: string;
  size?: number;
}

const CulturalAI: React.FC<CulturalAIProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={culturalAIIcon} 
      alt="Cultural AI" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default CulturalAI;