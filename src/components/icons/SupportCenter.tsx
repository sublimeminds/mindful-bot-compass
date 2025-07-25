import React from 'react';

interface SupportCenterProps {
  className?: string;
  size?: number;
}

const SupportCenter: React.FC<SupportCenterProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#supportGradient)" />
      
      {/* Support agent with headset */}
      <circle cx="256" cy="180" r="40" fill="white" />
      <rect x="216" y="236" width="80" height="100" rx="20" fill="white" />
      
      {/* Headset */}
      <path d="M220 160 Q256 140 292 160" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
      <circle cx="220" cy="160" r="12" fill="white" />
      <circle cx="292" cy="160" r="12" fill="white" />
      
      {/* Microphone */}
      <rect x="200" y="170" width="8" height="20" rx="4" fill="white" />
      <circle cx="204" cy="195" r="6" fill="hsl(var(--primary))" />
      
      {/* 24/7 availability */}
      <circle cx="380" cy="140" r="24" fill="white" />
      <text x="380" y="135" textAnchor="middle" fill="hsl(var(--primary))" fontSize="10" fontWeight="bold">24</text>
      <text x="380" y="148" textAnchor="middle" fill="hsl(var(--secondary))" fontSize="10" fontWeight="bold">7</text>
      
      {/* Help bubbles */}
      <circle cx="160" cy="200" r="20" fill="white" />
      <text x="160" y="205" textAnchor="middle" fill="hsl(var(--accent))" fontSize="16">?</text>
      
      <circle cx="140" cy="280" r="16" fill="white" />
      <text x="140" y="285" textAnchor="middle" fill="hsl(var(--accent))" fontSize="12">!</text>
      
      {/* Support channels */}
      <rect x="320" y="240" width="60" height="80" rx="8" fill="white" />
      <rect x="330" y="250" width="40" height="16" rx="4" fill="hsl(var(--primary))" />
      <text x="350" y="260" textAnchor="middle" fill="white" fontSize="8">Chat</text>
      
      <rect x="330" y="275" width="40" height="16" rx="4" fill="hsl(var(--secondary))" />
      <text x="350" y="285" textAnchor="middle" fill="white" fontSize="8">Email</text>
      
      <rect x="330" y="300" width="40" height="16" rx="4" fill="hsl(var(--accent))" />
      <text x="350" y="310" textAnchor="middle" fill="white" fontSize="8">Phone</text>
      
      {/* Crisis hotline indicator */}
      <rect x="200" y="380" width="112" height="24" rx="8" fill="hsl(var(--primary))" />
      <text x="256" y="395" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Crisis Support</text>
      
      <defs>
        <linearGradient id="supportGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--harmony-500))" />
          <stop offset="100%" stopColor="hsl(var(--balance-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default SupportCenter;