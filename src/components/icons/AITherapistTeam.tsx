import React from 'react';
import aiTherapistTeamIcon from '@/assets/icons/ai-therapist-team.svg';

interface AITherapistTeamProps {
  className?: string;
  size?: number;
}

const AITherapistTeam: React.FC<AITherapistTeamProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={aiTherapistTeamIcon} 
      alt="AI Therapist Team" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default AITherapistTeam;