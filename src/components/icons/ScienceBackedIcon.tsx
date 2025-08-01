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
      viewBox="0 0 512 512" 
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Neural network background */}
      <g opacity="0.3">
        <line x1="120" y1="180" x2="180" y2="120" stroke="url(#neuralGradient)" strokeWidth="1.5" />
        <line x1="180" y1="120" x2="256" y2="140" stroke="url(#neuralGradient)" strokeWidth="1.5" />
        <line x1="256" y1="140" x2="330" y2="120" stroke="url(#neuralGradient)" strokeWidth="1.5" />
        <line x1="330" y1="120" x2="390" y2="180" stroke="url(#neuralGradient)" strokeWidth="1.5" />
        <line x1="120" y1="330" x2="180" y2="390" stroke="url(#neuralGradient)" strokeWidth="1.5" />
        <line x1="180" y1="390" x2="256" y2="370" stroke="url(#neuralGradient)" strokeWidth="1.5" />
        <line x1="256" y1="370" x2="330" y2="390" stroke="url(#neuralGradient)" strokeWidth="1.5" />
        <line x1="330" y1="390" x2="390" y2="330" stroke="url(#neuralGradient)" strokeWidth="1.5" />
        
        {/* Neural nodes */}
        <circle cx="120" cy="180" r="3" fill="hsl(var(--therapy-400))" />
        <circle cx="180" cy="120" r="3" fill="hsl(var(--harmony-400))" />
        <circle cx="330" cy="120" r="3" fill="hsl(var(--calm-400))" />
        <circle cx="390" cy="180" r="3" fill="hsl(var(--therapy-400))" />
        <circle cx="120" cy="330" r="3" fill="hsl(var(--calm-400))" />
        <circle cx="180" cy="390" r="3" fill="hsl(var(--harmony-400))" />
        <circle cx="330" cy="390" r="3" fill="hsl(var(--therapy-400))" />
        <circle cx="390" cy="330" r="3" fill="hsl(var(--calm-400))" />
      </g>
      
      {/* Main brain structure */}
      <path 
        d="M180 180 C160 160 160 140 180 130 C200 120 220 130 240 140 C260 130 280 120 300 130 C320 140 320 160 300 180 C320 200 320 220 300 230 C320 250 320 270 300 280 C280 290 260 280 240 270 C220 280 200 290 180 280 C160 270 160 250 180 230 C160 220 160 200 180 180 Z" 
        fill="url(#brainGradient)"
        className="drop-shadow-xl"
      />
      
      {/* Brain cortex detail */}
      <path 
        d="M200 190 C190 180 190 170 200 165 C210 160 220 165 230 170 C240 165 250 160 260 165 C270 170 270 180 260 190 C270 200 270 210 260 215 C270 225 270 235 260 240 C250 245 240 240 230 235 C220 240 210 245 200 240 C190 235 190 225 200 215 C190 210 190 200 200 190 Z" 
        fill="url(#cortexGradient)"
        opacity="0.8"
      />
      
      {/* Central processing core */}
      <circle 
        cx="240" 
        cy="205" 
        r="20" 
        fill="url(#coreGradient)"
        className="drop-shadow-lg"
      >
        <animate attributeName="r" values="20;22;20" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;1;0.9" dur="3s" repeatCount="indefinite" />
      </circle>
      
      {/* AI processing indicators */}
      <circle cx="240" cy="195" r="2" fill="white" opacity="0.9" />
      <circle cx="235" cy="205" r="1.5" fill="white" opacity="0.8" />
      <circle cx="245" cy="205" r="1.5" fill="white" opacity="0.8" />
      <circle cx="240" cy="215" r="2" fill="white" opacity="0.9" />
      
      {/* Data flow streams */}
      <g opacity="0.7">
        <path 
          d="M140 160 Q200 140 260 160" 
          stroke="url(#dataFlow)" 
          strokeWidth="2" 
          fill="none" 
          strokeDasharray="4,2"
        >
          <animate attributeName="stroke-dashoffset" values="0;12;0" dur="2s" repeatCount="indefinite" />
        </path>
        <path 
          d="M260 160 Q320 140 380 160" 
          stroke="url(#dataFlow)" 
          strokeWidth="2" 
          fill="none" 
          strokeDasharray="4,2"
        >
          <animate attributeName="stroke-dashoffset" values="0;12;0" dur="2s" repeatCount="indefinite" begin="0.5s" />
        </path>
        <path 
          d="M140 250 Q200 270 260 250" 
          stroke="url(#dataFlow)" 
          strokeWidth="2" 
          fill="none" 
          strokeDasharray="4,2"
        >
          <animate attributeName="stroke-dashoffset" values="0;12;0" dur="2s" repeatCount="indefinite" begin="1s" />
        </path>
        <path 
          d="M260 250 Q320 270 380 250" 
          stroke="url(#dataFlow)" 
          strokeWidth="2" 
          fill="none" 
          strokeDasharray="4,2"
        >
          <animate attributeName="stroke-dashoffset" values="0;12;0" dur="2s" repeatCount="indefinite" begin="1.5s" />
        </path>
      </g>
      
      {/* Research validation badges */}
      <g>
        <circle cx="160" cy="140" r="8" fill="url(#validationGradient)" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.6;0.9" dur="3s" repeatCount="indefinite" />
        </circle>
        <path d="M156 140 L159 143 L164 138" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        
        <circle cx="350" cy="140" r="8" fill="url(#validationGradient)" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.6;0.9" dur="3s" repeatCount="indefinite" begin="1s" />
        </circle>
        <path d="M346 140 L349 143 L354 138" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        
        <circle cx="160" cy="270" r="8" fill="url(#validationGradient)" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.6;0.9" dur="3s" repeatCount="indefinite" begin="2s" />
        </circle>
        <path d="M156 270 L159 273 L164 268" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        
        <circle cx="350" cy="270" r="8" fill="url(#validationGradient)" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.6;0.9" dur="3s" repeatCount="indefinite" begin="0.5s" />
        </circle>
        <path d="M346 270 L349 273 L354 268" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </g>
      
      {/* Intelligence particles */}
      <circle cx="180" cy="180" r="2" fill="hsl(var(--therapy-400))" opacity="0.8">
        <animateMotion dur="4s" repeatCount="indefinite">
          <path d="M0,0 Q20,-10 40,0 Q20,10 0,0" />
        </animateMotion>
      </circle>
      <circle cx="300" cy="180" r="2" fill="hsl(var(--harmony-400))" opacity="0.8">
        <animateMotion dur="4s" repeatCount="indefinite" begin="1s">
          <path d="M0,0 Q-20,-10 -40,0 Q-20,10 0,0" />
        </animateMotion>
      </circle>
      <circle cx="180" cy="230" r="2" fill="hsl(var(--calm-400))" opacity="0.8">
        <animateMotion dur="4s" repeatCount="indefinite" begin="2s">
          <path d="M0,0 Q20,10 40,0 Q20,-10 0,0" />
        </animateMotion>
      </circle>
      <circle cx="300" cy="230" r="2" fill="hsl(var(--therapy-300))" opacity="0.8">
        <animateMotion dur="4s" repeatCount="indefinite" begin="3s">
          <path d="M0,0 Q-20,10 -40,0 Q-20,-10 0,0" />
        </animateMotion>
      </circle>
      
      <defs>
        {/* Enhanced gradients for scientific sophistication */}
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--therapy-500))" />
          <stop offset="30%" stopColor="hsl(var(--harmony-500))" />
          <stop offset="70%" stopColor="hsl(var(--calm-500))" />
          <stop offset="100%" stopColor="hsl(var(--therapy-600))" />
        </linearGradient>
        
        <linearGradient id="cortexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="50%" stopColor="hsl(var(--harmony-300))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="white" stopOpacity="0.3" />
        </linearGradient>
        
        <radialGradient id="coreGradient" cx="50%" cy="30%">
          <stop offset="0%" stopColor="hsl(var(--therapy-300))" />
          <stop offset="70%" stopColor="hsl(var(--therapy-500))" />
          <stop offset="100%" stopColor="hsl(var(--therapy-600))" />
        </radialGradient>
        
        <linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--calm-400))" stopOpacity="0.3" />
          <stop offset="50%" stopColor="hsl(var(--harmony-400))" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(var(--therapy-400))" stopOpacity="0.3" />
        </linearGradient>
        
        <radialGradient id="validationGradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="hsl(var(--harmony-400))" />
          <stop offset="100%" stopColor="hsl(var(--harmony-600))" />
        </radialGradient>
        
        <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--therapy-400) / 0.5)" />
          <stop offset="50%" stopColor="hsl(var(--harmony-400) / 0.7)" />
          <stop offset="100%" stopColor="hsl(var(--calm-400) / 0.5)" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ScienceBackedIcon;