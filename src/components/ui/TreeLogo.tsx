
import React, { useState } from 'react';

interface TreeLogoProps {
  className?: string;
  size?: 'micro' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const TreeLogo = ({ 
  className = '', 
  size = 'md'
}: TreeLogoProps) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    micro: 'w-4 h-4',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    xxl: 'w-30 h-30'
  };

  // Enhanced fallback with tree theme
  const FallbackLogo = () => (
    <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-therapy-500 to-calm-500 rounded-full flex items-center justify-center shadow-lg`}>
      <div className="text-white font-bold text-center leading-none">
        {size === 'micro' || size === 'sm' ? (
          <span className="text-xs">🌳</span>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-lg">🌳</span>
            <span className="text-xs font-semibold">TS</span>
          </div>
        )}
      </div>
    </div>
  );

  console.log('TreeLogo - imageError:', imageError, 'imagePath:', '/lovable-uploads/f8d0800a-6eda-4bb4-9ee4-faad8e8c120c.png');

  if (imageError) {
    return <FallbackLogo />;
  }

  return (
    <img 
      src="/lovable-uploads/f8d0800a-6eda-4bb4-9ee4-faad8e8c120c.png"
      alt="TherapySync Tree Logo" 
      className={`${sizeClasses[size]} ${className} object-contain transition-all duration-300 hover:scale-105 drop-shadow-sm`}
      onError={(e) => {
        console.error('TreeLogo image failed to load:', e);
        setImageError(true);
      }}
      onLoad={() => {
        console.log('TreeLogo image loaded successfully');
      }}
    />
  );
};

export default TreeLogo;
