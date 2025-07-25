import React from 'react';

interface GettingStartedProps {
  className?: string;
  size?: number;
}

const GettingStarted: React.FC<GettingStartedProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#gettingStartedGradient)" />
      
      {/* Open book */}
      <path d="M128 180 L256 140 L384 180 L384 320 L256 280 L128 320 Z" fill="white" />
      <line x1="256" y1="140" x2="256" y2="280" stroke="hsl(var(--primary))" strokeWidth="3" />
      
      {/* Book pages */}
      <rect x="144" y="200" width="96" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="144" y="220" width="80" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="144" y="240" width="88" height="4" rx="2" fill="hsl(var(--secondary))" />
      
      <rect x="272" y="200" width="96" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="272" y="220" width="80" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="272" y="240" width="88" height="4" rx="2" fill="hsl(var(--secondary))" />
      
      {/* Step indicators */}
      <circle cx="160" cy="120" r="16" fill="white" />
      <text x="160" y="127" textAnchor="middle" fill="hsl(var(--primary))" fontSize="14" fontWeight="bold">1</text>
      
      <circle cx="256" cy="100" r="16" fill="white" />
      <text x="256" y="107" textAnchor="middle" fill="hsl(var(--primary))" fontSize="14" fontWeight="bold">2</text>
      
      <circle cx="352" cy="120" r="16" fill="white" />
      <text x="352" y="127" textAnchor="middle" fill="hsl(var(--primary))" fontSize="14" fontWeight="bold">3</text>
      
      {/* Connecting arrows */}
      <path d="M176 128 L240 108 M230 105 L240 108 L230 111" stroke="white" strokeWidth="2" fill="none" />
      <path d="M272 108 L336 128 M326 125 L336 128 L326 131" stroke="white" strokeWidth="2" fill="none" />
      
      {/* Graduation cap for completion */}
      <rect x="240" y="360" width="32" height="8" rx="4" fill="white" />
      <path d="M232 360 L256 348 L280 360 L256 372 Z" fill="white" />
      <circle cx="284" cy="356" r="4" fill="hsl(var(--accent))" />
      
      <defs>
        <linearGradient id="gettingStartedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--therapy-500))" />
          <stop offset="100%" stopColor="hsl(var(--calm-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default GettingStarted;