
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
        {/* Enhanced gradient swirl loading animation */}
        <div className={`${sizeClasses[size]} relative animate-swirl-grow`}>
          <div className="absolute inset-0 gradient-animated rounded-full opacity-90 animate-pulse-glow"></div>
          <div className="absolute inset-2 bg-gradient-to-tr from-white/40 via-harmony-100/30 to-flow-100/40 dark:from-white/20 dark:via-harmony-800/30 dark:to-flow-800/20 rounded-full animate-swirl-breathe"></div>
          <div className="absolute inset-4 bg-white/95 dark:bg-gray-900/95 rounded-full shimmer"></div>
        </div>
        
        {/* Enhanced floating particles around spinner */}
        <div className="absolute inset-0 floating-particles">
          <div className="absolute top-1 left-1 w-1 h-1 bg-harmony-400 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-2 right-2 w-1 h-1 bg-balance-400 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-3 left-2 w-1 h-1 bg-flow-400 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1 right-1 w-1 h-1 bg-therapy-500 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/2 left-0 w-0.5 h-0.5 bg-calm-400 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-0 w-0.5 h-0.5 bg-harmony-600 rounded-full animate-float" style={{ animationDelay: '2.5s' }}></div>
        </div>
      </div>
      
      {message && (
        <p className="text-sm text-muted-foreground animate-shimmer gradient-text font-medium">
          {message}
        </p>
      )}
    </div>
  );
};

export default GradientLoadingSpinner;
