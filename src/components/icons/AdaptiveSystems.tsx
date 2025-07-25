import React from 'react';

interface AdaptiveSystemsProps {
  className?: string;
  size?: number;
}

const AdaptiveSystems: React.FC<AdaptiveSystemsProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#adaptiveGradient)" />
      
      {/* Central adaptive core */}
      <circle cx="256" cy="256" r="48" fill="white" />
      <circle cx="256" cy="256" r="24" fill="hsl(var(--primary))" />
      
      {/* Adaptive nodes */}
      <circle cx="180" cy="180" r="20" fill="white" />
      <circle cx="332" cy="180" r="20" fill="white" />
      <circle cx="180" cy="332" r="20" fill="white" />
      <circle cx="332" cy="332" r="20" fill="white" />
      
      {/* Adaptive connections that change */}
      <path d="M200 200 Q228 228 256 208" stroke="white" strokeWidth="4" fill="none" />
      <path d="M312 200 Q284 228 256 208" stroke="white" strokeWidth="4" fill="none" />
      <path d="M200 312 Q228 284 256 304" stroke="white" strokeWidth="4" fill="none" />
      <path d="M312 312 Q284 284 256 304" stroke="white" strokeWidth="4" fill="none" />
      
      {/* Learning indicators */}
      <rect x="160" y="120" width="40" height="24" rx="8" fill="white" />
      <rect x="168" y="128" width="24" height="8" rx="4" fill="hsl(var(--secondary))" />
      
      <rect x="312" y="120" width="40" height="24" rx="8" fill="white" />
      <rect x="320" y="128" width="24" height="8" rx="4" fill="hsl(var(--accent))" />
      
      {/* Evolution arrows */}
      <path d="M140 256 L170 256 M165 250 L170 256 L165 262" 
            stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M372 256 L342 256 M347 250 L342 256 L347 262" 
            stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
      
      {/* Data processing visualization */}
      <rect x="220" y="380" width="72" height="40" rx="8" fill="white" />
      <rect x="228" y="388" width="8" height="24" rx="4" fill="hsl(var(--primary))" />
      <rect x="244" y="395" width="8" height="17" rx="4" fill="hsl(var(--secondary))" />
      <rect x="260" y="390" width="8" height="22" rx="4" fill="hsl(var(--accent))" />
      <rect x="276" y="392" width="8" height="20" rx="4" fill="hsl(var(--primary))" />
      
      <defs>
        <linearGradient id="adaptiveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--indigo-500))" />
          <stop offset="100%" stopColor="hsl(var(--purple-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default AdaptiveSystems;