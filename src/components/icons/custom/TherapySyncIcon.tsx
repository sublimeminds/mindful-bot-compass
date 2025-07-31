import React from 'react';

const TherapySyncIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => {
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
        <linearGradient id="therapySyncGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#8b5cf6', stopOpacity: 1}} />
          <stop offset="50%" style={{stopColor: '#06b6d4', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#10b981', stopOpacity: 1}} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Central brain/heart hybrid representing AI + human connection */}
      <path d="M12 3C8.5 3 6 5.5 6 9c0 2 1 3.5 2.5 4.5L12 21l3.5-7.5C17 12.5 18 11 18 9c0-3.5-2.5-6-6-6z" 
            fill="url(#therapySyncGradient)" 
            filter="url(#glow)" />
      
      {/* Neural network connections */}
      <circle cx="8" cy="7" r="1" fill="currentColor" opacity="0.6">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="16" cy="7" r="1" fill="currentColor" opacity="0.6">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="12" cy="5" r="1" fill="currentColor" opacity="0.6">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="1s" repeatCount="indefinite" />
      </circle>
      
      {/* Connecting synapses */}
      <line x1="8" y1="7" x2="10" y2="8" stroke="url(#therapySyncGradient)" strokeWidth="1" opacity="0.7" strokeLinecap="round" />
      <line x1="16" y1="7" x2="14" y2="8" stroke="url(#therapySyncGradient)" strokeWidth="1" opacity="0.7" strokeLinecap="round" />
      <line x1="12" y1="5" x2="12" y2="7" stroke="url(#therapySyncGradient)" strokeWidth="1" opacity="0.7" strokeLinecap="round" />
      
      {/* Healing energy waves */}
      <circle cx="12" cy="9" r="8" fill="none" stroke="url(#therapySyncGradient)" strokeWidth="0.5" opacity="0.3">
        <animate attributeName="r" values="8;12;8" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="12" cy="9" r="6" fill="none" stroke="url(#therapySyncGradient)" strokeWidth="0.5" opacity="0.4">
        <animate attributeName="r" values="6;10;6" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
      </circle>
      
      {/* Heart pulse inside brain */}
      <path d="M10 8.5c0-1 1-1.5 2-0.5 1-1 2-0.5 2 0.5 0 1-2 3-2 3s-2-2-2-3z" 
            fill="white" 
            opacity="0.8">
        <animateTransform attributeName="transform" 
                         type="scale" 
                         values="1;1.2;1" 
                         dur="1.5s" 
                         repeatCount="indefinite" />
      </path>
    </svg>
  );
};

export default TherapySyncIcon;