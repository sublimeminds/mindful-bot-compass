import React from 'react';

interface ScienceBackedIconProps {
  className?: string;
  size?: number;
}

const ScienceBackedIcon: React.FC<ScienceBackedIconProps> = ({ className = '', size = 64 }) => {
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
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--harmony-400))" stopOpacity="0.9" />
          <stop offset="50%" stopColor="hsl(var(--therapy-500))" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(var(--calm-500))" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--harmony-300))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--therapy-400))" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="researchGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--harmony-200))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--harmony-200))" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Research validation aura */}
      <circle cx="32" cy="32" r="28" fill="url(#researchGradient)">
        <animate attributeName="r" values="26;30;26" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="5s" repeatCount="indefinite" />
      </circle>
      
      {/* Central brain form */}
      <path 
        d="M32 12 C38 12 42 16 42 22 C44 22 46 24 46 26 C46 28 44 30 42 30 C42 36 38 40 32 40 C26 40 22 36 22 30 C20 30 18 28 18 26 C18 24 20 22 22 22 C22 16 26 12 32 12 Z" 
        fill="url(#brainGradient)" 
        stroke="hsl(var(--harmony-600))" 
        strokeWidth="1"
        opacity="0.9"
      />
      
      {/* Brain hemisphere division */}
      <path 
        d="M32 12 L32 40" 
        stroke="hsl(var(--harmony-200))" 
        strokeWidth="1" 
        opacity="0.4"
        strokeDasharray="2 2"
      />
      
      {/* Neural network connections */}
      <circle cx="28" cy="20" r="1.5" fill="hsl(var(--harmony-300))">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="36" cy="20" r="1.5" fill="hsl(var(--therapy-300))">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.3s" repeatCount="indefinite" />
      </circle>
      <circle cx="26" cy="28" r="1.5" fill="hsl(var(--calm-300))">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="38" cy="28" r="1.5" fill="hsl(var(--harmony-300))">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.9s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="24" r="1.5" fill="hsl(var(--therapy-300))">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1.2s" repeatCount="indefinite" />
      </circle>
      
      {/* Connecting neural pathways */}
      <path 
        d="M28 20 Q32 18 36 20" 
        stroke="url(#dataGradient)" 
        strokeWidth="1" 
        fill="none" 
        opacity="0.6"
        strokeDasharray="1 1"
      >
        <animate attributeName="stroke-dashoffset" values="0;-2" dur="2s" repeatCount="indefinite" />
      </path>
      <path 
        d="M26 28 Q32 26 38 28" 
        stroke="url(#dataGradient)" 
        strokeWidth="1" 
        fill="none" 
        opacity="0.6"
        strokeDasharray="1 1"
      >
        <animate attributeName="stroke-dashoffset" values="0;-2" dur="2s" begin="0.5s" repeatCount="indefinite" />
      </path>
      
      {/* Research validation badges */}
      <g opacity="0.8">
        <circle cx="12" cy="16" r="4" fill="url(#dataGradient)" />
        <path d="M10 16 L11.5 17.5 L14 14.5" stroke="hsl(var(--background))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      
      <g opacity="0.8">
        <circle cx="52" cy="20" r="4" fill="url(#dataGradient)" />
        <path d="M50 20 L51.5 21.5 L54 18.5" stroke="hsl(var(--background))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      
      <g opacity="0.8">
        <circle cx="16" cy="48" r="4" fill="url(#dataGradient)" />
        <path d="M14 48 L15.5 49.5 L18 46.5" stroke="hsl(var(--background))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      
      {/* Data flow indicators */}
      <path 
        d="M12 16 Q20 8 32 12" 
        stroke="url(#dataGradient)" 
        strokeWidth="1" 
        fill="none" 
        opacity="0.4"
        strokeDasharray="2 2"
      >
        <animate attributeName="stroke-dashoffset" values="0;-4" dur="3s" repeatCount="indefinite" />
      </path>
      <path 
        d="M52 20 Q44 8 32 12" 
        stroke="url(#dataGradient)" 
        strokeWidth="1" 
        fill="none" 
        opacity="0.4"
        strokeDasharray="2 2"
      >
        <animate attributeName="stroke-dashoffset" values="0;-4" dur="3s" begin="1s" repeatCount="indefinite" />
      </path>
      <path 
        d="M16 48 Q24 44 32 40" 
        stroke="url(#dataGradient)" 
        strokeWidth="1" 
        fill="none" 
        opacity="0.4"
        strokeDasharray="2 2"
      >
        <animate attributeName="stroke-dashoffset" values="0;-4" dur="3s" begin="2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
};

export default ScienceBackedIcon;