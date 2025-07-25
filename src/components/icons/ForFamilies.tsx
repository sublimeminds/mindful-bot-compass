import React from 'react';

interface ForFamiliesProps {
  className?: string;
  size?: number;
}

const ForFamilies: React.FC<ForFamiliesProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#familiesGradient)" />
      
      {/* Family figures */}
      <circle cx="180" cy="180" r="24" fill="white" />
      <rect x="156" y="220" width="48" height="64" rx="12" fill="white" />
      
      <circle cx="256" cy="160" r="28" fill="white" />
      <rect x="228" y="204" width="56" height="72" rx="14" fill="white" />
      
      <circle cx="332" cy="180" r="24" fill="white" />
      <rect x="308" y="220" width="48" height="64" rx="12" fill="white" />
      
      {/* Children */}
      <circle cx="210" cy="320" r="16" fill="white" />
      <rect x="194" y="344" width="32" height="40" rx="8" fill="white" />
      
      <circle cx="302" cy="320" r="16" fill="white" />
      <rect x="286" y="344" width="32" height="40" rx="8" fill="white" />
      
      {/* Heart above family */}
      <path d="M256 120 C248 112 232 112 232 128 C232 128 232 144 256 160 C280 144 280 128 280 128 C280 112 264 112 256 120 Z" fill="white" />
      
      <defs>
        <linearGradient id="familiesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--balance-400))" />
          <stop offset="50%" stopColor="hsl(var(--therapy-500))" />
          <stop offset="100%" stopColor="hsl(var(--mindful-600))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ForFamilies;