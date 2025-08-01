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
      viewBox="0 0 512 512" 
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer protective aura */}
      <circle 
        cx="256" 
        cy="256" 
        r="200" 
        fill="none" 
        stroke="url(#auraglow)" 
        strokeWidth="2" 
        opacity="0.3"
        className="animate-pulse"
        style={{
          animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />
      
      {/* Main shield glass morphism */}
      <path 
        d="M256 80 C320 80 360 120 360 160 L360 240 C360 320 256 400 256 400 C256 400 152 320 152 240 L152 160 C152 120 192 80 256 80 Z" 
        fill="url(#shieldGradient)"
        className="drop-shadow-2xl"
      />
      
      {/* Inner shield highlight */}
      <path 
        d="M256 100 C310 100 340 130 340 160 L340 230 C340 300 256 370 256 370 C256 370 172 300 172 230 L172 160 C172 130 202 100 256 100 Z" 
        fill="url(#innerShield)"
        opacity="0.8"
      />
      
      {/* Central protection core */}
      <circle 
        cx="256" 
        cy="220" 
        r="45" 
        fill="url(#coreGradient)"
        className="drop-shadow-lg"
      />
      
      {/* Protection checkmark */}
      <path 
        d="M235 220 L248 233 L277 204" 
        stroke="white" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
        className="drop-shadow-sm"
      />
      
      {/* Floating protection particles */}
      <circle cx="200" cy="180" r="4" fill="url(#particleGradient)" opacity="0.8">
        <animate attributeName="cy" values="180;170;180" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="312" cy="200" r="3" fill="url(#particleGradient)" opacity="0.6">
        <animate attributeName="cy" values="200;190;200" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="220" cy="280" r="3" fill="url(#particleGradient)" opacity="0.7">
        <animate attributeName="cy" values="280;270;280" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="292" cy="260" r="2" fill="url(#particleGradient)" opacity="0.5">
        <animate attributeName="cy" values="260;250;260" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2.2s" repeatCount="indefinite" />
      </circle>
      
      {/* Orbital protection elements */}
      <g>
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 256 220"
          to="360 256 220"
          dur="20s"
          repeatCount="indefinite"
        />
        <circle cx="320" cy="220" r="3" fill="hsl(var(--therapy-400))" opacity="0.6" />
        <circle cx="192" cy="220" r="3" fill="hsl(var(--calm-400))" opacity="0.6" />
      </g>
      
      <defs>
        {/* Enhanced gradients for glass morphism effect */}
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--therapy-500) / 0.9)" />
          <stop offset="30%" stopColor="hsl(var(--calm-500) / 0.8)" />
          <stop offset="70%" stopColor="hsl(var(--harmony-500) / 0.8)" />
          <stop offset="100%" stopColor="hsl(var(--therapy-600) / 0.9)" />
        </linearGradient>
        
        <linearGradient id="innerShield" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="50%" stopColor="white" stopOpacity="0.1" />
          <stop offset="100%" stopColor="white" stopOpacity="0.2" />
        </linearGradient>
        
        <radialGradient id="coreGradient" cx="50%" cy="30%">
          <stop offset="0%" stopColor="hsl(var(--therapy-300))" />
          <stop offset="100%" stopColor="hsl(var(--therapy-600))" />
        </radialGradient>
        
        <radialGradient id="particleGradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="hsl(var(--harmony-400))" />
          <stop offset="100%" stopColor="hsl(var(--calm-500))" />
        </radialGradient>
        
        <radialGradient id="auraglow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="hsl(var(--therapy-400) / 0.1)" />
          <stop offset="70%" stopColor="hsl(var(--calm-400) / 0.2)" />
          <stop offset="100%" stopColor="hsl(var(--harmony-400) / 0.3)" />
        </radialGradient>
        
        {/* Subtle shadow filters */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

export default SafeHavenIcon;