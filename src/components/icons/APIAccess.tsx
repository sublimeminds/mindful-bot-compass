import React from 'react';

interface APIAccessProps {
  className?: string;
  size?: number;
}

const APIAccess: React.FC<APIAccessProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#apiGradient)" />
      <path 
        d="M160 192h192v32H160zm0 64h192v32H160zm0 64h128v32H160z" 
        fill="white"
      />
      <rect x="128" y="128" width="256" height="256" rx="16" fill="none" stroke="white" strokeWidth="8" />
      <circle cx="384" cy="160" r="16" fill="white" />
      <circle cx="384" cy="224" r="16" fill="white" />
      <circle cx="384" cy="288" r="16" fill="white" />
      <path d="M400 144h64v32h-64zm0 64h64v32h-64zm0 64h64v32h-64z" fill="white" />
      <defs>
        <linearGradient id="apiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="50%" stopColor="hsl(var(--secondary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default APIAccess;