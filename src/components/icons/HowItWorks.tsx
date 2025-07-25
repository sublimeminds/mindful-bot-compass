import React from 'react';
import howItWorksIcon from '@/assets/icons/how-it-works.svg';

interface HowItWorksProps {
  className?: string;
  size?: number;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={howItWorksIcon} 
      alt="How It Works" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default HowItWorks;