
import React from 'react';

interface TreeLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const TreeLoadingSpinner = ({ size = 'md', message }: TreeLoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Tree growing animation */}
        <svg 
          viewBox="0 0 48 48" 
          className={`${sizeClasses[size]} animate-tree-growth`}
        >
          {/* Tree trunk */}
          <rect 
            x="22" 
            y="32" 
            width="4" 
            height="12" 
            fill="currentColor" 
            className="text-therapy-700 animate-trunk-grow"
          />
          
          {/* Tree canopy layers - growing from bottom to top */}
          <circle 
            cx="24" 
            cy="28" 
            r="8" 
            fill="currentColor" 
            className="text-therapy-400 animate-leaf-grow-1"
            style={{ animationDelay: '0.5s' }}
          />
          <circle 
            cx="24" 
            cy="22" 
            r="6" 
            fill="currentColor" 
            className="text-therapy-500 animate-leaf-grow-2"
            style={{ animationDelay: '1s' }}
          />
          <circle 
            cx="24" 
            cy="16" 
            r="4" 
            fill="currentColor" 
            className="text-therapy-600 animate-leaf-grow-3"
            style={{ animationDelay: '1.5s' }}
          />
          
          {/* Roots */}
          <path 
            d="M22 44 Q18 46 16 48 M26 44 Q30 46 32 48 M24 44 Q24 46 24 48"
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none"
            className="text-therapy-800 animate-roots-grow"
            style={{ animationDelay: '0.2s' }}
          />
        </svg>
        
        {/* Floating particles around tree */}
        <div className="absolute inset-0 animate-leaf-float">
          <div className="absolute top-2 left-2 w-1 h-1 bg-therapy-300 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-4 right-3 w-1 h-1 bg-therapy-400 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-6 left-4 w-1 h-1 bg-therapy-500 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-4 right-2 w-1 h-1 bg-therapy-300 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>
      
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default TreeLoadingSpinner;
