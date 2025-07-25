import React from 'react';

interface ProgressReportsProps {
  className?: string;
  size?: number;
}

const ProgressReports: React.FC<ProgressReportsProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#progressGradient)" />
      
      {/* Report document */}
      <rect x="160" y="128" width="192" height="256" rx="12" fill="white" />
      
      {/* Header */}
      <rect x="180" y="148" width="152" height="24" rx="4" fill="hsl(var(--primary))" />
      <text x="256" y="165" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Progress Report</text>
      
      {/* Progress bars */}
      <rect x="180" y="200" width="120" height="8" rx="4" fill="hsl(var(--muted))" />
      <rect x="180" y="200" width="96" height="8" rx="4" fill="hsl(var(--accent))" />
      <text x="310" y="208" fill="hsl(var(--accent))" fontSize="10">80%</text>
      
      <rect x="180" y="220" width="120" height="8" rx="4" fill="hsl(var(--muted))" />
      <rect x="180" y="220" width="72" height="8" rx="4" fill="hsl(var(--secondary))" />
      <text x="310" y="228" fill="hsl(var(--secondary))" fontSize="10">60%</text>
      
      <rect x="180" y="240" width="120" height="8" rx="4" fill="hsl(var(--muted))" />
      <rect x="180" y="240" width="108" height="8" rx="4" fill="hsl(var(--primary))" />
      <text x="310" y="248" fill="hsl(var(--primary))" fontSize="10">90%</text>
      
      {/* Trending arrow */}
      <path d="M300 280 L330 280 L325 275 M330 280 L325 285" 
            stroke="hsl(var(--accent))" strokeWidth="3" fill="none" strokeLinecap="round" />
      
      {/* Chart area */}
      <rect x="180" y="300" width="152" height="64" rx="4" fill="hsl(var(--accent)/0.1)" />
      <polyline points="190,350 210,340 230,330 250,325 270,320 290,315 310,310 322,305" 
                stroke="hsl(var(--accent))" strokeWidth="2" fill="none" />
      
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--green-500))" />
          <stop offset="100%" stopColor="hsl(var(--emerald-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ProgressReports;