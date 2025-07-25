import React from 'react';
import forFamiliesIcon from '@/assets/icons/for-families.svg';

interface ForFamiliesProps {
  className?: string;
  size?: number;
}

const ForFamilies: React.FC<ForFamiliesProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={forFamiliesIcon} 
      alt="For Families" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default ForFamilies;