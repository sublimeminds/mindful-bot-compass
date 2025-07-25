import React from 'react';
import customIntegrationsIcon from '@/assets/icons/custom-integrations.svg';

interface CustomIntegrationsProps {
  className?: string;
  size?: number;
}

const CustomIntegrations: React.FC<CustomIntegrationsProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={customIntegrationsIcon} 
      alt="Custom Integrations" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default CustomIntegrations;