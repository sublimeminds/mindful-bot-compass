import React from 'react';
import enterpriseSecurityIcon from '@/assets/icons/enterprise-security.svg';

interface EnterpriseSecurityProps {
  className?: string;
  size?: number;
}

const EnterpriseSecurity: React.FC<EnterpriseSecurityProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={enterpriseSecurityIcon} 
      alt="Enterprise Security" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default EnterpriseSecurity;