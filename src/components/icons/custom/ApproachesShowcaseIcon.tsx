import React from 'react';

interface ApproachesShowcaseIconProps {
  className?: string;
  size?: number;
}

const ApproachesShowcaseIcon: React.FC<ApproachesShowcaseIconProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#approachesGradient)" />
      
      {/* Central hub representing 60+ approaches */}
      <circle cx="256" cy="256" r="80" fill="white" opacity="0.9" />
      <circle cx="256" cy="256" r="60" fill="url(#centerGradient)" />
      
      {/* Surrounding approach circles */}
      <circle cx="180" cy="180" r="24" fill="white" opacity="0.8" />
      <circle cx="332" cy="180" r="24" fill="white" opacity="0.8" />
      <circle cx="180" cy="332" r="24" fill="white" opacity="0.8" />
      <circle cx="332" cy="332" r="24" fill="white" opacity="0.8" />
      <circle cx="256" cy="140" r="20" fill="white" opacity="0.7" />
      <circle cx="256" cy="372" r="20" fill="white" opacity="0.7" />
      <circle cx="140" cy="256" r="20" fill="white" opacity="0.7" />
      <circle cx="372" cy="256" r="20" fill="white" opacity="0.7" />
      
      {/* Connection lines */}
      <g stroke="white" strokeWidth="3" opacity="0.5">
        <line x1="204" y1="204" x2="232" y2="232" />
        <line x1="308" y1="204" x2="280" y2="232" />
        <line x1="204" y1="308" x2="232" y2="280" />
        <line x1="308" y1="308" x2="280" y2="280" />
        <line x1="256" y1="164" x2="256" y2="196" />
        <line x1="256" y1="348" x2="256" y2="316" />
        <line x1="164" y1="256" x2="196" y2="256" />
        <line x1="348" y1="256" x2="316" y2="256" />
      </g>
      
      {/* Central text */}
      <text x="256" y="246" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">60+</text>
      <text x="256" y="270" textAnchor="middle" fill="white" fontSize="14">Approaches</text>
      
      <defs>
        <linearGradient id="approachesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--therapy-500))" />
          <stop offset="50%" stopColor="hsl(var(--harmony-500))" />
          <stop offset="100%" stopColor="hsl(var(--calm-500))" />
        </linearGradient>
        <radialGradient id="centerGradient">
          <stop offset="0%" stopColor="hsl(var(--therapy-400))" />
          <stop offset="100%" stopColor="hsl(var(--harmony-600))" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default ApproachesShowcaseIcon;