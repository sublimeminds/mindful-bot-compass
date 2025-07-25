import React from 'react';

interface AnalyticsDashboardProps {
  className?: string;
  size?: number;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#analyticsGradient)" />
      
      {/* Dashboard frame */}
      <rect x="128" y="128" width="256" height="256" rx="16" fill="white" />
      
      {/* Chart sections */}
      <rect x="144" y="144" width="224" height="32" rx="4" fill="hsl(var(--primary))" />
      <text x="256" y="165" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Analytics Dashboard</text>
      
      {/* Bar chart */}
      <rect x="160" y="320" width="16" height="48" rx="2" fill="hsl(var(--accent))" />
      <rect x="186" y="300" width="16" height="68" rx="2" fill="hsl(var(--secondary))" />
      <rect x="212" y="280" width="16" height="88" rx="2" fill="hsl(var(--primary))" />
      <rect x="238" y="290" width="16" height="78" rx="2" fill="hsl(var(--accent))" />
      <rect x="264" y="270" width="16" height="98" rx="2" fill="hsl(var(--secondary))" />
      <rect x="290" y="310" width="16" height="58" rx="2" fill="hsl(var(--primary))" />
      <rect x="316" y="285" width="16" height="83" rx="2" fill="hsl(var(--accent))" />
      
      {/* Pie chart */}
      <circle cx="200" cy="220" r="24" fill="hsl(var(--primary))" />
      <path d="M200 196 A24 24 0 0 1 224 220 Z" fill="hsl(var(--secondary))" />
      <path d="M224 220 A24 24 0 0 1 212 242 Z" fill="hsl(var(--accent))" />
      
      {/* Line chart */}
      <polyline points="260,200 280,180 300,190 320,170 340,185" 
                stroke="hsl(var(--primary))" strokeWidth="3" fill="none" />
      <circle cx="260" cy="200" r="3" fill="hsl(var(--primary))" />
      <circle cx="280" cy="180" r="3" fill="hsl(var(--primary))" />
      <circle cx="300" cy="190" r="3" fill="hsl(var(--primary))" />
      <circle cx="320" cy="170" r="3" fill="hsl(var(--primary))" />
      <circle cx="340" cy="185" r="3" fill="hsl(var(--primary))" />
      
      <defs>
        <linearGradient id="analyticsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--orange-500))" />
          <stop offset="100%" stopColor="hsl(var(--red-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default AnalyticsDashboard;