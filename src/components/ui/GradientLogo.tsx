
import React from 'react';

interface GradientLogoProps {
  className?: string;
  size?: 'micro' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'hero';
}

const GradientLogo = ({ 
  className = '', 
  size = 'md'
}: GradientLogoProps) => {
  const sizeClasses = {
    micro: 'w-4 h-4',
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    xxl: 'w-48 h-48',
    hero: 'w-64 h-64'
  };

  console.log('GradientLogo - rendering with wellness brand logo, size:', size);

  return (
    <div className={`${sizeClasses[size]} ${className} relative flex items-center justify-center`}>
      <img 
        src="/lovable-uploads/24c86eb9-4983-4fdc-a4b4-94e0db57ebd2.png"
        alt="TherapySync - AI Therapy Companion"
        className="w-full h-full object-contain animate-swirl-breathe drop-shadow-lg"
      />
    </div>
  );
};

export default GradientLogo;
