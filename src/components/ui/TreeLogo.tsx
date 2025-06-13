
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

  // Enhanced fallback SVG that matches your new detailed circular logo
  const FallbackTree = () => (
    <div className={`${sizeClasses[size]} ${className} relative overflow-hidden`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        className={`w-full h-full ${getAnimationClasses()}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Circular gradient border matching your logo */}
        <circle 
          cx="50" 
          cy="50" 
          r="49" 
          fill="none"
          stroke="url(#logoGradientBorder)"
          strokeWidth="2"
          className="animate-tree-breathe"
        />
        
        {/* Inner white/light background */}
        <circle 
          cx="50" 
          cy="50" 
          r="46" 
          fill="url(#logoBackground)"
          className="drop-shadow-sm"
        />
        
        {/* Detailed root system - more organic and flowing */}
        <g className="animate-roots-grow" opacity="0.7">
          <path d="M45 75 Q40 80 35 85 Q32 87 30 90" stroke="#8B4513" strokeWidth="1.2" fill="none"/>
          <path d="M50 76 Q50 82 50 88 Q48 91 45 93" stroke="#8B4513" strokeWidth="1" fill="none"/>
          <path d="M55 75 Q60 80 65 85 Q68 87 70 90" stroke="#8B4513" strokeWidth="1.2" fill="none"/>
          <path d="M47 77 Q42 83 38 87 Q35 89 32 92" stroke="#8B4513" strokeWidth="0.8" fill="none"/>
          <path d="M53 77 Q58 83 62 87 Q65 89 68 92" stroke="#8B4513" strokeWidth="0.8" fill="none"/>
        </g>
        
        {/* More detailed and flowing tree trunk */}
        <path 
          d="M46 58 Q46 65 47 72 Q48 78 49 82 L51 82 Q52 78 53 72 Q54 65 54 58 Z" 
          fill="url(#detailedTrunkGradient)"
          className="animate-trunk-grow"
        />
        
        {/* Main tree canopy with multiple detailed layers */}
        <g className="animate-leaf-grow-1" style={{ animationDelay: '0.2s' }}>
          <circle cx="50" cy="50" r="28" fill="url(#mainCanopyGradient)" opacity="0.3"/>
          <circle cx="48" cy="48" r="24" fill="url(#canopyLayer1)" opacity="0.8"/>
          <circle cx="52" cy="52" r="20" fill="url(#canopyLayer2)" opacity="0.9"/>
          <circle cx="50" cy="50" r="16" fill="url(#canopyLayer3)"/>
        </g>
        
        {/* Individual leaf clusters for detail */}
        <g className="animate-leaf-grow-2" style={{ animationDelay: '0.4s' }}>
          {/* Left side leaves */}
          <circle cx="35" cy="45" r="6" fill="url(#leafCluster1)" opacity="0.9"/>
          <circle cx="32" cy="50" r="4" fill="url(#leafCluster2)" opacity="0.8"/>
          <circle cx="38" cy="40" r="5" fill="url(#leafCluster3)" opacity="0.85"/>
          
          {/* Right side leaves */}
          <circle cx="65" cy="45" r="6" fill="url(#leafCluster1)" opacity="0.9"/>
          <circle cx="68" cy="50" r="4" fill="url(#leafCluster2)" opacity="0.8"/>
          <circle cx="62" cy="40" r="5" fill="url(#leafCluster3)" opacity="0.85"/>
          
          {/* Top leaves */}
          <circle cx="50" cy="28" r="7" fill="url(#leafCluster4)" opacity="0.95"/>
          <circle cx="45" cy="32" r="5" fill="url(#leafCluster5)" opacity="0.9"/>
          <circle cx="55" cy="32" r="5" fill="url(#leafCluster5)" opacity="0.9"/>
        </g>
        
        {/* Additional small branch details */}
        <g className="animate-leaf-grow-3" style={{ animationDelay: '0.6s' }}>
          <path d="M42 55 Q38 50 35 45" stroke="#4a5d23" strokeWidth="1" opacity="0.6"/>
          <path d="M58 55 Q62 50 65 45" stroke="#4a5d23" strokeWidth="1" opacity="0.6"/>
          <path d="M50 40 Q45 35 42 30" stroke="#4a5d23" strokeWidth="0.8" opacity="0.5"/>
          <path d="M50 40 Q55 35 58 30" stroke="#4a5d23" strokeWidth="0.8" opacity="0.5"/>
        </g>
        
        {/* Floating particles and leaves for enhanced variants */}
        {(isHovered || variant === 'hovering' || variant === 'floating' || variant === 'celebration') && (
          <g className="animate-leaf-float">
            <circle cx="25" cy="20" r="1.5" fill="#22c55e" opacity="0.8"/>
            <circle cx="75" cy="25" r="1.2" fill="#16a34a" opacity="0.6" style={{ animationDelay: '1s' }}/>
            <circle cx="30" cy="75" r="1.3" fill="#15803d" opacity="0.7" style={{ animationDelay: '2s' }}/>
            <circle cx="70" cy="70" r="1.1" fill="#0ea5e9" opacity="0.5" style={{ animationDelay: '3s' }}/>
            <circle cx="20" cy="50" r="1" fill="#34d399" opacity="0.6" style={{ animationDelay: '1.5s' }}/>
            <circle cx="80" cy="45" r="1.2" fill="#10b981" opacity="0.4" style={{ animationDelay: '2.5s' }}/>
            <ellipse cx="40" cy="25" rx="1.5" ry="0.8" fill="#22c55e" opacity="0.5" style={{ animationDelay: '0.5s' }}/>
            <ellipse cx="60" cy="75" rx="1.2" ry="0.9" fill="#0ea5e9" opacity="0.4" style={{ animationDelay: '3.5s' }}/>
          </g>
        )}
        
        {/* Enhanced gradient definitions matching your logo's style */}
        <defs>
          {/* Main border gradient - green to blue like your logo */}
          <linearGradient id="logoGradientBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="25%" stopColor="#16a34a" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="75%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          
          <radialGradient id="logoBackground" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </radialGradient>
          
          <linearGradient id="detailedTrunkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="30%" stopColor="#8B4513" />
            <stop offset="70%" stopColor="#654321" />
            <stop offset="100%" stopColor="#4a3728" />
          </linearGradient>
          
          <radialGradient id="mainCanopyGradient" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#dcfce7" />
            <stop offset="50%" stopColor="#bbf7d0" />
            <stop offset="100%" stopColor="#86efac" />
          </radialGradient>
          
          <radialGradient id="canopyLayer1" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </radialGradient>
          
          <radialGradient id="canopyLayer2" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#15803d" />
          </radialGradient>
          
          <radialGradient id="canopyLayer3" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="50%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#166534" />
          </radialGradient>
          
          <radialGradient id="leafCluster1" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </radialGradient>
          
          <radialGradient id="leafCluster2" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </radialGradient>
          
          <radialGradient id="leafCluster3" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#0d9488" />
          </radialGradient>
          
          <radialGradient id="leafCluster4" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#0891b2" />
          </radialGradient>
          
          <radialGradient id="leafCluster5" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#0e7490" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Enhanced glow effect matching the circular design */}
      {(isHovered || variant === 'hovering' || variant === 'celebration') && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-therapy-400/40 via-emerald-400/30 to-cyan-400/40 blur-lg animate-pulse pointer-events-none" />
      )}
    </div>
  );

  if (imageError) {
    return <FallbackTree />;
  }

  return (
    <div className="relative">
      <img 
        src="/lovable-uploads/038fa428-626a-486e-9544-08ad92504ded.png"
        alt="TherapySync Tree Logo" 
        className={`${sizeClasses[size]} ${className} ${getAnimationClasses()} object-contain rounded-full`}
        onError={() => setImageError(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      
      {/* Enhanced glow effect optimized for circular logo */}
      {(isHovered || variant === 'hovering' || variant === 'celebration') && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-therapy-400/50 via-emerald-400/40 to-cyan-400/50 blur-xl animate-pulse pointer-events-none" />
      )}
      
      {/* Floating particles for celebration variant */}
      {variant === 'celebration' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-2 -left-2 w-2 h-2 bg-emerald-400 rounded-full animate-leaf-float opacity-70"></div>
          <div className="absolute -top-1 -right-2 w-1 h-1 bg-cyan-400 rounded-full animate-leaf-float opacity-50" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-2 -left-1 w-1.5 h-1.5 bg-therapy-500 rounded-full animate-leaf-float opacity-60" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-1 -right-1 w-1 h-1 bg-emerald-500 rounded-full animate-leaf-float opacity-40" style={{ animationDelay: '1.5s' }}></div>
        </div>
      )}
    </div>
  );
};

export default TreeLogo;
