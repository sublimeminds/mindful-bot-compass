import React from 'react';

const GlobalReachIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => {
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
        <linearGradient id="globalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
          <stop offset="50%" style={{stopColor: '#06b6d4', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#10b981', stopOpacity: 1}} />
        </linearGradient>
        <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{stopColor: '#60a5fa', stopOpacity: 0.8}} />
          <stop offset="100%" style={{stopColor: '#60a5fa', stopOpacity: 0}} />
        </radialGradient>
      </defs>
      
      {/* Globe outline */}
      <circle cx="12" cy="12" r="9" fill="none" stroke="url(#globalGradient)" strokeWidth="2" />
      
      {/* Meridian lines */}
      <ellipse cx="12" cy="12" rx="9" ry="4" fill="none" stroke="url(#globalGradient)" strokeWidth="1.5" opacity="0.7" />
      <ellipse cx="12" cy="12" rx="9" ry="4" fill="none" stroke="url(#globalGradient)" strokeWidth="1.5" opacity="0.7" transform="rotate(45 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="4" fill="none" stroke="url(#globalGradient)" strokeWidth="1.5" opacity="0.7" transform="rotate(90 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="4" fill="none" stroke="url(#globalGradient)" strokeWidth="1.5" opacity="0.7" transform="rotate(135 12 12)" />
      
      {/* Connection points representing global reach */}
      <circle cx="6" cy="8" r="1.5" fill="url(#globalGradient)">
        <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="18" cy="10" r="1.5" fill="url(#globalGradient)">
        <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="8" cy="16" r="1.5" fill="url(#globalGradient)">
        <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" begin="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="16" cy="18" r="1.5" fill="url(#globalGradient)">
        <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" begin="1.5s" repeatCount="indefinite" />
      </circle>
      
      {/* Central pulse effect */}
      <circle cx="12" cy="12" r="15" fill="url(#pulseGradient)" opacity="0.3">
        <animate attributeName="r" values="0;15;0" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      
      {/* Connecting lines showing global network */}
      <path d="M6 8 Q12 4 18 10" fill="none" stroke="url(#globalGradient)" strokeWidth="1" opacity="0.5" strokeDasharray="2,2">
        <animate attributeName="stroke-dashoffset" values="0;-4" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M18 10 Q16 14 8 16" fill="none" stroke="url(#globalGradient)" strokeWidth="1" opacity="0.5" strokeDasharray="2,2">
        <animate attributeName="stroke-dashoffset" values="0;-4" dur="2s" begin="0.5s" repeatCount="indefinite" />
      </path>
      <path d="M8 16 Q10 20 16 18" fill="none" stroke="url(#globalGradient)" strokeWidth="1" opacity="0.5" strokeDasharray="2,2">
        <animate attributeName="stroke-dashoffset" values="0;-4" dur="2s" begin="1s" repeatCount="indefinite" />
      </path>
    </svg>
  );
};

export default GlobalReachIcon;