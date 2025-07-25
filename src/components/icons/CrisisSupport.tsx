import React from 'react';
import crisisSupportIcon from '@/assets/icons/crisis-support.svg';

interface CrisisSupportProps {
  className?: string;
  size?: number;
}

const CrisisSupport: React.FC<CrisisSupportProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={crisisSupportIcon} 
      alt="Crisis Support" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default CrisisSupport;