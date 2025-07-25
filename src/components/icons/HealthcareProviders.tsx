import React from 'react';

interface HealthcareProvidersProps {
  className?: string;
  size?: number;
}

const HealthcareProviders: React.FC<HealthcareProvidersProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#providersGradient)" />
      
      {/* Healthcare provider figure */}
      <circle cx="200" cy="160" r="32" fill="white" />
      <rect x="168" y="208" width="64" height="96" rx="16" fill="white" />
      
      {/* Stethoscope */}
      <circle cx="180" cy="230" r="8" fill="hsl(var(--primary))" />
      <path d="M180 238 Q160 250 160 270 Q160 290 180 290" 
            stroke="hsl(var(--primary))" strokeWidth="3" fill="none" />
      <circle cx="180" cy="290" r="6" fill="hsl(var(--primary))" />
      
      {/* Patient data/chart */}
      <rect x="260" y="140" width="120" height="160" rx="8" fill="white" />
      <rect x="275" y="155" width="90" height="20" rx="4" fill="hsl(var(--primary))" />
      <text x="320" y="169" textAnchor="middle" fill="white" fontSize="10">Patient Chart</text>
      
      {/* Chart data */}
      <rect x="275" y="185" width="60" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="275" y="195" width="80" height="4" rx="2" fill="hsl(var(--secondary))" />
      <rect x="275" y="205" width="45" height="4" rx="2" fill="hsl(var(--secondary))" />
      
      {/* Vital signs graph */}
      <polyline points="280,230 295,220 310,235 325,215 340,225 355,210" 
                stroke="hsl(var(--accent))" strokeWidth="2" fill="none" />
      
      {/* Medical cross */}
      <rect x="150" y="340" width="24" height="8" rx="2" fill="white" />
      <rect x="158" y="332" width="8" height="24" rx="2" fill="white" />
      
      {/* Digital health tech */}
      <circle cx="350" cy="350" r="24" fill="white" />
      <rect x="338" y="338" width="24" height="16" rx="4" fill="hsl(var(--accent))" />
      <rect x="342" y="342" width="16" height="2" rx="1" fill="white" />
      <rect x="342" y="346" width="12" height="2" rx="1" fill="white" />
      <rect x="342" y="350" width="8" height="2" rx="1" fill="white" />
      
      <defs>
        <linearGradient id="providersGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--balance-500))" />
          <stop offset="100%" stopColor="hsl(var(--therapy-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default HealthcareProviders;