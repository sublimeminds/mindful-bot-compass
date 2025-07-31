import React from 'react';

const AIHubIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => {
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
        <linearGradient id="hubGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#f59e0b', stopOpacity: 1}} />
          <stop offset="50%" style={{stopColor: '#ef4444', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#8b5cf6', stopOpacity: 1}} />
        </linearGradient>
        <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{stopColor: '#fbbf24', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#f59e0b', stopOpacity: 0.8}} />
        </radialGradient>
      </defs>
      
      {/* Central AI core */}
      <circle cx="12" cy="12" r="4" fill="url(#coreGradient)">
        <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" />
      </circle>
      
      {/* AI processing nodes */}
      <circle cx="12" cy="4" r="2" fill="url(#hubGradient)" opacity="0.8">
        <animate attributeName="cy" values="4;3;4" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="20" cy="12" r="2" fill="url(#hubGradient)" opacity="0.8">
        <animate attributeName="cx" values="20;21;20" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
      </circle>
      <circle cx="12" cy="20" r="2" fill="url(#hubGradient)" opacity="0.8">
        <animate attributeName="cy" values="20;21;20" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="4" cy="12" r="2" fill="url(#hubGradient)" opacity="0.8">
        <animate attributeName="cx" values="4;3;4" dur="1.5s" begin="0.9s" repeatCount="indefinite" />
      </circle>
      
      {/* Diagonal nodes */}
      <circle cx="17" cy="7" r="1.5" fill="url(#hubGradient)" opacity="0.6">
        <animate attributeName="r" values="1.5;2;1.5" dur="2s" begin="0.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="17" cy="17" r="1.5" fill="url(#hubGradient)" opacity="0.6">
        <animate attributeName="r" values="1.5;2;1.5" dur="2s" begin="0.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="7" cy="17" r="1.5" fill="url(#hubGradient)" opacity="0.6">
        <animate attributeName="r" values="1.5;2;1.5" dur="2s" begin="0.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="7" cy="7" r="1.5" fill="url(#hubGradient)" opacity="0.6">
        <animate attributeName="r" values="1.5;2;1.5" dur="2s" begin="0.8s" repeatCount="indefinite" />
      </circle>
      
      {/* Data flow connections */}
      <path d="M12 8 L12 4" stroke="url(#hubGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.7" strokeDasharray="1,1">
        <animate attributeName="stroke-dashoffset" values="0;-2" dur="1s" repeatCount="indefinite" />
      </path>
      <path d="M16 12 L20 12" stroke="url(#hubGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.7" strokeDasharray="1,1">
        <animate attributeName="stroke-dashoffset" values="0;-2" dur="1s" begin="0.25s" repeatCount="indefinite" />
      </path>
      <path d="M12 16 L12 20" stroke="url(#hubGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.7" strokeDasharray="1,1">
        <animate attributeName="stroke-dashoffset" values="0;-2" dur="1s" begin="0.5s" repeatCount="indefinite" />
      </path>
      <path d="M8 12 L4 12" stroke="url(#hubGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.7" strokeDasharray="1,1">
        <animate attributeName="stroke-dashoffset" values="0;-2" dur="1s" begin="0.75s" repeatCount="indefinite" />
      </path>
      
      {/* Diagonal connections */}
      <path d="M14.5 9.5 L17 7" stroke="url(#hubGradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" strokeDasharray="0.5,0.5">
        <animate attributeName="stroke-dashoffset" values="0;-1" dur="1.2s" repeatCount="indefinite" />
      </path>
      <path d="M14.5 14.5 L17 17" stroke="url(#hubGradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" strokeDasharray="0.5,0.5">
        <animate attributeName="stroke-dashoffset" values="0;-1" dur="1.2s" begin="0.3s" repeatCount="indefinite" />
      </path>
      <path d="M9.5 14.5 L7 17" stroke="url(#hubGradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" strokeDasharray="0.5,0.5">
        <animate attributeName="stroke-dashoffset" values="0;-1" dur="1.2s" begin="0.6s" repeatCount="indefinite" />
      </path>
      <path d="M9.5 9.5 L7 7" stroke="url(#hubGradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" strokeDasharray="0.5,0.5">
        <animate attributeName="stroke-dashoffset" values="0;-1" dur="1.2s" begin="0.9s" repeatCount="indefinite" />
      </path>
      
      {/* Central AI indicator */}
      <circle cx="12" cy="12" r="1" fill="white">
        <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

export default AIHubIcon;