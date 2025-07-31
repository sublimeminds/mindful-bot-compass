import React from 'react';

interface ScienceBackedIconProps {
  className?: string;
  size?: number;
}

const ScienceBackedIcon: React.FC<ScienceBackedIconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Brain outline */}
      <path 
        d="M256 120 Q200 120 160 160 Q140 180 140 220 Q140 240 150 260 Q160 300 200 320 Q240 340 280 340 Q320 340 360 320 Q380 300 380 280 Q380 260 370 240 Q370 200 340 160 Q300 120 256 120" 
        fill="url(#brainGradient)" 
        stroke="white" 
        strokeWidth="4"
      />
      
      {/* Neural network patterns */}
      <circle cx="220" cy="180" r="6" fill="white" />
      <circle cx="280" cy="180" r="6" fill="white" />
      <circle cx="250" cy="220" r="8" fill="white" />
      <circle cx="200" cy="240" r="5" fill="white" />
      <circle cx="300" cy="240" r="5" fill="white" />
      <circle cx="240" cy="280" r="6" fill="white" />
      <circle cx="280" cy="280" r="6" fill="white" />
      
      {/* Neural connections */}
      <line x1="220" y1="180" x2="250" y2="220" stroke="white" strokeWidth="2" opacity="0.6" />
      <line x1="280" y1="180" x2="250" y2="220" stroke="white" strokeWidth="2" opacity="0.6" />
      <line x1="250" y1="220" x2="240" y2="280" stroke="white" strokeWidth="2" opacity="0.6" />
      <line x1="250" y1="220" x2="280" y2="280" stroke="white" strokeWidth="2" opacity="0.6" />
      <line x1="200" y1="240" x2="240" y2="280" stroke="white" strokeWidth="2" opacity="0.4" />
      <line x1="300" y1="240" x2="280" y2="280" stroke="white" strokeWidth="2" opacity="0.4" />
      
      {/* Scientific validation checkmarks */}
      <g transform="translate(340, 140)">
        <circle r="20" fill="hsl(var(--therapy-500))" stroke="white" strokeWidth="2" />
        <path d="M-8 0 L-2 6 L8 -6" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      
      <g transform="translate(360, 200)">
        <circle r="16" fill="hsl(var(--calm-500))" stroke="white" strokeWidth="2" />
        <path d="M-6 0 L-1 4 L6 -4" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      
      <g transform="translate(340, 260)">
        <circle r="14" fill="hsl(var(--harmony-500))" stroke="white" strokeWidth="2" />
        <path d="M-5 0 L-1 3 L5 -3" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      
      {/* Data flow particles */}
      <circle cx="180" cy="200" r="2" fill="hsl(var(--therapy-300))" opacity="0.8" />
      <circle cx="320" cy="220" r="2" fill="hsl(var(--calm-300))" opacity="0.8" />
      <circle cx="260" cy="160" r="2" fill="hsl(var(--harmony-300))" opacity="0.8" />
      
      <defs>
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--harmony-500))" />
          <stop offset="50%" stopColor="hsl(var(--therapy-500))" />
          <stop offset="100%" stopColor="hsl(var(--calm-600))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ScienceBackedIcon;