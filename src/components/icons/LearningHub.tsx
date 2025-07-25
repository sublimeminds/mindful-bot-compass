import React from 'react';
import learningHubIcon from '@/assets/icons/learning-hub.svg';

interface LearningHubProps {
  className?: string;
  size?: number;
}

const LearningHub: React.FC<LearningHubProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={learningHubIcon} 
      alt="Learning Hub" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default LearningHub;