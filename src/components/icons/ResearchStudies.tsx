import React from 'react';

interface ResearchStudiesProps {
  className?: string;
  size?: number;
}

const ResearchStudies: React.FC<ResearchStudiesProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#researchGradient)" />
      
      {/* Research book/journal */}
      <rect x="160" y="120" width="192" height="272" rx="16" fill="white" />
      <rect x="176" y="136" width="160" height="240" rx="8" fill="hsl(var(--primary))" opacity="0.1" />
      
      {/* Charts and graphs */}
      <rect x="192" y="160" width="128" height="80" rx="4" fill="white" />
      <rect x="200" y="208" width="16" height="24" fill="hsl(var(--primary))" />
      <rect x="224" y="200" width="16" height="32" fill="hsl(var(--secondary))" />
      <rect x="248" y="188" width="16" height="44" fill="hsl(var(--accent))" />
      <rect x="272" y="196" width="16" height="36" fill="hsl(var(--primary))" />
      <rect x="296" y="180" width="16" height="52" fill="hsl(var(--secondary))" />
      
      {/* Data points */}
      <circle cx="208" cy="280" r="4" fill="hsl(var(--primary))" />
      <circle cx="232" cy="275" r="4" fill="hsl(var(--secondary))" />
      <circle cx="256" cy="285" r="4" fill="hsl(var(--accent))" />
      <circle cx="280" cy="270" r="4" fill="hsl(var(--primary))" />
      <circle cx="304" cy="290" r="4" fill="hsl(var(--secondary))" />
      
      {/* Connection lines */}
      <path d="M208 280 L232 275 L256 285 L280 270 L304 290" 
            stroke="hsl(var(--accent))" strokeWidth="2" fill="none" />
      
      {/* Text lines */}
      <rect x="192" y="320" width="96" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
      <rect x="192" y="332" width="112" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
      <rect x="192" y="344" width="80" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
      
      {/* Magnifying glass */}
      <circle cx="380" cy="180" r="24" fill="white" />
      <circle cx="380" cy="180" r="16" fill="none" stroke="hsl(var(--accent))" strokeWidth="3" />
      <line x1="392" y1="192" x2="404" y2="204" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" />
      
      <defs>
        <linearGradient id="researchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--blue-600))" />
          <stop offset="50%" stopColor="hsl(var(--indigo-500))" />
          <stop offset="100%" stopColor="hsl(var(--purple-600))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ResearchStudies;