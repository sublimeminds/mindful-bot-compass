import React from 'react';
import integrationsHubIcon from '@/assets/icons/integrations-hub.svg';

interface IntegrationsHubProps {
  className?: string;
  size?: number;
}

const IntegrationsHub: React.FC<IntegrationsHubProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={integrationsHubIcon} 
      alt="Integrations Hub" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default IntegrationsHub;