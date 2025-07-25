import React from 'react';

interface CrisisSupportProps {
  className?: string;
  size?: number;
}

const CrisisSupport: React.FC<CrisisSupportProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#crisisGradient)" />
      
      {/* Emergency phone */}
      <rect x="180" y="140" width="152" height="232" rx="24" fill="white" />
      <rect x="196" y="180" width="120" height="152" rx="8" fill="hsl(var(--primary))" />
      
      {/* Emergency call button */}
      <circle cx="256" cy="380" r="20" fill="white" />
      <circle cx="256" cy="380" r="12" fill="hsl(var(--destructive))" />
      
      {/* SOS text */}
      <text x="256" y="260" textAnchor="middle" fill="white" fontSize="32" fontWeight="bold">SOS</text>
      
      {/* Signal waves */}
      <circle cx="120" cy="120" r="16" fill="white" opacity="0.8" />
      <circle cx="120" cy="120" r="24" fill="none" stroke="white" strokeWidth="3" opacity="0.6" />
      <circle cx="120" cy="120" r="32" fill="none" stroke="white" strokeWidth="3" opacity="0.4" />
      
      <circle cx="392" cy="120" r="16" fill="white" opacity="0.8" />
      <circle cx="392" cy="120" r="24" fill="none" stroke="white" strokeWidth="3" opacity="0.6" />
      <circle cx="392" cy="120" r="32" fill="none" stroke="white" strokeWidth="3" opacity="0.4" />
      
      <defs>
        <linearGradient id="crisisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--destructive))" />
          <stop offset="100%" stopColor="hsl(var(--therapy-600))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CrisisSupport;