import React from 'react';
import healthcareProvidersIcon from '@/assets/icons/healthcare-providers.svg';

interface HealthcareProvidersProps {
  className?: string;
  size?: number;
}

const HealthcareProviders: React.FC<HealthcareProvidersProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={healthcareProvidersIcon} 
      alt="Healthcare Providers" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default HealthcareProviders;