import React from 'react';

interface WearableIntegrationProps {
  className?: string;
  size?: number;
}

const WearableIntegration: React.FC<WearableIntegrationProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#wearableGradient)" />
      
      {/* Smartwatch */}
      <rect x="200" y="180" width="112" height="152" rx="24" fill="white" />
      <rect x="212" y="192" width="88" height="128" rx="12" fill="hsl(var(--primary))" />
      
      {/* Watch face */}
      <circle cx="256" cy="256" r="32" fill="white" />
      <rect x="248" y="248" width="16" height="16" rx="2" fill="hsl(var(--accent))" />
      
      {/* Heart rate indicator */}
      <path d="M240 240 L248 248 L256 236 L264 252 L272 240" 
            stroke="hsl(var(--secondary))" strokeWidth="2" fill="none" />
      
      {/* Watch band */}
      <rect x="232" y="160" width="48" height="20" rx="10" fill="white" />
      <rect x="232" y="332" width="48" height="20" rx="10" fill="white" />
      
      {/* Data sync waves */}
      <circle cx="350" cy="200" r="12" fill="white" opacity="0.8" />
      <circle cx="350" cy="200" r="20" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
      <circle cx="350" cy="200" r="28" fill="none" stroke="white" strokeWidth="2" opacity="0.4" />
      
      {/* Health metrics */}
      <rect x="120" y="280" width="60" height="40" rx="8" fill="white" />
      <rect x="128" y="288" width="44" height="4" rx="2" fill="hsl(var(--primary))" />
      <rect x="128" y="296" width="32" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="128" y="304" width="38" height="4" rx="2" fill="hsl(var(--accent))" />
      
      <defs>
        <linearGradient id="wearableGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--cyan-500))" />
          <stop offset="100%" stopColor="hsl(var(--blue-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default WearableIntegration;