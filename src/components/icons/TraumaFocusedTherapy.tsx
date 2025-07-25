import React from 'react';

interface TraumaFocusedTherapyProps {
  className?: string;
  size?: number;
}

const TraumaFocusedTherapy: React.FC<TraumaFocusedTherapyProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#traumaGradient)" />
      
      {/* Protective shield */}
      <path d="M256 100 L340 140 L340 260 Q340 320 256 380 Q172 320 172 260 L172 140 Z" fill="white" />
      <path d="M256 124 L316 156 L316 252 Q316 296 256 340 Q196 296 196 252 L196 156 Z" fill="hsl(var(--therapy-500))" opacity="0.2" />
      
      {/* Healing heart */}
      <path d="M256 200 C248 192 232 192 232 208 C232 208 232 224 256 240 C280 224 280 208 280 208 C280 192 264 192 256 200 Z" fill="hsl(var(--therapy-500))" />
      <path d="M244 204 L268 204 M256 192 L256 216" stroke="white" strokeWidth="4" strokeLinecap="round" />
      
      {/* Gentle waves of recovery */}
      <path d="M200 300 Q220 290 240 300 Q260 310 280 300 Q300 290 320 300" 
            stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M200 320 Q220 310 240 320 Q260 330 280 320 Q300 310 320 320" 
            stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
      
      {/* Support symbols */}
      <circle cx="180" cy="180" r="12" fill="white" />
      <path d="M174 174 L180 180 L186 174" stroke="hsl(var(--success))" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      <circle cx="332" cy="180" r="12" fill="white" />
      <path d="M326 174 L332 180 L338 174" stroke="hsl(var(--success))" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* Growth indicators */}
      <circle cx="220" cy="360" r="6" fill="white" />
      <circle cx="240" cy="350" r="6" fill="white" />
      <circle cx="260" cy="345" r="6" fill="white" />
      <circle cx="280" cy="350" r="6" fill="white" />
      <circle cx="300" cy="360" r="6" fill="white" />
      
      <defs>
        <linearGradient id="traumaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--therapy-600))" />
          <stop offset="50%" stopColor="hsl(var(--calm-500))" />
          <stop offset="100%" stopColor="hsl(var(--mindful-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default TraumaFocusedTherapy;