import React from 'react';
import supportCenterIcon from '@/assets/icons/support-center.svg';

interface SupportCenterProps {
  className?: string;
  size?: number;
}

const SupportCenter: React.FC<SupportCenterProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={supportCenterIcon} 
      alt="Support Center" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default SupportCenter;