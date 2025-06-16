
import React, { useState } from 'react';

interface TreeLogoProps {
  className?: string;
  size?: 'micro' | 'sm' | 'md' | 'lg' | 'xl';
}

const TreeLogo = ({ 
  className = '', 
  size = 'md'
}: TreeLogoProps) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    micro: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  // Simple fallback if image fails to load
  const FallbackLogo = () => (
    <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-therapy-500 to-calm-500 flex items-center justify-center`}>
      <span className="text-white font-bold text-xs">TS</span>
    </div>
  );

  if (imageError) {
    return <FallbackLogo />;
  }

  return (
    <img 
      src="/lovable-uploads/0aa199c0-064e-4e1a-b96c-2beda903c183.png"
      alt="TherapySync Logo" 
      className={`${sizeClasses[size]} ${className} object-contain transition-all duration-300 hover:scale-110 hover:drop-shadow-lg`}
      onError={() => setImageError(true)}
    />
  );
};

export default TreeLogo;
