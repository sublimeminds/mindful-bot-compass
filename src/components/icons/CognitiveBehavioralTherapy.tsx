import React from 'react';
import cognitiveBehavioralTherapyIcon from '@/assets/icons/cognitive-behavioral-therapy.svg';

interface CognitiveBehavioralTherapyProps {
  className?: string;
  size?: number;
}

const CognitiveBehavioralTherapy: React.FC<CognitiveBehavioralTherapyProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={cognitiveBehavioralTherapyIcon} 
      alt="Cognitive Behavioral Therapy" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default CognitiveBehavioralTherapy;