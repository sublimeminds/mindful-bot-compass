import React from 'react';
import familyAccountSharingIcon from '@/assets/icons/family-account-sharing.svg';

interface FamilyAccountSharingProps {
  className?: string;
  size?: number;
}

const FamilyAccountSharing: React.FC<FamilyAccountSharingProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={familyAccountSharingIcon} 
      alt="Family Account Sharing" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default FamilyAccountSharing;