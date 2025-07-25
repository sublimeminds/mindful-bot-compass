import React from 'react';

interface VoiceAITherapyProps {
  className?: string;
  size?: number;
}

const VoiceAITherapy: React.FC<VoiceAITherapyProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#voiceGradient)" />
      
      {/* Microphone */}
      <rect x="224" y="160" width="64" height="112" rx="32" fill="white" />
      <rect x="240" y="176" width="32" height="80" rx="16" fill="hsl(var(--primary))" />
      
      {/* Microphone stand */}
      <rect x="248" y="272" width="16" height="64" fill="white" />
      <rect x="208" y="328" width="96" height="16" rx="8" fill="white" />
      
      {/* Sound waves */}
      <path d="M160 200 Q140 216 160 232" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M140 180 Q110 216 140 252" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M120 160 Q80 216 120 272" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
      
      <path d="M352 200 Q372 216 352 232" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M372 180 Q402 216 372 252" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M392 160 Q432 216 392 272" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
      
      {/* AI brain symbol */}
      <circle cx="256" cy="120" r="24" fill="white" />
      <circle cx="256" cy="120" r="12" fill="hsl(var(--secondary))" />
      <circle cx="244" cy="112" r="4" fill="white" />
      <circle cx="268" cy="112" r="4" fill="white" />
      <circle cx="244" cy="128" r="4" fill="white" />
      <circle cx="268" cy="128" r="4" fill="white" />
      
      <defs>
        <linearGradient id="voiceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--indigo-500))" />
          <stop offset="50%" stopColor="hsl(var(--purple-500))" />
          <stop offset="100%" stopColor="hsl(var(--therapy-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default VoiceAITherapy;