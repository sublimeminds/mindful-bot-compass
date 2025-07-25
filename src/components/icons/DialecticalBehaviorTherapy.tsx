import React from 'react';
import dialecticalBehaviorTherapyIcon from '@/assets/icons/dialectical-behavior-therapy.svg';

interface DialecticalBehaviorTherapyProps {
  className?: string;
  size?: number;
}

const DialecticalBehaviorTherapy: React.FC<DialecticalBehaviorTherapyProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={dialecticalBehaviorTherapyIcon} 
      alt="Dialectical Behavior Therapy" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default DialecticalBehaviorTherapy;