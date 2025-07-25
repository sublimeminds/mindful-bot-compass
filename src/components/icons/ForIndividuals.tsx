import React from 'react';

interface ForIndividualsProps {
  className?: string;
  size?: number;
}

const ForIndividuals: React.FC<ForIndividualsProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#individualsGradient)" />
      
      {/* Person silhouette */}
      <circle cx="256" cy="180" r="48" fill="white" />
      <rect x="208" y="244" width="96" height="120" rx="24" fill="white" />
      
      {/* Personal journey path */}
      <path d="M150 400 Q200 350 256 360 Q312 370 362 400" 
            stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
      
      {/* Growth milestones */}
      <circle cx="180" cy="380" r="8" fill="white" />
      <circle cx="220" cy="365" r="8" fill="white" />
      <circle cx="256" cy="360" r="8" fill="white" />
      <circle cx="292" cy="365" r="8" fill="white" />
      <circle cx="332" cy="380" r="8" fill="white" />
      
      {/* Personal insights */}
      <circle cx="320" cy="160" r="20" fill="white" />
      <path d="M315 155 L325 155 M317 150 L323 150" stroke="hsl(var(--primary))" strokeWidth="2" />
      <circle cx="320" cy="165" r="8" fill="hsl(var(--accent))" />
      
      {/* Self-care symbols */}
      <path d="M190 140 C186 136 170 136 170 152 C170 152 170 168 190 180 C210 168 210 152 210 152 C210 136 194 136 190 140 Z" 
            fill="white" />
      
      <defs>
        <linearGradient id="individualsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--therapy-500))" />
          <stop offset="100%" stopColor="hsl(var(--calm-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ForIndividuals;