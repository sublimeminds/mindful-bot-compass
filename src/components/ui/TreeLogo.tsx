
import React, { useState } from 'react';

interface TreeLogoProps {
  className?: string;
  size?: 'micro' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  loading?: boolean;
  variant?: 'default' | 'breathing' | 'growing' | 'hovering' | 'floating' | 'celebration';
}

const TreeLogo = ({ 
  className = '', 
  size = 'md', 
  animated = false, 
  loading = false,
  variant = 'default'
}: TreeLogoProps) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const sizeClasses = {
    micro: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const getAnimationClasses = () => {
    if (loading) return 'animate-tree-growth';
    if (variant === 'breathing') return 'animate-tree-breathe';
    if (variant === 'growing') return 'animate-tree-grow';
    if (variant === 'floating') return 'animate-leaf-float';
    if (variant === 'celebration') return 'animate-tree-grow animate-pulse';
    if (variant === 'hovering' || (animated && isHovered)) {
      return 'animate-tree-breathe hover:animate-tree-grow transition-all duration-500 hover:drop-shadow-lg hover:brightness-110';
    }
    if (animated) return 'animate-tree-breathe hover:animate-tree-grow transition-all duration-300';
    return '';
  };

  // Enhanced fallback SVG that matches the new circular tree logo style
  const FallbackTree = () => (
    <div className={`${sizeClasses[size]} ${className} relative overflow-hidden`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        className={`w-full h-full ${getAnimationClasses()}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Circular background with gradient - matching new logo */}
        <circle 
          cx="50" 
          cy="50" 
          r="48" 
          fill="url(#newTreeGradient)"
          className="drop-shadow-sm"
        />
        
        {/* Enhanced root system */}
        <path 
          d="M46 75 Q42 80 38 85 M54 75 Q58 80 62 85 M50 75 Q50 82 50 88 M48 78 Q44 83 40 87 M52 78 Q56 83 60 87"
          stroke="#8B4513"
          strokeWidth="1.5"
          fill="none"
          className="animate-roots-grow"
          opacity="0.6"
        />
        
        {/* More detailed tree trunk */}
        <rect 
          x="46" 
          y="58" 
          width="8" 
          height="27" 
          rx="2"
          fill="url(#enhancedTrunkGradient)"
          className="animate-trunk-grow"
        />
        
        {/* Enhanced tree canopy with more organic layering */}
        <circle 
          cx="50" 
          cy="45" 
          r="22" 
          fill="url(#newLeavesGradient1)"
          className="animate-leaf-grow-1"
          style={{ animationDelay: '0.3s' }}
          opacity="0.9"
        />
        <circle 
          cx="50" 
          cy="40" 
          r="18" 
          fill="url(#newLeavesGradient2)"
          className="animate-leaf-grow-2"
          style={{ animationDelay: '0.6s' }}
          opacity="0.95"
        />
        <circle 
          cx="50" 
          cy="35" 
          r="14" 
          fill="url(#newLeavesGradient3)"
          className="animate-leaf-grow-3"
          style={{ animationDelay: '0.9s' }}
        />
        <circle 
          cx="50" 
          cy="30" 
          r="10" 
          fill="url(#newLeavesGradient4)"
          className="animate-leaf-grow-3"
          style={{ animationDelay: '1.2s' }}
        />
        
        {/* Floating particles for enhanced variants */}
        {(isHovered || variant === 'hovering' || variant === 'floating') && (
          <>
            <circle cx="25" cy="20" r="1.5" fill="#22c55e" className="animate-leaf-float" opacity="0.7" />
            <circle cx="75" cy="25" r="1" fill="#16a34a" className="animate-leaf-float" style={{ animationDelay: '1s' }} opacity="0.5" />
            <circle cx="30" cy="70" r="1.2" fill="#15803d" className="animate-leaf-float" style={{ animationDelay: '2s' }} opacity="0.6" />
            <circle cx="70" cy="65" r="1" fill="#22c55e" className="animate-leaf-float" style={{ animationDelay: '3s' }} opacity="0.4" />
            <circle cx="20" cy="45" r="0.8" fill="#34d399" className="animate-leaf-float" style={{ animationDelay: '1.5s' }} opacity="0.5" />
            <circle cx="80" cy="50" r="0.9" fill="#10b981" className="animate-leaf-float" style={{ animationDelay: '2.5s' }} opacity="0.4" />
          </>
        )}
        
        {/* Enhanced gradient definitions matching new logo */}
        <defs>
          <radialGradient id="newTreeGradient" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#f0fdf4" />
            <stop offset="30%" stopColor="#dcfce7" />
            <stop offset="70%" stopColor="#bbf7d0" />
            <stop offset="100%" stopColor="#a7f3d0" />
          </radialGradient>
          <linearGradient id="enhancedTrunkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a3a3a3" />
            <stop offset="30%" stopColor="#8B4513" />
            <stop offset="70%" stopColor="#654321" />
            <stop offset="100%" stopColor="#4a3728" />
          </linearGradient>
          <radialGradient id="newLeavesGradient1" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </radialGradient>
          <radialGradient id="newLeavesGradient2" cx="45%" cy="45%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#15803d" />
          </radialGradient>
          <radialGradient id="newLeavesGradient3" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="50%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#166534" />
          </radialGradient>
          <radialGradient id="newLeavesGradient4" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="50%" stopColor="#166534" />
            <stop offset="100%" stopColor="#14532d" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Enhanced glow effect on hover */}
      {(isHovered || variant === 'hovering' || variant === 'celebration') && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-therapy-400/30 to-calm-400/30 blur-md animate-pulse" />
      )}
    </div>
  );

  if (imageError) {
    return <FallbackTree />;
  }

  return (
    <div className="relative">
      <img 
        src="/lovable-uploads/c7705e94-19de-4037-8030-ffe70c6bfee3.png"
        alt="TherapySync Tree Logo" 
        className={`${sizeClasses[size]} ${className} ${getAnimationClasses()} object-contain rounded-full`}
        onError={() => setImageError(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      
      {/* Enhanced glow effect on hover */}
      {(isHovered || variant === 'hovering' || variant === 'celebration') && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-therapy-400/40 to-calm-400/40 blur-lg animate-pulse pointer-events-none" />
      )}
      
      {/* Floating particles for celebration variant */}
      {variant === 'celebration' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-2 -left-2 w-2 h-2 bg-therapy-400 rounded-full animate-leaf-float opacity-60"></div>
          <div className="absolute -top-1 -right-2 w-1 h-1 bg-calm-400 rounded-full animate-leaf-float opacity-40" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-2 -left-1 w-1 h-1 bg-therapy-500 rounded-full animate-leaf-float opacity-50" style={{ animationDelay: '2s' }}></div>
        </div>
      )}
    </div>
  );
};

export default TreeLogo;
