import React from 'react';
import groupTherapyAIIcon from '@/assets/icons/group-therapy-ai.svg';

interface GroupTherapyAIProps {
  className?: string;
  size?: number;
}

const GroupTherapyAI: React.FC<GroupTherapyAIProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={groupTherapyAIIcon} 
      alt="Group Therapy AI" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default GroupTherapyAI;