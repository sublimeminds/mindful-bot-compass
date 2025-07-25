import React from 'react';

interface CustomIntegrationsProps {
  className?: string;
  size?: number;
}

const CustomIntegrations: React.FC<CustomIntegrationsProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#customIntegrationsGradient)" />
      
      {/* Puzzle pieces */}
      <path 
        d="M160 160 L240 160 Q248 152 256 160 Q264 168 256 176 L256 240 Q248 248 240 240 Q232 232 240 224 L160 224 Z" 
        fill="white"
      />
      <path 
        d="M272 160 L352 160 L352 240 Q344 248 336 240 Q328 232 336 224 L336 176 Q328 168 336 160 Q344 152 352 160 L272 160 Z" 
        fill="white"
      />
      <path 
        d="M160 256 L240 256 L240 336 L160 336 Q152 328 160 320 Q168 312 176 320 L176 272 Q168 264 176 256 Q184 248 192 256 L160 256 Z" 
        fill="white"
      />
      <path 
        d="M272 256 L352 256 L352 336 L272 336 L272 272 Q280 264 288 272 Q296 280 288 288 L288 320 Q296 328 288 336 Q280 344 272 336 L272 256 Z" 
        fill="white"
      />
      
      <defs>
        <linearGradient id="customIntegrationsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="50%" stopColor="hsl(var(--secondary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CustomIntegrations;