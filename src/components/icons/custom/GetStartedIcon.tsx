import React from 'react';

interface GetStartedIconProps {
  className?: string;
  size?: number;
}

const GetStartedIcon: React.FC<GetStartedIconProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#getStartedGradient)" />
      
      {/* Journey path */}
      <path 
        d="M100 400 Q200 300 256 350 Q312 400 412 300" 
        stroke="white" 
        strokeWidth="6" 
        fill="none" 
        strokeLinecap="round"
        opacity="0.8"
      />
      
      {/* Starting point */}
      <circle cx="100" cy="400" r="20" fill="white" />
      <circle cx="100" cy="400" r="12" fill="url(#startGradient)" />
      
      {/* Journey milestones */}
      <circle cx="180" cy="340" r="12" fill="white" opacity="0.9" />
      <circle cx="256" cy="350" r="16" fill="white" />
      <circle cx="332" cy="360" r="12" fill="white" opacity="0.9" />
      
      {/* Destination/goal */}
      <circle cx="412" cy="300" r="24" fill="white" />
      <circle cx="412" cy="300" r="16" fill="url(#goalGradient)" />
      
      {/* Success sparkles */}
      <g fill="white" opacity="0.8">
        <polygon points="380,260 385,270 395,270 387,277 390,287 380,281 370,287 373,277 365,270 375,270" />
        <polygon points="440,320 443,326 449,326 444,330 446,336 440,333 434,336 436,330 431,326 437,326" />
        <polygon points="390,340 393,346 399,346 394,350 396,356 390,353 384,356 386,350 381,346 387,346" />
      </g>
      
      {/* Progress indicators */}
      <rect x="200" y="180" width="8" height="60" rx="4" fill="white" opacity="0.6" />
      <rect x="220" y="160" width="8" height="80" rx="4" fill="white" opacity="0.7" />
      <rect x="240" y="140" width="8" height="100" rx="4" fill="white" opacity="0.8" />
      <rect x="260" y="120" width="8" height="120" rx="4" fill="white" opacity="0.9" />
      <rect x="280" y="140" width="8" height="100" rx="4" fill="white" opacity="0.8" />
      <rect x="300" y="160" width="8" height="80" rx="4" fill="white" opacity="0.7" />
      
      {/* Call to action arrow */}
      <path 
        d="M350 200 L380 230 L350 260 M380 230 L320 230" 
        stroke="white" 
        strokeWidth="6" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity="0.9"
      />
      
      <defs>
        <linearGradient id="getStartedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--therapy-600))" />
          <stop offset="50%" stopColor="hsl(var(--harmony-500))" />
          <stop offset="100%" stopColor="hsl(var(--calm-600))" />
        </linearGradient>
        <radialGradient id="startGradient">
          <stop offset="0%" stopColor="hsl(var(--therapy-400))" />
          <stop offset="100%" stopColor="hsl(var(--therapy-600))" />
        </radialGradient>
        <radialGradient id="goalGradient">
          <stop offset="0%" stopColor="hsl(var(--harmony-400))" />
          <stop offset="100%" stopColor="hsl(var(--calm-600))" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default GetStartedIcon;