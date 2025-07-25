import React from 'react';
import researchStudiesIcon from '@/assets/icons/research-studies.svg';

interface ResearchStudiesProps {
  className?: string;
  size?: number;
}

const ResearchStudies: React.FC<ResearchStudiesProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={researchStudiesIcon} 
      alt="Research & Studies" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default ResearchStudies;