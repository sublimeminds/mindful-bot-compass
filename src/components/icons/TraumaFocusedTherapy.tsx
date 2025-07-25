import React from 'react';
import traumaFocusedTherapyIcon from '@/assets/icons/trauma-focused-therapy.svg';

interface TraumaFocusedTherapyProps {
  className?: string;
  size?: number;
}

const TraumaFocusedTherapy: React.FC<TraumaFocusedTherapyProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={traumaFocusedTherapyIcon} 
      alt="Trauma-Focused Therapy" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default TraumaFocusedTherapy;