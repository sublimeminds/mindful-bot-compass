import React from 'react';

interface IntegrationsHubProps {
  className?: string;
  size?: number;
}

const IntegrationsHub: React.FC<IntegrationsHubProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#integrationsGradient)" />
      
      {/* Central hub */}
      <circle cx="256" cy="256" r="32" fill="white" />
      
      {/* Connected nodes */}
      <circle cx="160" cy="160" r="24" fill="white" />
      <circle cx="352" cy="160" r="24" fill="white" />
      <circle cx="160" cy="352" r="24" fill="white" />
      <circle cx="352" cy="352" r="24" fill="white" />
      <circle cx="256" cy="128" r="24" fill="white" />
      <circle cx="256" cy="384" r="24" fill="white" />
      
      {/* Connection lines */}
      <line x1="184" y1="184" x2="224" y2="224" stroke="white" strokeWidth="4" />
      <line x1="328" y1="184" x2="288" y2="224" stroke="white" strokeWidth="4" />
      <line x1="184" y1="328" x2="224" y2="288" stroke="white" strokeWidth="4" />
      <line x1="328" y1="328" x2="288" y2="288" stroke="white" strokeWidth="4" />
      <line x1="256" y1="152" x2="256" y2="224" stroke="white" strokeWidth="4" />
      <line x1="256" y1="360" x2="256" y2="288" stroke="white" strokeWidth="4" />
      
      <defs>
        <linearGradient id="integrationsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="50%" stopColor="hsl(var(--secondary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default IntegrationsHub;