
import React, { useState } from 'react';

interface TreeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  loading?: boolean;
}

const TreeLogo = ({ 
  className = '', 
  size = 'md', 
  animated = false, 
  loading = false 
}: TreeLogoProps) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const animationClasses = animated 
    ? 'animate-tree-breathe hover:animate-tree-grow transition-all duration-300' 
    : '';
    
  const loadingClasses = loading 
    ? 'animate-tree-grow' 
    : '';

  // Fallback SVG tree if image fails to load
  const FallbackTree = () => (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      className={`${sizeClasses[size]} ${className} ${animationClasses} ${loadingClasses}`}
    >
      <path 
        d="M12 22V12M12 12C8 12 6 8 6 6C6 4 8 2 12 2C16 2 18 4 18 6C18 8 16 12 12 12Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-therapy-600"
      />
      <path 
        d="M12 12C9 12 7 10 7 8C7 7 8 6 12 6C16 6 17 7 17 8C17 10 15 12 12 12Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-therapy-500"
      />
      <path 
        d="M10 22H14" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
        className="text-therapy-800"
      />
    </svg>
  );

  if (imageError) {
    return <FallbackTree />;
  }

  return (
    <img 
      src="/lovable-uploads/a50bd5b4-30c0-4e4f-b4a3-2f4b4d90826a.png"
      alt="TherapySync Tree Logo" 
      className={`${sizeClasses[size]} ${className} ${animationClasses} ${loadingClasses} object-contain`}
      onError={() => setImageError(true)}
    />
  );
};

export default TreeLogo;
