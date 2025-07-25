import React from 'react';

interface CommunityGroupsProps {
  className?: string;
  size?: number;
}

const CommunityGroups: React.FC<CommunityGroupsProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#communityGradient)" />
      
      {/* Central community circle */}
      <circle cx="256" cy="256" r="80" fill="white" />
      
      {/* Community members around the circle */}
      <circle cx="256" cy="140" r="24" fill="white" />
      <circle cx="340" cy="180" r="24" fill="white" />
      <circle cx="372" cy="256" r="24" fill="white" />
      <circle cx="340" cy="332" r="24" fill="white" />
      <circle cx="256" cy="372" r="24" fill="white" />
      <circle cx="172" cy="332" r="24" fill="white" />
      <circle cx="140" cy="256" r="24" fill="white" />
      <circle cx="172" cy="180" r="24" fill="white" />
      
      {/* Connection lines to center */}
      <line x1="256" y1="164" x2="256" y2="176" stroke="white" strokeWidth="4" />
      <line x1="324" y1="196" x2="316" y2="204" stroke="white" strokeWidth="4" />
      <line x1="348" y1="256" x2="336" y2="256" stroke="white" strokeWidth="4" />
      <line x1="324" y1="316" x2="316" y2="308" stroke="white" strokeWidth="4" />
      <line x1="256" y1="348" x2="256" y2="336" stroke="white" strokeWidth="4" />
      <line x1="188" y1="316" x2="196" y2="308" stroke="white" strokeWidth="4" />
      <line x1="164" y1="256" x2="176" y2="256" stroke="white" strokeWidth="4" />
      <line x1="188" y1="196" x2="196" y2="204" stroke="white" strokeWidth="4" />
      
      {/* Heart symbol in center */}
      <path d="M256 280 C248 272 232 272 232 288 C232 288 232 304 256 320 C280 304 280 288 280 288 C280 272 264 272 256 280 Z" fill="hsl(var(--primary))" />
      
      <defs>
        <linearGradient id="communityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--flow-500))" />
          <stop offset="100%" stopColor="hsl(var(--balance-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CommunityGroups;