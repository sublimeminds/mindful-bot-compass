import React from 'react';

interface SecurityShieldIconProps {
  className?: string;
  size?: number;
}

const SecurityShieldIcon: React.FC<SecurityShieldIconProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#securityGradient)" />
      
      {/* Main shield */}
      <path 
        d="M256 80 L360 120 L360 280 Q360 320 256 400 Q152 320 152 280 L152 120 Z" 
        fill="white" 
        opacity="0.95"
      />
      
      {/* Inner shield with gradient */}
      <path 
        d="M256 120 L320 150 L320 270 Q320 300 256 360 Q192 300 192 270 L192 150 Z" 
        fill="url(#innerShieldGradient)"
      />
      
      {/* Security checkmark */}
      <path 
        d="M220 240 L245 265 L295 215" 
        stroke="white" 
        strokeWidth="8" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Lock symbol */}
      <rect x="240" y="300" width="32" height="24" rx="4" fill="white" />
      <path 
        d="M244 300 L244 290 Q244 280 256 280 Q268 280 268 290 L268 300" 
        stroke="white" 
        strokeWidth="4" 
        fill="none"
      />
      
      {/* Security dots/indicators */}
      <circle cx="200" cy="180" r="4" fill="white" opacity="0.8" />
      <circle cx="312" cy="180" r="4" fill="white" opacity="0.8" />
      <circle cx="200" cy="200" r="4" fill="white" opacity="0.6" />
      <circle cx="312" cy="200" r="4" fill="white" opacity="0.6" />
      
      <defs>
        <linearGradient id="securityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--calm-500))" />
          <stop offset="50%" stopColor="hsl(var(--therapy-600))" />
          <stop offset="100%" stopColor="hsl(var(--harmony-700))" />
        </linearGradient>
        <linearGradient id="innerShieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--therapy-500))" />
          <stop offset="100%" stopColor="hsl(var(--calm-600))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default SecurityShieldIcon;