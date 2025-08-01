import React from 'react';

interface AlwaysHereIconProps {
  className?: string;
  size?: number;
}

const AlwaysHereIcon: React.FC<AlwaysHereIconProps> = ({ className = '', size = 64 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="supportGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--calm-400))" stopOpacity="0.9" />
          <stop offset="50%" stopColor="hsl(var(--harmony-500))" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(var(--therapy-500))" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="timeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--calm-300))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--harmony-400))" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="presenceGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--calm-200))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--calm-200))" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Continuous presence aura */}
      <circle cx="32" cy="32" r="30" fill="url(#presenceGradient)">
        <animate attributeName="r" values="28;32;28" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
      </circle>
      
      {/* Outer supportive hands circle */}
      <circle 
        cx="32" 
        cy="32" 
        r="24" 
        fill="none" 
        stroke="url(#supportGradient)" 
        strokeWidth="2"
        strokeDasharray="4 2"
        opacity="0.7"
      >
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          values="0 32 32;360 32 32" 
          dur="20s" 
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Central 24/7 symbol */}
      <circle cx="32" cy="32" r="16" fill="url(#supportGradient)" opacity="0.8" />
      
      {/* Clock elements */}
      <circle cx="32" cy="32" r="12" fill="none" stroke="hsl(var(--background))" strokeWidth="1.5" />
      
      {/* Clock hands showing always available */}
      <line x1="32" y1="32" x2="32" y2="24" stroke="hsl(var(--background))" strokeWidth="2" strokeLinecap="round">
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          values="0 32 32;360 32 32" 
          dur="12s" 
          repeatCount="indefinite"
        />
      </line>
      <line x1="32" y1="32" x2="38" y2="32" stroke="hsl(var(--background))" strokeWidth="1.5" strokeLinecap="round">
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          values="0 32 32;360 32 32" 
          dur="60s" 
          repeatCount="indefinite"
        />
      </line>
      
      {/* Supportive hands around the clock */}
      <path 
        d="M20 20 Q16 16 20 12 Q24 16 20 20" 
        fill="url(#timeGradient)" 
        opacity="0.7"
      >
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          values="0 32 32;15 32 32;0 32 32" 
          dur="4s" 
          repeatCount="indefinite"
        />
      </path>
      <path 
        d="M44 20 Q48 16 44 12 Q40 16 44 20" 
        fill="url(#timeGradient)" 
        opacity="0.7"
      >
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          values="0 32 32;-15 32 32;0 32 32" 
          dur="4s" 
          begin="1s"
          repeatCount="indefinite"
        />
      </path>
      <path 
        d="M20 44 Q16 48 20 52 Q24 48 20 44" 
        fill="url(#timeGradient)" 
        opacity="0.7"
      >
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          values="0 32 32;15 32 32;0 32 32" 
          dur="4s" 
          begin="2s"
          repeatCount="indefinite"
        />
      </path>
      <path 
        d="M44 44 Q48 48 44 52 Q40 48 44 44" 
        fill="url(#timeGradient)" 
        opacity="0.7"
      >
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          values="0 32 32;-15 32 32;0 32 32" 
          dur="4s" 
          begin="3s"
          repeatCount="indefinite"
        />
      </path>
      
      {/* Availability indicators */}
      <circle cx="16" cy="32" r="2" fill="hsl(var(--calm-400))">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="48" cy="32" r="2" fill="hsl(var(--harmony-400))">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="16" r="2" fill="hsl(var(--therapy-400))">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="48" r="2" fill="hsl(var(--calm-400))">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

export default AlwaysHereIcon;