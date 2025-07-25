import React from 'react';

interface MentalHealthLibraryProps {
  className?: string;
  size?: number;
}

const MentalHealthLibrary: React.FC<MentalHealthLibraryProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#libraryGradient)" />
      
      {/* Bookshelf */}
      <rect x="120" y="120" width="272" height="272" rx="16" fill="white" />
      
      {/* Books */}
      <rect x="140" y="140" width="32" height="200" rx="4" fill="hsl(var(--therapy-500))" />
      <rect x="180" y="140" width="28" height="200" rx="4" fill="hsl(var(--calm-500))" />
      <rect x="216" y="140" width="36" height="200" rx="4" fill="hsl(var(--mindful-500))" />
      <rect x="260" y="140" width="30" height="200" rx="4" fill="hsl(var(--balance-500))" />
      <rect x="298" y="140" width="34" height="200" rx="4" fill="hsl(var(--harmony-500))" />
      <rect x="340" y="140" width="32" height="200" rx="4" fill="hsl(var(--flow-500))" />
      
      {/* Book spines with titles */}
      <rect x="144" y="160" width="24" height="4" rx="2" fill="white" opacity="0.8" />
      <rect x="144" y="180" width="20" height="4" rx="2" fill="white" opacity="0.8" />
      
      <rect x="184" y="160" width="20" height="4" rx="2" fill="white" opacity="0.8" />
      <rect x="184" y="180" width="16" height="4" rx="2" fill="white" opacity="0.8" />
      
      <rect x="220" y="160" width="28" height="4" rx="2" fill="white" opacity="0.8" />
      <rect x="220" y="180" width="24" height="4" rx="2" fill="white" opacity="0.8" />
      
      <rect x="264" y="160" width="22" height="4" rx="2" fill="white" opacity="0.8" />
      <rect x="264" y="180" width="18" height="4" rx="2" fill="white" opacity="0.8" />
      
      <rect x="302" y="160" width="26" height="4" rx="2" fill="white" opacity="0.8" />
      <rect x="302" y="180" width="22" height="4" rx="2" fill="white" opacity="0.8" />
      
      <rect x="344" y="160" width="24" height="4" rx="2" fill="white" opacity="0.8" />
      <rect x="344" y="180" width="20" height="4" rx="2" fill="white" opacity="0.8" />
      
      {/* Heart and brain symbol */}
      <path d="M256 80 C248 72 232 72 232 88 C232 88 232 104 256 120 C280 104 280 88 280 88 C280 72 264 72 256 80 Z" fill="white" />
      <circle cx="256" cy="380" r="24" fill="white" />
      <path d="M244 372 Q256 360 268 372 Q256 384 244 372" fill="hsl(var(--primary))" />
      <circle cx="256" cy="380" r="8" fill="hsl(var(--secondary))" />
      
      <defs>
        <linearGradient id="libraryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--emerald-600))" />
          <stop offset="50%" stopColor="hsl(var(--blue-600))" />
          <stop offset="100%" stopColor="hsl(var(--purple-600))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default MentalHealthLibrary;