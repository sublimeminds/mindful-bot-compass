import React from 'react';
import mobileAppsIcon from '@/assets/icons/mobile-apps.svg';

interface MobileAppsProps {
  className?: string;
  size?: number;
}

const MobileApps: React.FC<MobileAppsProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={mobileAppsIcon} 
      alt="Mobile Apps" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default MobileApps;