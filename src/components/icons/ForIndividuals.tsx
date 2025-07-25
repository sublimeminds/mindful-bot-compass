import React from 'react';
import forIndividualsIcon from '@/assets/icons/for-individuals.svg';

interface ForIndividualsProps {
  className?: string;
  size?: number;
}

const ForIndividuals: React.FC<ForIndividualsProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={forIndividualsIcon} 
      alt="For Individuals" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default ForIndividuals;