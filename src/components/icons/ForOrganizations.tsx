import React from 'react';
import forOrganizationsIcon from '@/assets/icons/for-organizations.svg';

interface ForOrganizationsProps {
  className?: string;
  size?: number;
}

const ForOrganizations: React.FC<ForOrganizationsProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={forOrganizationsIcon} 
      alt="For Organizations" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default ForOrganizations;