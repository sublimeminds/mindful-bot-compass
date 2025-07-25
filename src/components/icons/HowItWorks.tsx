import React from 'react';

interface HowItWorksProps {
  className?: string;
  size?: number;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#howItWorksGradient)" />
      
      {/* Process steps */}
      <circle cx="180" cy="200" r="32" fill="white" />
      <text x="180" y="208" textAnchor="middle" fill="hsl(var(--primary))" fontSize="24" fontWeight="bold">1</text>
      
      <circle cx="332" cy="200" r="32" fill="white" />
      <text x="332" y="208" textAnchor="middle" fill="hsl(var(--primary))" fontSize="24" fontWeight="bold">2</text>
      
      <circle cx="256" cy="312" r="32" fill="white" />
      <text x="256" y="320" textAnchor="middle" fill="hsl(var(--primary))" fontSize="24" fontWeight="bold">3</text>
      
      {/* Arrows */}
      <path d="M212 200 L300 200 M290 190 L300 200 L290 210" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M320 232 L268 280 M275 285 L268 280 L275 273" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M224 280 L192 232 M185 240 L192 232 L199 240" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
      
      <defs>
        <linearGradient id="howItWorksGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="50%" stopColor="hsl(var(--secondary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default HowItWorks;