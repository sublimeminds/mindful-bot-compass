import React from 'react';

interface PricingPlansProps {
  className?: string;
  size?: number;
}

const PricingPlans: React.FC<PricingPlansProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#pricingGradient)" />
      
      {/* Three pricing tiers */}
      <rect x="120" y="180" width="80" height="152" rx="8" fill="white" />
      <rect x="216" y="160" width="80" height="192" rx="8" fill="white" />
      <rect x="312" y="180" width="80" height="152" rx="8" fill="white" />
      
      {/* Dollar signs */}
      <text x="160" y="220" textAnchor="middle" fill="hsl(var(--primary))" fontSize="24" fontWeight="bold">$</text>
      <text x="256" y="200" textAnchor="middle" fill="hsl(var(--primary))" fontSize="32" fontWeight="bold">$$</text>
      <text x="352" y="220" textAnchor="middle" fill="hsl(var(--primary))" fontSize="24" fontWeight="bold">$$$</text>
      
      {/* Features */}
      <rect x="130" y="240" width="60" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="130" y="250" width="50" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="130" y="260" width="40" height="4" rx="2" fill="hsl(var(--secondary))" />
      
      <rect x="226" y="220" width="60" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="226" y="230" width="50" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="226" y="240" width="60" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="226" y="250" width="40" height="4" rx="2" fill="hsl(var(--secondary))" />
      
      <rect x="322" y="240" width="60" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="322" y="250" width="50" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="322" y="260" width="60" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="322" y="270" width="40" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="322" y="280" width="30" height="4" rx="2" fill="hsl(var(--secondary))" />
      
      {/* Crown on middle tier */}
      <path d="M240 140 L256 150 L272 140 L268 155 L244 155 Z" fill="hsl(var(--accent))" />
      <circle cx="240" cy="145" r="3" fill="hsl(var(--accent))" />
      <circle cx="256" cy="140" r="3" fill="hsl(var(--accent))" />
      <circle cx="272" cy="145" r="3" fill="hsl(var(--accent))" />
      
      <defs>
        <linearGradient id="pricingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="50%" stopColor="hsl(var(--secondary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default PricingPlans;