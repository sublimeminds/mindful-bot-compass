import React from 'react';

interface TherapySyncAICoreProps {
  className?: string;
  size?: number;
}

const TherapySyncAICore: React.FC<TherapySyncAICoreProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#therapySyncGradient)" />
      
      {/* Central brain core */}
      <circle cx="256" cy="256" r="64" fill="white" />
      <path d="M220 240 Q256 200 292 240 Q256 280 220 240" fill="hsl(var(--primary))" />
      <path d="M256 200 Q296 236 256 272 Q216 236 256 200" fill="hsl(var(--secondary))" />
      
      {/* Neural network connections */}
      <circle cx="160" cy="160" r="20" fill="white" opacity="0.9" />
      <circle cx="352" cy="160" r="20" fill="white" opacity="0.9" />
      <circle cx="160" cy="352" r="20" fill="white" opacity="0.9" />
      <circle cx="352" cy="352" r="20" fill="white" opacity="0.9" />
      
      {/* Connection lines */}
      <line x1="180" y1="180" x2="192" y2="192" stroke="white" strokeWidth="3" opacity="0.8" />
      <line x1="332" y1="180" x2="320" y2="192" stroke="white" strokeWidth="3" opacity="0.8" />
      <line x1="180" y1="332" x2="192" y2="320" stroke="white" strokeWidth="3" opacity="0.8" />
      <line x1="332" y1="332" x2="320" y2="320" stroke="white" strokeWidth="3" opacity="0.8" />
      
      {/* AI spark effects */}
      <circle cx="256" cy="180" r="8" fill="white" />
      <circle cx="280" cy="256" r="6" fill="white" />
      <circle cx="232" cy="256" r="6" fill="white" />
      <circle cx="256" cy="332" r="8" fill="white" />
      
      <defs>
        <linearGradient id="therapySyncGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--purple-500))" />
          <stop offset="100%" stopColor="hsl(var(--indigo-600))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default TherapySyncAICore;