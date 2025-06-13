
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
    <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-therapy-500 to-calm-500 rounded-full flex items-center justify-center`}>
      <span className="text-white font-bold text-xs">TS</span>
    </div>
  );

  if (imageError) {
    return <FallbackLogo />;
  }

  return (
    <img 
      src="/lovable-uploads/6a30691c-cd70-4f5c-b8f5-c67a33cab984.png"
      alt="TherapySync Logo" 
      className={`${sizeClasses[size]} ${className} object-contain rounded-full transition-all duration-300 hover:scale-110 hover:drop-shadow-lg`}
      onError={() => setImageError(true)}
    />
  );
};

export default TreeLogo;
