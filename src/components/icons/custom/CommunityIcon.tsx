import React from 'react';

const CommunityIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="communityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#6366f1', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#8b5cf6', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      
      {/* Central connection hub */}
      <circle cx="12" cy="12" r="3" fill="url(#communityGradient)" />
      
      {/* Community members around the center */}
      <circle cx="6" cy="6" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="18" cy="6" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="6" cy="18" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="18" cy="18" r="2" fill="currentColor" opacity="0.8" />
      
      {/* Connection lines */}
      <line x1="8" y1="8" x2="10" y2="10" stroke="url(#communityGradient)" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="8" x2="14" y2="10" stroke="url(#communityGradient)" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="16" x2="10" y2="14" stroke="url(#communityGradient)" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="16" x2="14" y2="14" stroke="url(#communityGradient)" strokeWidth="2" strokeLinecap="round" />
      
      {/* Heart symbols for connection */}
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
            fill="none" 
            stroke="url(#communityGradient)" 
            strokeWidth="1" 
            opacity="0.3" 
            transform="scale(0.3) translate(24, 24)" />
    </svg>
  );
};

export default CommunityIcon;