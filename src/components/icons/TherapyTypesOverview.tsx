import React from 'react';

interface TherapyTypesOverviewProps {
  className?: string;
  size?: number;
}

const TherapyTypesOverview: React.FC<TherapyTypesOverviewProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#therapyTypesGradient)" />
      
      {/* Central hub representing comprehensive therapy */}
      <circle cx="256" cy="256" r="48" fill="white" />
      <circle cx="256" cy="256" r="32" fill="hsl(var(--therapy-500))" />
      <circle cx="256" cy="256" r="16" fill="white" />
      
      {/* Radiating therapy type nodes */}
      {/* CBT node */}
      <circle cx="180" cy="140" r="24" fill="white" opacity="0.95" />
      <circle cx="180" cy="140" r="16" fill="hsl(var(--harmony-500))" />
      
      {/* Trauma therapy node */}
      <circle cx="332" cy="140" r="24" fill="white" opacity="0.95" />
      <circle cx="332" cy="140" r="16" fill="hsl(var(--calm-500))" />
      
      {/* Family therapy node */}
      <circle cx="140" cy="256" r="24" fill="white" opacity="0.95" />
      <circle cx="140" cy="256" r="16" fill="hsl(var(--balance-500))" />
      
      {/* Mindfulness node */}
      <circle cx="372" cy="256" r="24" fill="white" opacity="0.95" />
      <circle cx="372" cy="256" r="16" fill="hsl(var(--flow-500))" />
      
      {/* Group therapy node */}
      <circle cx="180" cy="372" r="24" fill="white" opacity="0.95" />
      <circle cx="180" cy="372" r="16" fill="hsl(var(--healing-500))" />
      
      {/* Specialized therapy node */}
      <circle cx="332" cy="372" r="24" fill="white" opacity="0.95" />
      <circle cx="332" cy="372" r="16" fill="hsl(var(--mindful-500))" />
      
      {/* Connection lines from center to nodes */}
      <line x1="256" y1="256" x2="180" y2="140" stroke="white" strokeWidth="3" opacity="0.7" />
      <line x1="256" y1="256" x2="332" y2="140" stroke="white" strokeWidth="3" opacity="0.7" />
      <line x1="256" y1="256" x2="140" y2="256" stroke="white" strokeWidth="3" opacity="0.7" />
      <line x1="256" y1="256" x2="372" y2="256" stroke="white" strokeWidth="3" opacity="0.7" />
      <line x1="256" y1="256" x2="180" y2="372" stroke="white" strokeWidth="3" opacity="0.7" />
      <line x1="256" y1="256" x2="332" y2="372" stroke="white" strokeWidth="3" opacity="0.7" />
      
      {/* Interconnection lines between therapy types */}
      <line x1="180" y1="140" x2="332" y2="140" stroke="white" strokeWidth="2" opacity="0.5" />
      <line x1="140" y1="256" x2="180" y2="140" stroke="white" strokeWidth="2" opacity="0.5" />
      <line x1="372" y1="256" x2="332" y2="140" stroke="white" strokeWidth="2" opacity="0.5" />
      <line x1="180" y1="372" x2="140" y2="256" stroke="white" strokeWidth="2" opacity="0.5" />
      <line x1="332" y1="372" x2="372" y2="256" stroke="white" strokeWidth="2" opacity="0.5" />
      <line x1="180" y1="372" x2="332" y2="372" stroke="white" strokeWidth="2" opacity="0.5" />
      
      {/* Small accent dots for additional therapy types */}
      <circle cx="256" cy="120" r="6" fill="white" />
      <circle cx="390" cy="200" r="6" fill="white" />
      <circle cx="390" cy="312" r="6" fill="white" />
      <circle cx="256" cy="392" r="6" fill="white" />
      <circle cx="122" cy="312" r="6" fill="white" />
      <circle cx="122" cy="200" r="6" fill="white" />
      
      <defs>
        <linearGradient id="therapyTypesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--therapy-500))" />
          <stop offset="50%" stopColor="hsl(var(--harmony-500))" />
          <stop offset="100%" stopColor="hsl(var(--balance-600))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default TherapyTypesOverview;