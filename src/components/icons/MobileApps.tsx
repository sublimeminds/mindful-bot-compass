import React from 'react';

interface MobileAppsProps {
  className?: string;
  size?: number;
}

const MobileApps: React.FC<MobileAppsProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#mobileGradient)" />
      <rect x="180" y="80" width="152" height="272" rx="24" fill="white" />
      <rect x="192" y="112" width="128" height="192" rx="8" fill="hsl(var(--primary))" />
      <circle cx="256" cy="336" r="12" fill="hsl(var(--primary))" />
      <rect x="200" y="96" width="16" height="4" rx="2" fill="hsl(var(--primary))" />
      <circle cx="240" cy="98" r="2" fill="hsl(var(--primary))" />
      
      {/* App icons on screen */}
      <rect x="208" y="128" width="24" height="24" rx="4" fill="white" />
      <rect x="240" y="128" width="24" height="24" rx="4" fill="white" />
      <rect x="272" y="128" width="24" height="24" rx="4" fill="white" />
      <rect x="208" y="160" width="24" height="24" rx="4" fill="white" />
      <rect x="240" y="160" width="24" height="24" rx="4" fill="white" />
      <rect x="272" y="160" width="24" height="24" rx="4" fill="white" />
      
      <defs>
        <linearGradient id="mobileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="50%" stopColor="hsl(var(--secondary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default MobileApps;