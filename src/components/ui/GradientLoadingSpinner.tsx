
import React from 'react';

interface GradientLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const GradientLoadingSpinner = ({ size = 'md', message }: GradientLoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Gradient swirl loading animation */}
        <div className={`${sizeClasses[size]} relative animate-swirl-grow`}>
          <div className="absolute inset-0 bg-gradient-to-br from-harmony-500 via-balance-500 to-flow-600 rounded-full opacity-80 animate-gradient-flow"></div>
          <div className="absolute inset-2 bg-gradient-to-tr from-white/30 via-transparent to-white/20 rounded-full animate-swirl-breathe"></div>
          <div className="absolute inset-4 bg-white/90 rounded-full animate-pulse"></div>
        </div>
        
        {/* Floating particles around spinner */}
        <div className="absolute inset-0 animate-float">
          <div className="absolute top-1 left-1 w-1 h-1 bg-harmony-400 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-2 right-2 w-1 h-1 bg-balance-400 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-3 left-2 w-1 h-1 bg-flow-400 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1 right-1 w-1 h-1 bg-harmony-500 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
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

export default GradientLoadingSpinner;
