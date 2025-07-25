import React from 'react';

interface ForOrganizationsProps {
  className?: string;
  size?: number;
}

const ForOrganizations: React.FC<ForOrganizationsProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#organizationsGradient)" />
      
      {/* Corporate building */}
      <rect x="180" y="160" width="152" height="224" rx="8" fill="white" />
      
      {/* Building floors */}
      <rect x="196" y="180" width="24" height="20" rx="2" fill="hsl(var(--primary))" />
      <rect x="228" y="180" width="24" height="20" rx="2" fill="hsl(var(--secondary))" />
      <rect x="260" y="180" width="24" height="20" rx="2" fill="hsl(var(--accent))" />
      <rect x="292" y="180" width="24" height="20" rx="2" fill="hsl(var(--primary))" />
      
      <rect x="196" y="220" width="24" height="20" rx="2" fill="hsl(var(--secondary))" />
      <rect x="228" y="220" width="24" height="20" rx="2" fill="hsl(var(--accent))" />
      <rect x="260" y="220" width="24" height="20" rx="2" fill="hsl(var(--primary))" />
      <rect x="292" y="220" width="24" height="20" rx="2" fill="hsl(var(--secondary))" />
      
      <rect x="196" y="260" width="24" height="20" rx="2" fill="hsl(var(--accent))" />
      <rect x="228" y="260" width="24" height="20" rx="2" fill="hsl(var(--primary))" />
      <rect x="260" y="260" width="24" height="20" rx="2" fill="hsl(var(--secondary))" />
      <rect x="292" y="260" width="24" height="20" rx="2" fill="hsl(var(--accent))" />
      
      {/* Employee wellness symbols */}
      <circle cx="140" cy="200" r="16" fill="white" />
      <path d="M135 195 C131 191 119 191 119 207 C119 207 119 219 135 227 C151 219 151 207 151 207 C151 191 139 191 135 195 Z" 
            fill="hsl(var(--primary))" />
      
      <circle cx="372" cy="200" r="16" fill="white" />
      <circle cx="372" cy="200" r="8" fill="hsl(var(--accent))" />
      <path d="M367 195 L377 195 M369 190 L375 190" stroke="white" strokeWidth="2" />
      
      {/* Organization chart connection */}
      <line x1="256" y1="120" x2="256" y2="160" stroke="white" strokeWidth="4" />
      <circle cx="256" cy="120" r="20" fill="white" />
      <rect x="248" y="112" width="16" height="16" rx="2" fill="hsl(var(--primary))" />
      
      {/* Enterprise security */}
      <rect x="220" y="320" width="72" height="40" rx="8" fill="hsl(var(--accent))" />
      <rect x="236" y="335" width="16" height="10" rx="2" fill="white" />
      <circle cx="244" cy="340" r="2" fill="hsl(var(--accent))" />
      <text x="256" y="350" textAnchor="middle" fill="white" fontSize="8">SECURE</text>
      
      <defs>
        <linearGradient id="organizationsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--purple-500))" />
          <stop offset="100%" stopColor="hsl(var(--indigo-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ForOrganizations;