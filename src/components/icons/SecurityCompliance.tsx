import React from 'react';

interface SecurityComplianceProps {
  className?: string;
  size?: number;
}

const SecurityCompliance: React.FC<SecurityComplianceProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="url(#securityGradient)" />
      
      {/* Main security shield */}
      <path d="M256 80 L320 120 L320 240 Q320 280 256 320 Q192 280 192 240 L192 120 Z" fill="white" />
      
      {/* Lock symbol */}
      <rect x="240" y="220" width="32" height="40" rx="8" fill="hsl(var(--primary))" />
      <circle cx="256" cy="200" r="12" fill="none" stroke="hsl(var(--primary))" strokeWidth="4" />
      <circle cx="256" cy="240" r="4" fill="white" />
      
      {/* Compliance badges */}
      <circle cx="160" cy="160" r="28" fill="white" />
      <text x="160" y="155" textAnchor="middle" fill="hsl(var(--primary))" fontSize="10" fontWeight="bold">HIPAA</text>
      <text x="160" y="168" textAnchor="middle" fill="hsl(var(--secondary))" fontSize="8">✓</text>
      
      <circle cx="352" cy="160" r="28" fill="white" />
      <text x="352" y="155" textAnchor="middle" fill="hsl(var(--primary))" fontSize="10" fontWeight="bold">GDPR</text>
      <text x="352" y="168" textAnchor="middle" fill="hsl(var(--secondary))" fontSize="8">✓</text>
      
      <circle cx="160" cy="300" r="28" fill="white" />
      <text x="160" y="295" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9" fontWeight="bold">SOC 2</text>
      <text x="160" y="308" textAnchor="middle" fill="hsl(var(--secondary))" fontSize="8">✓</text>
      
      <circle cx="352" cy="300" r="28" fill="white" />
      <text x="352" y="295" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9" fontWeight="bold">ISO 27001</text>
      <text x="352" y="308" textAnchor="middle" fill="hsl(var(--secondary))" fontSize="6">✓</text>
      
      {/* Encryption indicators */}
      <rect x="220" y="350" width="72" height="24" rx="8" fill="white" />
      <text x="256" y="365" textAnchor="middle" fill="hsl(var(--accent))" fontSize="10" fontWeight="bold">256-bit SSL</text>
      
      {/* Security layers */}
      <circle cx="256" cy="400" r="48" fill="white" opacity="0.3" />
      <circle cx="256" cy="400" r="32" fill="white" opacity="0.5" />
      <circle cx="256" cy="400" r="16" fill="white" />
      <rect x="248" y="392" width="16" height="16" rx="2" fill="hsl(var(--accent))" />
      
      <defs>
        <linearGradient id="securityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--therapy-600))" />
          <stop offset="100%" stopColor="hsl(var(--harmony-600))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default SecurityCompliance;