import React from 'react';
import therapyAICoreIcon from '@/assets/icons/therapy-ai-core.svg';

interface TherapyAICoreProps {
  className?: string;
  size?: number;
}

const TherapyAICore: React.FC<TherapyAICoreProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={therapyAICoreIcon} 
      alt="TherapySync AI Core" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default TherapyAICore;