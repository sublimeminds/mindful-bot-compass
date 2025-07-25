import React from 'react';
import therapistDirectoryIcon from '@/assets/icons/therapist-directory.svg';

interface TherapistDirectoryProps {
  className?: string;
  size?: number;
}

const TherapistDirectory: React.FC<TherapistDirectoryProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={therapistDirectoryIcon} 
      alt="Therapist Directory" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default TherapistDirectory;