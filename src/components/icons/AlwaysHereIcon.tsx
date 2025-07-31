import React from 'react';

interface AlwaysHereIconProps {
  className?: string;
  size?: number;
}

const AlwaysHereIcon: React.FC<AlwaysHereIconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sun and moon cycle */}
      <circle cx="256" cy="256" r="120" fill="none" stroke="url(#cycleGradient)" strokeWidth="6" strokeDasharray="10,5" />
      
      {/* Sun (top) */}
      <circle cx="256" cy="156" r="24" fill="url(#sunGradient)" />
      <g transform="translate(256, 156)">
        {[...Array(8)].map((_, i) => (
          <line 
            key={i}
            x1="0" y1="-35" x2="0" y2="-40" 
            stroke="hsl(var(--harmony-400))" 
            strokeWidth="3" 
            strokeLinecap="round"
            transform={`rotate(${i * 45})`}
          />
        ))}
      </g>
      
      {/* Moon (bottom) */}
      <path 
        d="M256 332 Q272 336 272 356 Q272 376 256 380 Q248 368 248 356 Q248 344 256 332" 
        fill="url(#moonGradient)"
      />
      
      {/* Central support heart */}
      <circle cx="256" cy="256" r="32" fill="url(#heartGradient)" />
      <path 
        d="M256 276 Q244 268 244 256 Q244 248 252 248 Q256 252 256 252 Q256 252 260 248 Q268 248 268 256 Q268 268 256 276" 
        fill="white"
      />
      
      {/* Orbital care elements */}
      <circle cx="320" cy="256" r="6" fill="hsl(var(--therapy-300))" opacity="0.8" />
      <circle cx="192" cy="256" r="6" fill="hsl(var(--calm-300))" opacity="0.8" />
      <circle cx="256" cy="320" r="4" fill="hsl(var(--harmony-300))" opacity="0.6" />
      
      <defs>
        <linearGradient id="cycleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--calm-400))" />
          <stop offset="50%" stopColor="hsl(var(--harmony-400))" />
          <stop offset="100%" stopColor="hsl(var(--therapy-400))" />
        </linearGradient>
        <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--harmony-400))" />
          <stop offset="100%" stopColor="hsl(var(--harmony-500))" />
        </linearGradient>
        <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--calm-500))" />
          <stop offset="100%" stopColor="hsl(var(--calm-600))" />
        </linearGradient>
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--therapy-500))" />
          <stop offset="100%" stopColor="hsl(var(--therapy-600))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default AlwaysHereIcon;