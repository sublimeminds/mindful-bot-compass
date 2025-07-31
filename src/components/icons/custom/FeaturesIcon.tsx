import React from 'react';

interface FeaturesIconProps {
  className?: string;
  size?: number;
}

const FeaturesIcon: React.FC<FeaturesIconProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#featuresGradient)" />
      
      {/* AI Brain core */}
      <circle cx="256" cy="200" r="60" fill="white" opacity="0.9" />
      <path 
        d="M220 180 Q240 160 256 180 Q272 160 292 180 Q300 200 280 220 Q260 240 256 220 Q252 240 232 220 Q212 200 220 180 Z" 
        fill="url(#brainGradient)"
      />
      
      {/* Neural connections */}
      <g stroke="white" strokeWidth="3" opacity="0.7">
        <line x1="180" y1="150" x2="220" y2="180" />
        <line x1="332" y1="150" x2="292" y2="180" />
        <line x1="180" y1="250" x2="220" y2="220" />
        <line x1="332" y1="250" x2="292" y2="220" />
      </g>
      
      {/* Feature nodes */}
      <circle cx="160" cy="130" r="16" fill="white" />
      <circle cx="352" cy="130" r="16" fill="white" />
      <circle cx="160" cy="270" r="16" fill="white" />
      <circle cx="352" cy="270" r="16" fill="white" />
      
      {/* Heart symbol for therapy */}
      <path 
        d="M200 320 C190 310 170 310 170 330 C170 330 170 350 200 370 C230 350 230 330 230 330 C230 310 210 310 200 320 Z" 
        fill="white"
      />
      
      {/* Progress indicators */}
      <rect x="280" y="310" width="60" height="8" rx="4" fill="white" opacity="0.8" />
      <rect x="280" y="325" width="45" height="8" rx="4" fill="white" opacity="0.6" />
      <rect x="280" y="340" width="50" height="8" rx="4" fill="white" opacity="0.7" />
      
      {/* Feature icons */}
      <circle cx="140" cy="400" r="12" fill="white" />
      <circle cx="180" cy="400" r="12" fill="white" />
      <circle cx="220" cy="400" r="12" fill="white" />
      <circle cx="260" cy="400" r="12" fill="white" />
      <circle cx="300" cy="400" r="12" fill="white" />
      <circle cx="340" cy="400" r="12" fill="white" />
      
      <defs>
        <linearGradient id="featuresGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--therapy-500))" />
          <stop offset="33%" stopColor="hsl(var(--harmony-500))" />
          <stop offset="66%" stopColor="hsl(var(--calm-500))" />
          <stop offset="100%" stopColor="hsl(var(--balance-500))" />
        </linearGradient>
        <radialGradient id="brainGradient">
          <stop offset="0%" stopColor="hsl(var(--therapy-400))" />
          <stop offset="100%" stopColor="hsl(var(--harmony-600))" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default FeaturesIcon;