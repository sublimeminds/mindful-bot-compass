import React from 'react';

interface MindfulnessBasedTherapyProps {
  className?: string;
  size?: number;
}

const MindfulnessBasedTherapy: React.FC<MindfulnessBasedTherapyProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#mindfulnessGradient)" />
      
      {/* Meditation figure */}
      <circle cx="256" cy="180" r="40" fill="white" />
      <path d="M256 140 Q276 120 296 140 Q296 160 276 180 Q256 200 236 180 Q216 160 216 140 Q236 120 256 140" fill="white" />
      
      {/* Lotus position body */}
      <ellipse cx="256" cy="280" rx="60" ry="40" fill="white" />
      <path d="M196 260 Q216 240 256 260 Q296 240 316 260 Q296 300 256 280 Q216 300 196 260" fill="white" />
      
      {/* Chakra energy points */}
      <circle cx="256" cy="200" r="8" fill="hsl(var(--mindful-400))" />
      <circle cx="256" cy="220" r="8" fill="hsl(var(--mindful-500))" />
      <circle cx="256" cy="240" r="8" fill="hsl(var(--mindful-600))" />
      <circle cx="256" cy="260" r="8" fill="hsl(var(--mindful-500))" />
      <circle cx="256" cy="280" r="8" fill="hsl(var(--mindful-400))" />
      
      {/* Breathing waves */}
      <circle cx="256" cy="256" r="80" fill="none" stroke="white" strokeWidth="3" opacity="0.6" />
      <circle cx="256" cy="256" r="100" fill="none" stroke="white" strokeWidth="2" opacity="0.4" />
      <circle cx="256" cy="256" r="120" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
      
      {/* Peaceful symbols */}
      <path d="M150 150 Q170 130 190 150 Q170 170 150 150" fill="white" opacity="0.8" />
      <path d="M322 150 Q342 130 362 150 Q342 170 322 150" fill="white" opacity="0.8" />
      
      {/* Inner peace glow */}
      <circle cx="256" cy="256" r="40" fill="hsl(var(--mindful-300))" opacity="0.3" />
      <circle cx="256" cy="256" r="20" fill="hsl(var(--mindful-200))" opacity="0.5" />
      
      <defs>
        <linearGradient id="mindfulnessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--mindful-600))" />
          <stop offset="50%" stopColor="hsl(var(--balance-500))" />
          <stop offset="100%" stopColor="hsl(var(--harmony-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default MindfulnessBasedTherapy;