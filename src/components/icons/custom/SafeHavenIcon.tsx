import React from 'react';

interface SafeHavenIconProps {
  className?: string;
  size?: number;
}

const SafeHavenIcon: React.FC<SafeHavenIconProps> = ({ className = '', size = 64 }) => {
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
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--therapy-400))" stopOpacity="0.9" />
          <stop offset="50%" stopColor="hsl(var(--calm-500))" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(var(--harmony-500))" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--therapy-300))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--calm-400))" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="auraGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--therapy-200))" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(var(--therapy-200))" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Protective aura */}
      <circle cx="32" cy="32" r="28" fill="url(#auraGradient)">
        <animate attributeName="r" values="26;30;26" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="4s" repeatCount="indefinite" />
      </circle>
      
      {/* Main shield */}
      <path 
        d="M32 8 C24 8 16 12 16 20 L16 28 C16 44 32 54 32 54 S48 44 48 28 L48 20 C48 12 40 8 32 8 Z" 
        fill="url(#shieldGradient)" 
        stroke="hsl(var(--therapy-600))" 
        strokeWidth="1.5"
        opacity="0.9"
      />
      
      {/* Inner shield highlight */}
      <path 
        d="M32 12 C26 12 20 15 20 22 L20 28 C20 40 32 48 32 48 S44 40 44 28 L44 22 C44 15 38 12 32 12 Z" 
        fill="none" 
        stroke="hsl(var(--therapy-200))" 
        strokeWidth="1"
        opacity="0.4"
      />
      
      {/* Heart center */}
      <path 
        d="M32 42 C28 38 24 34 24 30 C24 26 28 22 32 22 S40 26 40 30 C40 34 36 38 32 42 Z" 
        fill="url(#heartGradient)"
        stroke="hsl(var(--therapy-600))" 
        strokeWidth="0.5"
      >
        <animateTransform 
          attributeName="transform" 
          type="scale" 
          values="1;1.05;1" 
          dur="3s" 
          repeatCount="indefinite"
        />
      </path>
      
      {/* Protective energy dots */}
      <circle cx="20" cy="24" r="1.5" fill="hsl(var(--therapy-300))" opacity="0.6">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="44" cy="24" r="1.5" fill="hsl(var(--calm-300))" opacity="0.6">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="24" cy="36" r="1.5" fill="hsl(var(--harmony-300))" opacity="0.6">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="36" r="1.5" fill="hsl(var(--therapy-300))" opacity="0.6">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

export default SafeHavenIcon;