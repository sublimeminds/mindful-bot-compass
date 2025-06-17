
import React from 'react';

interface TreeLogoProps {
  className?: string;
  size?: 'micro' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'hero';
}

const TreeLogo = ({ 
  className = '', 
  size = 'md'
}: TreeLogoProps) => {
  const sizeClasses = {
    micro: 'w-4 h-4',
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    xxl: 'w-48 h-48',
    hero: 'w-64 h-64'
  };

  // Gradient swirl logo design
  const GradientSwirlLogo = () => (
    <div className={`${sizeClasses[size]} ${className} relative flex items-center justify-center`}>
      <div className="absolute inset-0 bg-gradient-to-br from-harmony-500 via-balance-500 to-flow-600 rounded-full animate-swirl-breathe shadow-lg">
        <div className="absolute inset-2 bg-gradient-to-tr from-white/20 via-transparent to-white/10 rounded-full">
          <div className="absolute inset-0 flex items-center justify-center">
            {size === 'micro' || size === 'sm' ? (
              <div className="w-3 h-3 bg-white/90 rounded-full animate-pulse"></div>
            ) : (
              <div className="relative">
                {/* Central swirl pattern */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1/3 h-1/3 bg-white/80 rounded-full animate-pulse"></div>
                </div>
                {/* Swirl elements */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute w-1/2 h-1/2 border-2 border-white/60 rounded-full transform rotate-45"></div>
                  <div className="absolute w-2/3 h-2/3 border border-white/40 rounded-full transform -rotate-12"></div>
                  <div className="absolute w-3/4 h-3/4 border border-white/20 rounded-full transform rotate-30"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  console.log('TreeLogo - rendering gradient swirl logo, size:', size);

  return <GradientSwirlLogo />;
};

export default TreeLogo;
