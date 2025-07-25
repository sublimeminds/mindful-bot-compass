import React from 'react';

interface EnterpriseSecurityProps {
  className?: string;
  size?: number;
}

const EnterpriseSecurity: React.FC<EnterpriseSecurityProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#enterpriseGradient)" />
      
      {/* Main shield */}
      <path d="M256 80 L360 120 L360 240 Q360 300 256 360 Q152 300 152 240 L152 120 Z" fill="white" />
      <path d="M256 104 L336 136 L336 232 Q336 276 256 320 Q176 276 176 232 L176 136 Z" fill="hsl(var(--primary))" />
      
      {/* Lock symbol */}
      <rect x="232" y="200" width="48" height="64" rx="8" fill="white" />
      <rect x="240" y="192" width="32" height="16" rx="16" fill="none" stroke="white" strokeWidth="6" />
      <circle cx="256" cy="232" r="8" fill="hsl(var(--primary))" />
      <rect x="252" y="232" width="8" height="16" fill="hsl(var(--primary))" />
      
      {/* Security badges */}
      <circle cx="320" cy="180" r="20" fill="white" />
      <path d="M312 172 L320 180 L328 172" stroke="hsl(var(--success))" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M312 185 L320 193 L328 185" stroke="hsl(var(--success))" strokeWidth="3" fill="none" strokeLinecap="round" />
      
      <circle cx="192" cy="180" r="20" fill="white" />
      <rect x="186" y="174" width="12" height="12" rx="2" fill="hsl(var(--warning))" />
      
      {/* Enterprise network nodes */}
      <circle cx="128" cy="320" r="12" fill="white" />
      <circle cx="384" cy="320" r="12" fill="white" />
      <circle cx="256" cy="400" r="12" fill="white" />
      
      <line x1="140" y1="320" x2="200" y2="300" stroke="white" strokeWidth="2" opacity="0.7" />
      <line x1="372" y1="320" x2="312" y2="300" stroke="white" strokeWidth="2" opacity="0.7" />
      <line x1="256" y1="388" x2="256" y2="360" stroke="white" strokeWidth="2" opacity="0.7" />
      
      <defs>
        <linearGradient id="enterpriseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--slate-700))" />
          <stop offset="50%" stopColor="hsl(var(--blue-600))" />
          <stop offset="100%" stopColor="hsl(var(--indigo-700))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default EnterpriseSecurity;