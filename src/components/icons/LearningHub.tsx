import React from 'react';

interface LearningHubProps {
  className?: string;
  size?: number;
}

const LearningHub: React.FC<LearningHubProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#learningGradient)" />
      
      {/* Book */}
      <rect x="160" y="160" width="192" height="192" rx="8" fill="white" />
      <rect x="180" y="180" width="152" height="8" rx="4" fill="hsl(var(--primary))" />
      <rect x="180" y="200" width="120" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="180" y="220" width="140" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="180" y="240" width="100" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="180" y="260" width="130" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="180" y="280" width="110" height="4" rx="2" fill="hsl(var(--secondary))" />
      
      {/* Lightbulb icon */}
      <circle cx="300" cy="300" r="20" fill="hsl(var(--accent))" />
      <rect x="295" y="315" width="10" height="15" rx="2" fill="hsl(var(--accent))" />
      <path d="M290 295 L310 295 M292 290 L308 290" stroke="white" strokeWidth="2" />
      
      {/* Page indicator */}
      <line x1="256" y1="160" x2="256" y2="352" stroke="hsl(var(--primary))" strokeWidth="2" />
      
      <defs>
        <linearGradient id="learningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="50%" stopColor="hsl(var(--secondary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default LearningHub;