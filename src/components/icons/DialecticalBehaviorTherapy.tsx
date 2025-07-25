import React from 'react';

interface DialecticalBehaviorTherapyProps {
  className?: string;
  size?: number;
}

const DialecticalBehaviorTherapy: React.FC<DialecticalBehaviorTherapyProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#dbtGradient)" />
      
      {/* Yin-Yang symbol representing dialectical thinking */}
      <circle cx="256" cy="200" r="80" fill="white" />
      <path d="M256 120 A80 80 0 0 1 256 280 A40 40 0 0 1 256 200 A40 40 0 0 0 256 120" fill="hsl(var(--balance-500))" />
      <circle cx="256" cy="160" r="20" fill="white" />
      <circle cx="256" cy="240" r="20" fill="hsl(var(--balance-500))" />
      
      {/* Four DBT modules around the symbol */}
      <rect x="120" y="120" width="80" height="40" rx="8" fill="white" />
      <text x="160" y="145" textAnchor="middle" fill="hsl(var(--primary))" fontSize="14" fontWeight="bold">Mindful</text>
      
      <rect x="312" y="120" width="80" height="40" rx="8" fill="white" />
      <text x="352" y="145" textAnchor="middle" fill="hsl(var(--secondary))" fontSize="14" fontWeight="bold">Distress</text>
      
      <rect x="120" y="320" width="80" height="40" rx="8" fill="white" />
      <text x="160" y="345" textAnchor="middle" fill="hsl(var(--accent))" fontSize="14" fontWeight="bold">Emotion</text>
      
      <rect x="312" y="320" width="80" height="40" rx="8" fill="white" />
      <text x="352" y="345" textAnchor="middle" fill="hsl(var(--therapy-500))" fontSize="14" fontWeight="bold">Interpersonal</text>
      
      {/* Connecting lines */}
      <line x1="200" y1="140" x2="176" y2="160" stroke="white" strokeWidth="3" opacity="0.7" />
      <line x1="312" y1="140" x2="336" y2="160" stroke="white" strokeWidth="3" opacity="0.7" />
      <line x1="200" y1="340" x2="176" y2="320" stroke="white" strokeWidth="3" opacity="0.7" />
      <line x1="312" y1="340" x2="336" y2="320" stroke="white" strokeWidth="3" opacity="0.7" />
      
      {/* Balance scales */}
      <rect x="220" y="360" width="72" height="32" rx="8" fill="white" />
      <line x1="240" y1="376" x2="272" y2="376" stroke="hsl(var(--balance-500))" strokeWidth="4" strokeLinecap="round" />
      <line x1="256" y1="368" x2="256" y2="384" stroke="hsl(var(--balance-500))" strokeWidth="4" strokeLinecap="round" />
      <circle cx="244" cy="372" r="4" fill="hsl(var(--primary))" />
      <circle cx="268" cy="380" r="4" fill="hsl(var(--secondary))" />
      
      <defs>
        <linearGradient id="dbtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--balance-600))" />
          <stop offset="50%" stopColor="hsl(var(--harmony-500))" />
          <stop offset="100%" stopColor="hsl(var(--mindful-600))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default DialecticalBehaviorTherapy;