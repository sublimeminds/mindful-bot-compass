import React from 'react';

interface CognitiveBehavioralTherapyProps {
  className?: string;
  size?: number;
}

const CognitiveBehavioralTherapy: React.FC<CognitiveBehavioralTherapyProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#cbtGradient)" />
      
      {/* Brain representing cognitive component */}
      <path d="M180 160 Q200 140 220 160 Q240 140 260 160 Q280 140 300 160 Q320 180 300 200 Q280 220 260 200 Q240 220 220 200 Q200 220 180 200 Q160 180 180 160" fill="white" />
      <circle cx="200" cy="180" r="8" fill="hsl(var(--primary))" />
      <circle cx="240" cy="170" r="8" fill="hsl(var(--secondary))" />
      <circle cx="280" cy="180" r="8" fill="hsl(var(--accent))" />
      
      {/* Thought patterns */}
      <path d="M160 140 Q180 120 200 140" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M280 140 Q300 120 320 140" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
      
      {/* Behavioral component - action arrows */}
      <rect x="180" y="260" width="152" height="80" rx="16" fill="white" />
      <path d="M200 280 L220 300 L200 320 M220 300 L312 300" stroke="hsl(var(--primary))" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Cycle arrows showing CBT triangle */}
      <path d="M240 220 L200 260" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M280 220 L320 260" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M200 340 L240 380" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M320 340 L280 380" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
      
      {/* Feelings component - heart */}
      <path d="M240 360 C232 352 216 352 216 368 C216 368 216 384 240 400 C264 384 264 368 264 368 C264 352 248 352 240 360" fill="white" />
      <circle cx="240" cy="375" r="12" fill="hsl(var(--therapy-400))" />
      
      {/* Progress indicators */}
      <circle cx="360" cy="200" r="16" fill="white" />
      <path d="M352 192 L360 200 L368 192" stroke="hsl(var(--success))" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M352 205 L360 213 L368 205" stroke="hsl(var(--success))" strokeWidth="3" fill="none" strokeLinecap="round" />
      
      <defs>
        <linearGradient id="cbtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--blue-600))" />
          <stop offset="50%" stopColor="hsl(var(--therapy-500))" />
          <stop offset="100%" stopColor="hsl(var(--cyan-600))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CognitiveBehavioralTherapy;