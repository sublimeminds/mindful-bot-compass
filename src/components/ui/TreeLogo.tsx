
import React, { useState } from 'react';

interface TreeLogoProps {
  className?: string;
  size?: 'micro' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'hero';
}

const TreeLogo = ({ 
  className = '', 
  size = 'md'
}: TreeLogoProps) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    micro: 'w-4 h-4',
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    xxl: 'w-48 h-48',
    hero: 'w-64 h-64'
  };

  // Enhanced fallback with tree theme
  const FallbackLogo = () => (
    <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-therapy-500 to-calm-500 rounded-full flex items-center justify-center shadow-lg`}>
      <div className="text-white font-bold text-center leading-none">
        {size === 'micro' || size === 'sm' ? (
          <span className="text-xs">🌳</span>
        ) : (
          <div className="flex flex-col items-center">
            <span className={size === 'hero' ? 'text-6xl' : size === 'xxl' ? 'text-4xl' : 'text-2xl'}>🌳</span>
            {size !== 'hero' && <span className="text-xs font-semibold">TS</span>}
          </div>
        )}
      </div>
    </div>
  );

  console.log('TreeLogo - imageError:', imageError, 'imagePath:', '/lovable-uploads/d0afa7e0-63e0-4951-a3b8-529fcf32b24a.png');

  if (imageError) {
    return <FallbackLogo />;
  }

  return (
    <img 
      src="/lovable-uploads/d0afa7e0-63e0-4951-a3b8-529fcf32b24a.png"
      alt="TherapySync Tree Logo" 
      className={`${sizeClasses[size]} ${className} object-contain transition-all duration-300 hover:scale-105 drop-shadow-lg`}
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
