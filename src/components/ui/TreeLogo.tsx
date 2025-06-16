
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
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
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
      src="/lovable-uploads/105532b4-a990-4684-939f-e3a17c36218b.png"
      alt="TherapySync Logo" 
      className={`${sizeClasses[size]} ${className} object-contain transition-all duration-300 hover:scale-105`}
      onError={() => setImageError(true)}
    />
  );
};

export default TreeLogo;
