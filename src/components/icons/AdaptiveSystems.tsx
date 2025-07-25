import React from 'react';
import adaptiveSystemsIcon from '@/assets/icons/adaptive-systems.svg';

interface AdaptiveSystemsProps {
  className?: string;
  size?: number;
}

const AdaptiveSystems: React.FC<AdaptiveSystemsProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={adaptiveSystemsIcon} 
      alt="Adaptive Systems" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default AdaptiveSystems;