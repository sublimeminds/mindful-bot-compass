import React from 'react';

interface MoodProgressTrackingProps {
  className?: string;
  size?: number;
}

const MoodProgressTracking: React.FC<MoodProgressTrackingProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#moodGradient)" />
      
      {/* Heart base */}
      <path d="M256 400 C200 340 160 300 160 240 C160 200 200 160 240 160 C248 160 256 164 256 172 C256 164 264 160 272 160 C312 160 352 200 352 240 C352 300 312 340 256 400 Z" fill="white" />
      
      {/* Progress chart inside heart */}
      <rect x="200" y="220" width="8" height="80" rx="4" fill="hsl(var(--primary))" />
      <rect x="220" y="200" width="8" height="100" rx="4" fill="hsl(var(--secondary))" />
      <rect x="240" y="180" width="8" height="120" rx="4" fill="hsl(var(--accent))" />
      <rect x="260" y="160" width="8" height="140" rx="4" fill="hsl(var(--primary))" />
      <rect x="280" y="190" width="8" height="110" rx="4" fill="hsl(var(--secondary))" />
      <rect x="300" y="210" width="8" height="90" rx="4" fill="hsl(var(--accent))" />
      
      {/* Mood indicators */}
      <circle cx="180" cy="180" r="12" fill="white" />
      <path d="M174 176 Q180 172 186 176 Q180 184 174 176" fill="hsl(var(--accent))" />
      
      <circle cx="332" cy="180" r="12" fill="white" />
      <path d="M326 176 Q332 172 338 176 Q332 184 326 176" fill="hsl(var(--primary))" />
      
      <defs>
        <linearGradient id="moodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--calm-500))" />
          <stop offset="100%" stopColor="hsl(var(--therapy-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default MoodProgressTracking;