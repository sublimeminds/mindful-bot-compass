import React from 'react';
import apiAccessIcon from '@/assets/icons/api-access.svg';

interface APIAccessProps {
  className?: string;
  size?: number;
}

const APIAccess: React.FC<APIAccessProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={apiAccessIcon} 
      alt="API Access" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default APIAccess;