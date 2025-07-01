
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
      {/* Enhanced SVG Fallback Logo with restored vibrant therapy colors */}
      <svg 
        className="w-full h-full object-contain animate-swirl-breathe drop-shadow-lg hidden"
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="therapyGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(14, 85%, 59%)" />
            <stop offset="30%" stopColor="hsl(180, 75%, 54%)" />
            <stop offset="70%" stopColor="hsl(158, 70%, 49%)" />
            <stop offset="100%" stopColor="hsl(330, 78%, 59%)" />
          </linearGradient>
          <linearGradient id="therapyGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(14, 85%, 69%)" />
            <stop offset="50%" stopColor="hsl(180, 75%, 64%)" />
            <stop offset="100%" stopColor="hsl(330, 78%, 69%)" />
          </linearGradient>
          <radialGradient id="therapyGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(14, 85%, 59%)" stopOpacity="0.4" />
            <stop offset="40%" stopColor="hsl(180, 75%, 54%)" stopOpacity="0.2" />
            <stop offset="80%" stopColor="hsl(158, 70%, 49%)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(330, 78%, 59%)" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Outer glow circle */}
        <circle cx="50" cy="50" r="48" fill="url(#therapyGlowGrad)" />
        
        {/* Main gradient circle */}
        <circle cx="50" cy="50" r="42" fill="url(#therapyGrad1)" />
        
        {/* Inner highlight circle */}
        <circle cx="50" cy="50" r="32" fill="white" fillOpacity="0.95" />
        
        {/* Therapeutic heart symbol */}
        <path 
          d="M35 40 C35 35, 40 30, 50 30 C60 30, 65 35, 65 40 C65 50, 50 70, 50 70 C50 70, 35 50, 35 40 Z" 
          fill="url(#therapyGrad2)"
        />
        
        {/* Additional healing elements */}
        <circle cx="42" cy="38" r="2" fill="hsl(14, 85%, 59%)" opacity="0.8" />
        <circle cx="58" cy="38" r="2" fill="hsl(180, 75%, 54%)" opacity="0.8" />
        <circle cx="50" cy="45" r="1.5" fill="white" opacity="0.9" />
      </svg>
    </div>
  );
};

export default GradientLogo;
