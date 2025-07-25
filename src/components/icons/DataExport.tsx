import React from 'react';

interface DataExportProps {
  className?: string;
  size?: number;
}

const DataExport: React.FC<DataExportProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#exportGradient)" />
      <rect x="160" y="144" width="192" height="224" rx="16" fill="white" />
      <path d="M180 180h152v16H180zm0 32h152v16H180zm0 32h152v16H180zm0 32h120v16H180z" fill="hsl(var(--primary))" />
      
      {/* Export arrow */}
      <path 
        d="M380 200 L420 240 L380 280 M420 240 L360 240" 
        fill="none" 
        stroke="white" 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Cloud icon */}
      <path 
        d="M440 220 C448 212 464 212 472 220 C480 220 480 236 472 236 L444 236 C436 236 436 220 440 220 Z" 
        fill="white"
      />
      
      <defs>
        <linearGradient id="exportGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="50%" stopColor="hsl(var(--secondary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default DataExport;