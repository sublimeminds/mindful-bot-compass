import React from 'react';
import mentalHealthLibraryIcon from '@/assets/icons/mental-health-library.svg';

interface MentalHealthLibraryProps {
  className?: string;
  size?: number;
}

const MentalHealthLibrary: React.FC<MentalHealthLibraryProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={mentalHealthLibraryIcon} 
      alt="Mental Health Library" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default MentalHealthLibrary;