import React from 'react';

interface SafeHavenIconProps {
  className?: string;
  size?: number;
}

const SafeHavenIcon: React.FC<SafeHavenIconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield base */}
      <path 
        d="M256 64c-64 0-128 32-128 96v80c0 128 128 208 128 208s128-80 128-208v-80c0-64-64-96-128-96z" 
        fill="url(#safeGradient)" 
        stroke="white" 
        strokeWidth="8"
      />
      
      {/* Heart/lotus center */}
      <path 
        d="M256 320c-32-24-48-40-48-64 0-16 16-32 32-32 8 0 16 4 16 8 0-4 8-8 16-8 16 0 32 16 32 32 0 24-16 40-48 64z" 
        fill="white"
      />
      
      {/* Protective aura lines */}
      <circle cx="256" cy="180" r="4" fill="white" opacity="0.8" />
      <circle cx="220" cy="200" r="3" fill="white" opacity="0.6" />
      <circle cx="292" cy="200" r="3" fill="white" opacity="0.6" />
      <circle cx="256" cy="280" r="3" fill="white" opacity="0.7" />
      
      <defs>
        <linearGradient id="safeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--therapy-500))" />
          <stop offset="100%" stopColor="hsl(var(--calm-600))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default SafeHavenIcon;