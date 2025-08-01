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
      viewBox="0 0 512 512" 
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer presence aura */}
      <circle 
        cx="256" 
        cy="256" 
        r="180" 
        fill="none" 
        stroke="url(#presenceAura)" 
        strokeWidth="2" 
        strokeDasharray="8,4"
        opacity="0.4"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 256 256"
          to="360 256 256"
          dur="30s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Infinity symbol base */}
      <path 
        d="M180 256 C180 220 200 200 230 200 C260 200 280 220 280 230 C280 220 300 200 330 200 C360 200 380 220 380 256 C380 292 360 312 330 312 C300 312 280 292 280 282 C280 292 260 312 230 312 C200 312 180 292 180 256 Z" 
        fill="url(#infinityGradient)"
        className="drop-shadow-lg"
      />
      
      {/* Inner flowing energy */}
      <path 
        d="M200 256 C200 235 215 220 235 220 C255 220 270 235 270 245 C270 235 285 220 305 220 C325 220 340 235 340 256 C340 277 325 292 305 292 C285 292 270 277 270 267 C270 277 255 292 235 292 C215 292 200 277 200 256 Z" 
        fill="url(#flowingEnergy)"
        opacity="0.8"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="scale"
          values="1;1.05;1"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
      
      {/* Central availability indicator */}
      <circle 
        cx="256" 
        cy="256" 
        r="25" 
        fill="url(#centralCore)"
        className="drop-shadow-md"
      >
        <animate attributeName="r" values="25;28;25" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;1;0.9" dur="3s" repeatCount="indefinite" />
      </circle>
      
      {/* 24/7 indicator dots */}
      <circle cx="256" cy="231" r="3" fill="white" opacity="0.9" />
      <circle cx="256" cy="281" r="3" fill="white" opacity="0.9" />
      
      {/* Supportive hands visualization */}
      <g opacity="0.6">
        <path 
          d="M160 256 C160 240 170 230 185 230 C195 230 200 235 200 245" 
          stroke="url(#handsGradient)" 
          strokeWidth="6" 
          strokeLinecap="round" 
          fill="none"
        >
          <animate attributeName="opacity" values="0.6;0.9;0.6" dur="5s" repeatCount="indefinite" />
        </path>
        <path 
          d="M352 256 C352 240 342 230 327 230 C317 230 312 235 312 245" 
          stroke="url(#handsGradient)" 
          strokeWidth="6" 
          strokeLinecap="round" 
          fill="none"
        >
          <animate attributeName="opacity" values="0.6;0.9;0.6" dur="5s" repeatCount="indefinite" begin="2.5s" />
        </path>
      </g>
      
      {/* Flowing support particles */}
      <g>
        <circle cx="200" cy="200" r="2" fill="hsl(var(--harmony-400))" opacity="0.7">
          <animateMotion dur="8s" repeatCount="indefinite">
            <path d="M0,0 Q100,-50 200,0 Q100,50 0,0" />
          </animateMotion>
        </circle>
        <circle cx="312" cy="312" r="2" fill="hsl(var(--calm-400))" opacity="0.7">
          <animateMotion dur="8s" repeatCount="indefinite" begin="2s">
            <path d="M0,0 Q-100,50 -200,0 Q-100,-50 0,0" />
          </animateMotion>
        </circle>
        <circle cx="312" cy="200" r="2" fill="hsl(var(--therapy-400))" opacity="0.7">
          <animateMotion dur="8s" repeatCount="indefinite" begin="4s">
            <path d="M0,0 Q-100,-50 -200,0 Q-100,50 0,0" />
          </animateMotion>
        </circle>
        <circle cx="200" cy="312" r="2" fill="hsl(var(--harmony-300))" opacity="0.7">
          <animateMotion dur="8s" repeatCount="indefinite" begin="6s">
            <path d="M0,0 Q100,50 200,0 Q100,-50 0,0" />
          </animateMotion>
        </circle>
      </g>
      
      {/* Availability indicators */}
      <circle cx="140" cy="256" r="4" fill="hsl(var(--therapy-400))" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="372" cy="256" r="4" fill="hsl(var(--calm-400))" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" begin="1s" />
      </circle>
      <circle cx="256" cy="140" r="3" fill="hsl(var(--harmony-400))" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="256" cy="372" r="3" fill="hsl(var(--therapy-300))" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2.5s" repeatCount="indefinite" begin="1.25s" />
      </circle>
      
      <defs>
        {/* Enhanced gradients for premium feel */}
        <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--calm-500))" />
          <stop offset="30%" stopColor="hsl(var(--harmony-500))" />
          <stop offset="70%" stopColor="hsl(var(--therapy-500))" />
          <stop offset="100%" stopColor="hsl(var(--calm-600))" />
        </linearGradient>
        
        <linearGradient id="flowingEnergy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="50%" stopColor="hsl(var(--harmony-300))" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0.3" />
        </linearGradient>
        
        <radialGradient id="centralCore" cx="50%" cy="30%">
          <stop offset="0%" stopColor="hsl(var(--therapy-300))" />
          <stop offset="70%" stopColor="hsl(var(--therapy-500))" />
          <stop offset="100%" stopColor="hsl(var(--therapy-600))" />
        </radialGradient>
        
        <linearGradient id="handsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--calm-400))" />
          <stop offset="100%" stopColor="hsl(var(--harmony-500))" />
        </linearGradient>
        
        <radialGradient id="presenceAura" cx="50%" cy="50%">
          <stop offset="0%" stopColor="hsl(var(--therapy-400) / 0.1)" />
          <stop offset="50%" stopColor="hsl(var(--harmony-400) / 0.3)" />
          <stop offset="100%" stopColor="hsl(var(--calm-400) / 0.2)" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default AlwaysHereIcon;