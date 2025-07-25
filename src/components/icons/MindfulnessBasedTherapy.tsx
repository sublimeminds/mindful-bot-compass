import React from 'react';
import mindfulnessBasedTherapyIcon from '@/assets/icons/mindfulness-based-therapy.svg';

interface MindfulnessBasedTherapyProps {
  className?: string;
  size?: number;
}

const MindfulnessBasedTherapy: React.FC<MindfulnessBasedTherapyProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={mindfulnessBasedTherapyIcon} 
      alt="Mindfulness-Based Therapy" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default MindfulnessBasedTherapy;