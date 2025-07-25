import React from 'react';

interface CrisisSupportSystemProps {
  className?: string;
  size?: number;
}

const CrisisSupportSystem: React.FC<CrisisSupportSystemProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#crisisGradient)" />
      
      {/* Shield shape */}
      <path d="M256 80 L320 120 L320 240 Q320 280 256 320 Q192 280 192 240 L192 120 Z" fill="white" />
      
      {/* Medical cross */}
      <rect x="240" y="160" width="32" height="120" rx="4" fill="hsl(var(--primary))" />
      <rect x="200" y="200" width="112" height="32" rx="4" fill="hsl(var(--primary))" />
      
      {/* 24/7 indicator */}
      <circle cx="160" cy="160" r="20" fill="white" />
      <text x="160" y="166" textAnchor="middle" fill="hsl(var(--accent))" fontSize="16" fontWeight="bold">24</text>
      
      <circle cx="352" cy="160" r="20" fill="white" />
      <text x="352" y="166" textAnchor="middle" fill="hsl(var(--accent))" fontSize="16" fontWeight="bold">7</text>
      
      {/* Emergency signals */}
      <circle cx="256" cy="400" r="16" fill="white" />
      <circle cx="216" cy="380" r="12" fill="white" opacity="0.8" />
      <circle cx="296" cy="380" r="12" fill="white" opacity="0.8" />
      <circle cx="180" cy="360" r="8" fill="white" opacity="0.6" />
      <circle cx="332" cy="360" r="8" fill="white" opacity="0.6" />
      
      <defs>
        <linearGradient id="crisisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--therapy-600))" />
          <stop offset="100%" stopColor="hsl(var(--harmony-600))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CrisisSupportSystem;