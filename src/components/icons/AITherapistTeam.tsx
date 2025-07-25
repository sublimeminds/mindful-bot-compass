import React from 'react';

interface AITherapistTeamProps {
  className?: string;
  size?: number;
}

const AITherapistTeam: React.FC<AITherapistTeamProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#teamGradient)" />
      
      {/* AI Therapist figures */}
      <circle cx="180" cy="160" r="32" fill="white" />
      <rect x="148" y="208" width="64" height="80" rx="16" fill="white" />
      <circle cx="180" cy="140" r="16" fill="hsl(var(--primary))" />
      
      <circle cx="256" cy="140" r="36" fill="white" />
      <rect x="220" y="192" width="72" height="88" rx="18" fill="white" />
      <circle cx="256" cy="116" r="20" fill="hsl(var(--secondary))" />
      
      <circle cx="332" cy="160" r="32" fill="white" />
      <rect x="300" y="208" width="64" height="80" rx="16" fill="white" />
      <circle cx="332" cy="140" r="16" fill="hsl(var(--accent))" />
      
      {/* AI neural connections */}
      <line x1="212" y1="160" x2="224" y2="160" stroke="white" strokeWidth="3" opacity="0.7" />
      <line x1="288" y1="160" x2="300" y2="160" stroke="white" strokeWidth="3" opacity="0.7" />
      
      {/* Knowledge sharing symbols */}
      <rect x="160" y="320" width="192" height="48" rx="12" fill="white" />
      <rect x="176" y="336" width="40" height="6" rx="3" fill="hsl(var(--primary))" />
      <rect x="224" y="336" width="64" height="6" rx="3" fill="hsl(var(--secondary))" />
      <rect x="296" y="336" width="32" height="6" rx="3" fill="hsl(var(--accent))" />
      <rect x="176" y="350" width="56" height="6" rx="3" fill="hsl(var(--primary))" />
      <rect x="240" y="350" width="48" height="6" rx="3" fill="hsl(var(--secondary))" />
      
      <defs>
        <linearGradient id="teamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--cyan-500))" />
          <stop offset="50%" stopColor="hsl(var(--blue-500))" />
          <stop offset="100%" stopColor="hsl(var(--indigo-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default AITherapistTeam;