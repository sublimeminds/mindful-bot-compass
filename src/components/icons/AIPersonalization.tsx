import React from 'react';

interface AIPersonalizationProps {
  className?: string;
  size?: number;
}

const AIPersonalization: React.FC<AIPersonalizationProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#personalizationGradient)" />
      
      {/* Central user profile */}
      <circle cx="256" cy="180" r="40" fill="white" />
      <rect x="216" y="236" width="80" height="100" rx="20" fill="white" />
      
      {/* AI adaptation elements */}
      <circle cx="150" cy="150" r="24" fill="white" opacity="0.9" />
      <path d="M138 138 Q150 126 162 138 Q150 150 138 138" fill="hsl(var(--primary))" />
      
      <circle cx="362" cy="150" r="24" fill="white" opacity="0.9" />
      <path d="M350 138 Q362 126 374 138 Q362 150 350 138" fill="hsl(var(--secondary))" />
      
      <circle cx="150" cy="350" r="24" fill="white" opacity="0.9" />
      <path d="M138 338 Q150 326 162 338 Q150 350 138 338" fill="hsl(var(--accent))" />
      
      <circle cx="362" cy="350" r="24" fill="white" opacity="0.9" />
      <path d="M350 338 Q362 326 374 338 Q362 350 350 338" fill="hsl(var(--primary))" />
      
      {/* Connecting neural paths */}
      <line x1="174" y1="150" x2="216" y2="180" stroke="white" strokeWidth="3" opacity="0.7" />
      <line x1="338" y1="150" x2="296" y2="180" stroke="white" strokeWidth="3" opacity="0.7" />
      <line x1="174" y1="350" x2="216" y2="320" stroke="white" strokeWidth="3" opacity="0.7" />
      <line x1="338" y1="350" x2="296" y2="320" stroke="white" strokeWidth="3" opacity="0.7" />
      
      {/* Personal preferences symbols */}
      <rect x="200" y="380" width="112" height="60" rx="12" fill="white" />
      <rect x="210" y="390" width="32" height="8" rx="4" fill="hsl(var(--primary))" />
      <rect x="210" y="405" width="48" height="8" rx="4" fill="hsl(var(--secondary))" />
      <rect x="210" y="420" width="24" height="8" rx="4" fill="hsl(var(--accent))" />
      
      <defs>
        <linearGradient id="personalizationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--harmony-500))" />
          <stop offset="100%" stopColor="hsl(var(--therapy-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default AIPersonalization;