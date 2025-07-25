import React from 'react';
import wearableIntegrationIcon from '@/assets/icons/wearable-integration.svg';

interface WearableIntegrationProps {
  className?: string;
  size?: number;
}

const WearableIntegration: React.FC<WearableIntegrationProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={wearableIntegrationIcon} 
      alt="Wearable Integration" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default WearableIntegration;