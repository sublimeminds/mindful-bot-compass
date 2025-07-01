
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Hide the image and show the fallback SVG
    e.currentTarget.style.display = 'none';
    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
    if (fallback) {
      fallback.style.display = 'block';
    }
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative flex items-center justify-center`}>
      <img 
        src="/lovable-uploads/24c86eb9-4983-4fdc-a4b4-94e0db57ebd2.png"
        alt="TherapySync - AI Therapy Companion"
        className="w-full h-full object-contain animate-swirl-breathe drop-shadow-lg"
        onError={handleImageError}
      />
      {/* SVG Fallback Logo */}
      <svg 
        className="w-full h-full object-contain animate-swirl-breathe drop-shadow-lg hidden"
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b35" />
            <stop offset="50%" stopColor="#4ecdc4" />
            <stop offset="100%" stopColor="#ff6b9d" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#grad1)" />
        <circle cx="50" cy="50" r="35" fill="white" fillOpacity="0.9" />
        <path 
          d="M35 40 C35 35, 40 30, 50 30 C60 30, 65 35, 65 40 C65 50, 50 70, 50 70 C50 70, 35 50, 35 40 Z" 
          fill="url(#grad1)"
        />
      </svg>
    </div>
  );
};

export default GradientLogo;
