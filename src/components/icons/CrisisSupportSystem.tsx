import React from 'react';
import crisisSupportSystemIcon from '@/assets/icons/crisis-support-system.svg';

interface CrisisSupportSystemProps {
  className?: string;
  size?: number;
}

const CrisisSupportSystem: React.FC<CrisisSupportSystemProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={crisisSupportSystemIcon} 
      alt="Crisis Support System" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default CrisisSupportSystem;