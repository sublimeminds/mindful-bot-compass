
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
        {/* Circular background with gradient */}
        <circle 
          cx="50" 
          cy="50" 
          r="48" 
          fill="url(#treeGradient)"
          className="drop-shadow-sm"
        />
        
        {/* Root system */}
        <path 
          d="M46 75 Q42 80 38 85 M54 75 Q58 80 62 85 M50 75 Q50 82 50 88"
          stroke="#8B4513"
          strokeWidth="2"
          fill="none"
          className="animate-roots-grow"
          opacity="0.7"
        />
        
        {/* Tree trunk with texture */}
        <rect 
          x="46" 
          y="60" 
          width="8" 
          height="25" 
          rx="2"
          fill="url(#trunkGradient)"
          className="animate-trunk-grow"
        />
        
        {/* Tree canopy layers - more organic shapes */}
        <circle 
          cx="50" 
          cy="45" 
          r="20" 
          fill="url(#leavesGradient1)"
          className="animate-leaf-grow-1"
          style={{ animationDelay: '0.5s' }}
        />
        <circle 
          cx="50" 
          cy="38" 
          r="15" 
          fill="url(#leavesGradient2)"
          className="animate-leaf-grow-2"
          style={{ animationDelay: '1s' }}
        />
        <circle 
          cx="50" 
          cy="32" 
          r="10" 
          fill="url(#leavesGradient3)"
          className="animate-leaf-grow-3"
          style={{ animationDelay: '1.5s' }}
        />
        
        {/* Floating particles for enhanced variants */}
        {(isHovered || variant === 'hovering' || variant === 'floating') && (
          <>
            <circle cx="25" cy="20" r="1" fill="#22c55e" className="animate-leaf-float" opacity="0.6" />
            <circle cx="75" cy="25" r="1" fill="#16a34a" className="animate-leaf-float" style={{ animationDelay: '1s' }} opacity="0.4" />
            <circle cx="30" cy="70" r="1" fill="#15803d" className="animate-leaf-float" style={{ animationDelay: '2s' }} opacity="0.5" />
            <circle cx="70" cy="65" r="1" fill="#22c55e" className="animate-leaf-float" style={{ animationDelay: '3s' }} opacity="0.3" />
          </>
        )}
        
        {/* Enhanced gradient definitions */}
        <defs>
          <radialGradient id="treeGradient" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#f0fdf4" />
            <stop offset="50%" stopColor="#dcfce7" />
            <stop offset="100%" stopColor="#bbf7d0" />
          </radialGradient>
          <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a3a3a3" />
            <stop offset="50%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#654321" />
          </linearGradient>
          <linearGradient id="leavesGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="leavesGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="leavesGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
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
        src="/lovable-uploads/9a47b7f0-6988-4b97-aa49-a9cacafcb69e.png"
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
