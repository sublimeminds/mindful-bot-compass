import React from 'react';

interface BlogInsightsProps {
  className?: string;
  size?: number;
}

const BlogInsights: React.FC<BlogInsightsProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#blogGradient)" />
      
      {/* Document */}
      <rect x="160" y="128" width="192" height="256" rx="12" fill="white" />
      
      {/* Text lines */}
      <rect x="180" y="160" width="120" height="8" rx="4" fill="hsl(var(--primary))" />
      <rect x="180" y="180" width="152" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="180" y="192" width="140" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="180" y="204" width="160" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="180" y="216" width="130" height="4" rx="2" fill="hsl(var(--secondary))" />
      
      {/* Chart/insights section */}
      <rect x="180" y="240" width="152" height="80" rx="4" fill="hsl(var(--accent)/0.1)" />
      <rect x="190" y="280" width="8" height="30" rx="2" fill="hsl(var(--accent))" />
      <rect x="210" y="270" width="8" height="40" rx="2" fill="hsl(var(--accent))" />
      <rect x="230" y="260" width="8" height="50" rx="2" fill="hsl(var(--accent))" />
      <rect x="250" y="275" width="8" height="35" rx="2" fill="hsl(var(--accent))" />
      <rect x="270" y="265" width="8" height="45" rx="2" fill="hsl(var(--accent))" />
      <rect x="290" y="250" width="8" height="60" rx="2" fill="hsl(var(--accent))" />
      <rect x="310" y="270" width="8" height="40" rx="2" fill="hsl(var(--accent))" />
      
      {/* Lightbulb icon for insights */}
      <circle cx="320" cy="180" r="16" fill="hsl(var(--accent))" />
      <rect x="315" y="192" width="10" height="12" rx="2" fill="hsl(var(--accent))" />
      <path d="M310 175 L330 175 M312 170 L328 170" stroke="white" strokeWidth="2" />
      
      <defs>
        <linearGradient id="blogGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="50%" stopColor="hsl(var(--secondary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default BlogInsights;