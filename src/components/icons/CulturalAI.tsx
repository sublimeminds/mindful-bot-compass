import React from 'react';

interface CulturalAIProps {
  className?: string;
  size?: number;
}

const CulturalAI: React.FC<CulturalAIProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#culturalGradient)" />
      
      {/* Globe */}
      <circle cx="256" cy="256" r="96" fill="white" />
      <path d="M256 160 Q320 200 256 256 Q192 200 256 160" fill="hsl(var(--primary))" />
      <path d="M256 256 Q320 312 256 352 Q192 312 256 256" fill="hsl(var(--primary))" />
      <circle cx="256" cy="256" r="96" fill="none" stroke="hsl(var(--primary))" strokeWidth="4" />
      <ellipse cx="256" cy="256" rx="96" ry="48" fill="none" stroke="hsl(var(--primary))" strokeWidth="4" />
      <line x1="256" y1="160" x2="256" y2="352" stroke="hsl(var(--primary))" strokeWidth="4" />
      
      {/* Cultural symbols */}
      <circle cx="220" cy="220" r="8" fill="hsl(var(--secondary))" />
      <circle cx="292" cy="220" r="8" fill="hsl(var(--secondary))" />
      <circle cx="220" cy="292" r="8" fill="hsl(var(--secondary))" />
      <circle cx="292" cy="292" r="8" fill="hsl(var(--secondary))" />
      
      <defs>
        <linearGradient id="culturalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--mindful-500))" />
          <stop offset="50%" stopColor="hsl(var(--flow-400))" />
          <stop offset="100%" stopColor="hsl(var(--therapy-600))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CulturalAI;